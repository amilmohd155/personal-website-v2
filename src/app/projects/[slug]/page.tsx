import { LinkHandler } from "@/components/link-handler";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { Github, Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

async function getContent(slug: string) {
  try {
    const { fileName } = await getArticleBySlug(slug, "project");

    return lazy(() => import(`@/content/projects/${fileName}`));
  } catch (error) {
    console.error("Error loading content:", error);
    throw notFound();
  }
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;

  const { title, summary } = await getArticleBySlug(slug, "project");

  return {
    title: `Project | ${title}`,
    description: summary,
  };
}

export async function generateStaticParams() {
  const articles = await getArticles("project");

  const params: { slug: string }[] = [];

  articles.map((article) =>
    params.push({
      slug: article.slug,
    }),
  );

  return params;
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;

  const { category, title, summary, createdAt, demo, repository } =
    await getArticleBySlug(slug, "project");

  const MdxContent = await getContent(slug);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description: summary,
            datePublished: createdAt,
            dateModified: createdAt,
            url: `${config.baseUrl}/projects/${slug}`,
            author: {
              "@type": "Person",
              name: config.author,
            },
          }),
        }}
      />
      <section className="space-y-6 border-b pb-4">
        <div className="text-muted-foreground flex flex-row items-center justify-between text-xs">
          <p className="tracking-widest uppercase">{category}</p>
          <h6>{formatDate(createdAt)}</h6>
        </div>
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-[var(--tw-prose-headings)] md:text-4xl">
          {title}
        </h1>
        <p className="text-muted">{summary}</p>

        <div className="space-x-2">
          {repository && (
            <Button asChild variant="outline">
              <LinkHandler href={repository} className="not-prose">
                <Github />
                Github
              </LinkHandler>
            </Button>
          )}
          {demo && (
            <Button asChild variant="outline">
              <LinkHandler href={demo} className="not-prose">
                <Globe />
                Demo
              </LinkHandler>
            </Button>
          )}
        </div>
      </section>

      <Suspense fallback={<div>Loading Content...</div>}>
        <MdxContent />
      </Suspense>
    </>
  );
}
