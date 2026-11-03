"use client";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  type Transition,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { createContext, useContext, useId, useRef, useState } from "react";

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
};

// A swipe counts when it travels far enough or is flicked fast enough.
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 400;

// The bento grid shows at most this many tiles; the last one becomes "+N more".
const MAX_TILES = 5;

// `sizes` for the grid images. The lightbox reuses them for its instant
// preview layer, so it hits the copy the browser already downloaded.
const TILE_SIZES = "(max-width: 640px) 50vw, 40ch";
const SINGLE_SIZES = "(max-width: 768px) 100vw, 80ch";

// Shared by the tile and the lightbox so the zoom runs the same both ways.
const ZOOM_DURATION = 0.35;
const ZOOM: Transition = {
  layout: { duration: ZOOM_DURATION, ease: [0.2, 0, 0, 1] },
};

/**
 * Bento layout, by number of tiles shown:
 *   2: two halves
 *   3: tall tile on the left, two stacked on the right
 *   4: tall tile on the left, two on top right, one wide one below
 *   5+: tall tile on the left and a 2x2 on the right
 * The grid has a fixed height, so the text below starts at the same place
 * however many images an app has.
 */
const GRID_COLUMNS: Record<number, string> = {
  2: "grid-cols-2 grid-rows-1",
  3: "grid-cols-2 grid-rows-2",
  4: "grid-cols-3 grid-rows-2",
  5: "grid-cols-3 grid-rows-2",
};

function tileSpan(index: number, tiles: number) {
  if (tiles >= 3 && index === 0) return "row-span-2";
  if (tiles === 4 && index === 3) return "col-span-2";
  return "";
}

/**
 * The zoom is a shared-layout animation between a tile and the lightbox, using
 * two layoutIds per image:
 * - `clip` is the visible box: the tile's cell, or the whole image in the
 *   lightbox. It may change shape while it animates.
 * - `img` always has the image's own aspect ratio (in a tile it overflows the
 *   cell and is clipped), so the picture itself scales evenly, never squashed.
 */
const zoomIds = (key: string) => ({ clip: `${key}-clip`, img: `${key}-img` });

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Zoom only between a tile and the image it opened; once you move to
  // another image, closing fades instead.
  const [zoom, setZoom] = useState(false);
  // The image last on screen; kept after closing for the close animation and
  // for returning focus.
  const [viewed, setViewed] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const id = useId();

  if (images.length === 0) return null;

  const tiles = Math.min(images.length, MAX_TILES);
  const hidden = images.length - tiles;
  const zoomKey = (index: number) => `${id}-${index}`;

  const openFromTile = (index: number) => {
    setViewed(index);
    setZoom(true);
    setOpenIndex(index);
  };

  const navigate = (index: number | null) => {
    if (index !== null) {
      setViewed(index);
      setZoom(false);
    }
    setOpenIndex(index);
  };

  // Return focus to the tile of the image that was last on screen; images
  // past the grid all live behind the "+N more" tile.
  const restoreFocus = (event: Event) => {
    event.preventDefault();
    const tile = Math.min(viewed, tiles - 1);
    container.current
      ?.querySelector<HTMLButtonElement>(`[data-index="${tile}"]`)
      ?.focus();
  };

  return (
    <div ref={container}>
      {images.length === 1 ? (
        <SingleImage
          image={images[0]}
          zoomKey={zoomKey(0)}
          onOpen={() => openFromTile(0)}
        />
      ) : (
        <div
          className={cn(
            "grid h-64 gap-2 sm:h-96 sm:gap-3",
            GRID_COLUMNS[tiles],
          )}
        >
          {images.slice(0, tiles).map((image, index) => (
            <Tile
              key={image.src}
              image={image}
              index={index}
              total={images.length}
              more={index === tiles - 1 ? hidden : 0}
              zoomKey={zoomKey(index)}
              onOpen={openFromTile}
              className={tileSpan(index, tiles)}
            />
          ))}
        </div>
      )}

      <Lightbox
        images={images}
        index={openIndex}
        viewed={viewed}
        // Stays set through the close, so a zoomed image can fly back.
        zoomKey={zoom && viewed < tiles ? zoomKey(viewed) : null}
        onIndexChange={navigate}
        onCloseAutoFocus={restoreFocus}
      />
    </div>
  );
}

// The button doesn't clip: its inner clip box does the cropping and rounding,
// so the image can fly back out over the lightbox when it closes.
const tileButton =
  "group ring-border focus-visible:ring-ring relative block cursor-zoom-in rounded-lg ring-1 outline-none focus-visible:ring-2";
const tileImage =
  "transition-[transform,opacity] duration-300 group-hover:scale-[1.02] group-hover:opacity-90 group-active:scale-100";

/**
 * While a tile's image flies back from the lightbox, raise it above the
 * lightbox backdrop (z-50) so the zoom-out is visible, then drop it back.
 */
function useLiftWhileFlying() {
  const [flying, setFlying] = useState(false);
  return {
    zIndex: flying ? 60 : undefined,
    handlers: {
      onLayoutAnimationStart: () => setFlying(true),
      onLayoutAnimationComplete: () => setFlying(false),
    },
  };
}

function Tile({
  image,
  index,
  total,
  more,
  zoomKey,
  onOpen,
  className,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  more: number;
  zoomKey: string;
  onOpen: (index: number) => void;
  className?: string;
}) {
  const ids = zoomIds(zoomKey);
  const lift = useLiftWhileFlying();
  const ratio = image.width / image.height;
  // Cover the cell while keeping the image's shape: as wide as the cell, or
  // wider when the cell is relatively taller. Portrait screenshots sit at the
  // top, where their content starts; landscape images are centred. Positioned
  // with `left`, not a transform, because motion owns the transform.
  const width = `max(100cqw, calc(100cqh * ${ratio}))`;

  return (
    <button
      type="button"
      data-index={index}
      onClick={() => onOpen(index)}
      aria-label={
        more > 0
          ? `Open image ${index + 1} of ${total}: ${image.alt}, plus ${more} more`
          : `Open image ${index + 1} of ${total}: ${image.alt}`
      }
      className={cn(
        tileButton,
        "[container-type:size] min-h-0 min-w-0",
        className,
      )}
    >
      <motion.div
        layoutId={ids.clip}
        {...lift.handlers}
        transition={ZOOM}
        style={{ borderRadius: 8, zIndex: lift.zIndex }}
        className="absolute inset-0 [scrollbar-gutter:auto] overflow-hidden"
      >
        <motion.div
          layoutId={ids.img}
          transition={ZOOM}
          className="absolute top-0"
          style={{
            aspectRatio: `${image.width} / ${image.height}`,
            width,
            left: `calc(50cqw - ${width} / 2)`,
          }}
        >
          <Image
            src={image.src}
            fill
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            alt={image.alt}
            sizes={TILE_SIZES}
            draggable={false}
            className={tileImage}
          />
        </motion.div>
      </motion.div>
      {more > 0 && (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/55 text-lg font-medium text-white transition-colors group-hover:bg-black/45 sm:text-2xl"
        >
          +{more} more
        </span>
      )}
    </button>
  );
}

// A lone image is shown whole, at its own shape, capped at the grid's height.
function SingleImage({
  image,
  zoomKey,
  onOpen,
}: {
  image: GalleryImage;
  zoomKey: string;
  onOpen: () => void;
}) {
  const ids = zoomIds(zoomKey);
  const lift = useLiftWhileFlying();
  const ratio = image.width / image.height;

  return (
    <div className="[--cap:16rem] sm:[--cap:24rem]">
      <button
        type="button"
        data-index={0}
        onClick={onOpen}
        aria-label={`Open image: ${image.alt}`}
        className={tileButton}
        style={{
          aspectRatio: `${image.width} / ${image.height}`,
          width: `min(100%, calc(var(--cap) * ${ratio}))`,
        }}
      >
        <motion.div
          layoutId={ids.clip}
          {...lift.handlers}
          transition={ZOOM}
          style={{ borderRadius: 8, zIndex: lift.zIndex }}
          className="absolute inset-0 [scrollbar-gutter:auto] overflow-hidden"
        >
          <motion.div
            layoutId={ids.img}
            transition={ZOOM}
            className="absolute inset-0"
          >
            <Image
              src={image.src}
              fill
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              alt={image.alt}
              sizes={SINGLE_SIZES}
              draggable={false}
              className={tileImage}
            />
          </motion.div>
        </motion.div>
      </button>
    </div>
  );
}

/**
 * While the dialog closes, AnimatePresence keeps rendering the last frame of
 * the lightbox, so its props go stale. The slides read the live state from
 * here instead, which lets a zoomed image leave right away and fly back to
 * its tile rather than fade with the backdrop.
 */
const LiveState = createContext<{
  index: number | null;
  viewed: number;
  zoomKey: string | null;
}>({ index: null, viewed: 0, zoomKey: null });

function Lightbox({
  images,
  index,
  viewed,
  zoomKey,
  onIndexChange,
  onCloseAutoFocus,
}: {
  images: GalleryImage[];
  index: number | null;
  viewed: number;
  zoomKey: string | null;
  onIndexChange: (index: number | null) => void;
  onCloseAutoFocus: (event: Event) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState(0);

  const open = index !== null;
  const total = images.length;
  const hasMany = total > 1;
  const canPrev = open && index > 0;
  const canNext = open && index < total - 1;

  const go = (step: -1 | 1) => {
    if (index === null) return;
    const next = index + step;
    if (next < 0 || next >= total) return;
    setDirection(step);
    onIndexChange(next);
  };

  const close = () => onIndexChange(null);
  const current = open ? images[index] : null;
  const fade = { duration: 0.2 };

  return (
    <LiveState.Provider
      value={{ index, viewed, zoomKey: reduceMotion ? null : zoomKey }}
    >
      <Dialog.Root open={open} onOpenChange={(next) => !next && close()}>
        <AnimatePresence>
          {open && current && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                forceMount
                aria-describedby={undefined}
                onCloseAutoFocus={onCloseAutoFocus}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") go(-1);
                  if (event.key === "ArrowRight") go(1);
                }}
              >
                {/* Not animated itself: fading it would fade the zooming image */}
                <motion.div className="fixed inset-0 z-50 flex [scrollbar-gutter:auto] items-center justify-center overflow-hidden text-white outline-none">
                  <Dialog.Title className="sr-only">
                    {hasMany
                      ? `Image ${index + 1} of ${total}: ${current.alt}`
                      : current.alt}
                  </Dialog.Title>

                  <Slides
                    images={images}
                    direction={direction}
                    reduceMotion={!!reduceMotion}
                    draggable={hasMany}
                    onSwipe={go}
                    onClose={close}
                  />

                  {/* Preload the neighbours so the next swipe is instant */}
                  <div className="hidden" aria-hidden>
                    {[index - 1, index + 1]
                      .filter((i) => i >= 0 && i < total)
                      .map((i) => (
                        <Image
                          key={images[i].src}
                          src={images[i].src}
                          width={images[i].width}
                          height={images[i].height}
                          alt=""
                          sizes="100vw"
                          loading="eager"
                        />
                      ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                  >
                    {hasMany && (
                      <p className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm tabular-nums">
                        {index + 1} / {total}
                      </p>
                    )}

                    <Dialog.Close asChild>
                      <LightboxButton label="Close" className="top-3 right-3">
                        <X />
                      </LightboxButton>
                    </Dialog.Close>

                    {hasMany && (
                      <>
                        <LightboxButton
                          label="Previous image"
                          onClick={() => go(-1)}
                          disabled={!canPrev}
                          className="top-1/2 left-3 -translate-y-1/2"
                        >
                          <ChevronLeft />
                        </LightboxButton>
                        <LightboxButton
                          label="Next image"
                          onClick={() => go(1)}
                          disabled={!canNext}
                          className="top-1/2 right-3 -translate-y-1/2"
                        >
                          <ChevronRight />
                        </LightboxButton>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </LiveState.Provider>
  );
}

function Slides({
  images,
  direction,
  reduceMotion,
  draggable,
  onSwipe,
  onClose,
}: {
  images: GalleryImage[];
  direction: number;
  reduceMotion: boolean;
  draggable: boolean;
  onSwipe: (step: -1 | 1) => void;
  onClose: () => void;
}) {
  const { index, viewed, zoomKey } = useContext(LiveState);
  const dragged = useRef(false);

  const closing = index === null;
  // On close the slide is removed straight away: a zoomed one flies back into
  // its tile, any other one plays its exit (a fade).
  const image = closing ? null : images[viewed];

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) onSwipe(1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY)
      onSwipe(-1);
  };

  // Slides move sideways when navigating; on close they only fade.
  // "zoom": closing a zoomed slide, which must stay opaque while it flies
  // back (the shared layout hands it over to the tile).
  const custom: number | "zoom" = closing ? (zoomKey ? "zoom" : 0) : direction;
  const slide = {
    enter: (dir: number | "zoom") =>
      reduceMotion || dir === "zoom"
        ? { opacity: 0 }
        : { opacity: 0, x: dir * 80 },
    center: { opacity: 1, x: 0 },
    exit: (dir: number | "zoom") =>
      dir === "zoom"
        ? { opacity: 1, transition: { duration: ZOOM_DURATION } }
        : reduceMotion || dir === 0
          ? { opacity: 0 }
          : { opacity: 0, x: dir * -80 },
  };

  return (
    // `propagate` lets these slides run their exit when the whole dialog closes.
    <AnimatePresence initial={false} custom={custom} mode="popLayout" propagate>
      {image && (
        <motion.div
          key={image.src}
          custom={custom}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0.15 : 0.25, ease: "easeOut" }}
          drag={draggable ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={handleDragEnd}
          onClick={(event) => {
            if (dragged.current) {
              dragged.current = false;
              return;
            }
            // Clicking the empty area around the image closes.
            if (event.target === event.currentTarget) onClose();
          }}
          className="absolute inset-0 flex items-center justify-center px-4 py-16 sm:px-16"
        >
          <SlideImage
            image={image}
            previewSizes={images.length === 1 ? SINGLE_SIZES : TILE_SIZES}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * The zoom target in the lightbox. It reads the zoom state from context, not
 * props, because a slide that is leaving is a frozen copy: when you navigate
 * away from the zoomed image its layoutIds drop off here, so it slides out
 * like any other image instead of flying back to its tile.
 */
function SlideImage({
  image,
  previewSizes,
}: {
  image: GalleryImage;
  previewSizes: string;
}) {
  const { zoomKey } = useContext(LiveState);
  const ids = zoomKey ? zoomIds(zoomKey) : null;

  return (
    <motion.div
      // A new key when the zoom is handed off, so the layoutIds leave with
      // fresh elements rather than ones holding a stale shared-layout snapshot.
      // Motion 14 throws ("reading 'applyTransform'") on the stale case.
      key={ids ? "zoom" : "plain"}
      layoutId={ids?.clip}
      transition={ZOOM}
      className="relative [scrollbar-gutter:auto] overflow-hidden"
      style={{
        borderRadius: 6,
        aspectRatio: `${image.width} / ${image.height}`,
        // Fit inside the padded area at the image's own shape.
        width: `min(100%, calc((100dvh - 8rem) * ${image.width / image.height}))`,
      }}
    >
      <motion.div
        layoutId={ids?.img}
        transition={ZOOM}
        className="absolute inset-0"
      >
        {/* The grid's copy is already downloaded, so the zoom never shows a
            blank or blurred frame; the full-size image covers it once loaded. */}
        <Image
          src={image.src}
          fill
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          alt=""
          aria-hidden
          sizes={previewSizes}
          draggable={false}
          className="select-none"
        />
        <Image
          src={image.src}
          fill
          alt={image.alt}
          sizes="100vw"
          draggable={false}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
}

function LightboxButton({
  label,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "absolute flex size-10 items-center justify-center rounded-full bg-black/50 text-white transition-[opacity,background-color] outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white active:scale-95 disabled:pointer-events-none disabled:opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
