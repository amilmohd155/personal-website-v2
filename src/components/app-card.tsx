import { apps } from "@content";
import Image from "next/image";
import Link from "next/link";

export type App = (typeof apps)[number];

const sortedApps = [...apps].sort(
  (a, b) => a.order - b.order || a.title.localeCompare(b.title),
);

export const liveApps = sortedApps.filter((app) => app.stage === "live");
export const developmentApps = sortedApps.filter(
  (app) => app.stage === "development",
);

export function AppCard({ app }: { app: App }) {
  return (
    <Link href={app.permalink} className="group block">
      <article className="group-hover:bg-muted/30 -mx-4 flex items-center gap-5 rounded-lg px-4 py-4 transition-colors">
        {app.icon ? (
          <Image
            src={app.icon.src}
            width={96}
            height={96}
            placeholder="blur"
            blurDataURL={app.icon.blurDataURL}
            alt=""
            className="ring-border size-24 shrink-0 rounded-[1.375rem] ring-1"
          />
        ) : (
          <div
            aria-hidden
            className="bg-muted text-muted-foreground flex size-24 shrink-0 items-center justify-center rounded-[1.375rem] text-3xl font-medium"
          >
            {app.title.charAt(0)}
          </div>
        )}
        <div className="min-w-0 space-y-1">
          <h3 className="text-lg leading-snug">{app.title}</h3>
          <p className="text-muted-foreground text-sm">{app.summary}</p>
          {app.platforms.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {app.platforms.map((platform) => (
                <span
                  key={platform}
                  className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs"
                >
                  {platform}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function AppList({ items }: { items: App[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">Nothing here yet.</p>;
  }
  return (
    <div>
      {items.map((app) => (
        <AppCard key={app.slug} app={app} />
      ))}
    </div>
  );
}

export function SectionHeading({
  children,
  count,
}: {
  children: React.ReactNode;
  count: number;
}) {
  return (
    <h2 className="text-muted-foreground mb-2 text-sm tracking-wider uppercase">
      {children} <span className="opacity-60">({count})</span>
    </h2>
  );
}
