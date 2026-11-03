import { LinkHandler } from "@/components/link-handler";
import { MDXContent } from "@/components/mdx-content";
import { ArticleSkeleton } from "@/components/skeletons";
import { AppStoreIcon, GooglePlayIcon } from "@/components/store-icons";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { apps } from "@content";
import { Globe } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

function getContent(slug: string) {
  const app = apps.find((app) => app.slug === slug);
  if (!app) notFound();
  return app;
}

export default function AppPage({ params }: PageProps<"/apps/[slug]">) {
  // Await params inside Suspense so unlisted slugs get an instant shell.
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <AppDetails params={params} />
    </Suspense>
  );
}

async function AppDetails({
  params,
}: Pick<PageProps<"/apps/[slug]">, "params">) {
  const { slug } = await params;
  const {
    title,
    summary,
    stage,
    platforms,
    icon,
    website,
    appStore,
    playStore,
    body,
    permalink,
  } = getContent(slug);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: title,
            description: summary,
            url: `${config.baseUrl}${permalink}`,
            author: {
              "@type": "Person",
              name: config.author,
            },
          }),
        }}
      />
      <section className="space-y-6 border-b pb-4">
        <div className="not-prose flex items-center gap-5">
          {icon && (
            <Image
              src={icon.src}
              width={96}
              height={96}
              placeholder="blur"
              blurDataURL={icon.blurDataURL}
              alt=""
              className="ring-border size-24 shrink-0 rounded-[1.375rem] ring-1"
            />
          )}
          <div className="min-w-0 space-y-2">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              {stage === "live" ? "Live" : "Under development"}
            </p>
            <h1 className="text-3xl leading-tight font-bold tracking-tight text-[var(--tw-prose-headings)] md:text-4xl">
              {title}
            </h1>
          </div>
        </div>
        <p className="text-muted">{summary}</p>

        {platforms.length > 0 && (
          <div className="not-prose flex flex-wrap items-center gap-2">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs"
              >
                {platform}
              </span>
            ))}
          </div>
        )}

        {(appStore || playStore || website) && (
          <div className="flex flex-wrap gap-2">
            {appStore && (
              <Button asChild variant="outline">
                <LinkHandler href={appStore} className="not-prose">
                  <AppStoreIcon />
                  App Store
                </LinkHandler>
              </Button>
            )}
            {playStore && (
              <Button asChild variant="outline">
                <LinkHandler href={playStore} className="not-prose">
                  <GooglePlayIcon />
                  Google Play
                </LinkHandler>
              </Button>
            )}
            {website && (
              <Button asChild variant="outline">
                <LinkHandler href={website} className="not-prose">
                  <Globe />
                  Website
                </LinkHandler>
              </Button>
            )}
          </div>
        )}
      </section>

      <Suspense fallback={<div>Loading Content...</div>}>
        <MDXContent code={body} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  const { title, summary } = getContent(slug);

  return {
    title: `App | ${title}`,
    description: summary,
  };
}
