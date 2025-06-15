import TableOfContents from "@/components/table-of-contents";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";

type Props = {
  params: Promise<{
    collection: string;
    slug: string;
  }>;
};

async function getContent(slug: string, collection: string) {
  try {
    const { fileName } = await getArticleBySlug(slug, "devlog", collection);

    return lazy(() => import(`@/content/devlog/${collection}/${fileName}`));
  } catch (error) {
    console.error("Error loading content:", error);
    throw notFound();
  }
}

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const { collection, slug } = await params;

  const article = await getArticleBySlug(slug, "devlog", collection);

  return {
    title: {
      absolute: article.title,
    },
    keywords: article.tags,
    description: article.summary,
  };
}

export async function generateStaticParams() {
  const collections = config.collections;

  const params: { collection: string; slug: string }[] = [];

  collections.forEach(async (collection) => {
    const articles = await getArticles("devlog", collection);
    articles.forEach((article) => {
      params.push({
        collection: collection.toLowerCase(),
        slug: article.slug,
      });
    });
  });

  return params;
}

export default async function DevlogPage({ params }: Props) {
  const { collection, slug } = await params;

  const { category, title, summary, createdAt, readTime } =
    await getArticleBySlug(slug, "devlog", collection);

  const MdxContent = await getContent(slug, collection);

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
            url: `${config.baseUrl}${slug}`,
            author: {
              "@type": "Person",
              name: config.author,
            },
          }),
        }}
      />
      <section className="mb-6 space-y-6">
        <p className="text-muted-foreground text-xs tracking-widest uppercase">
          {collection} | {category}
        </p>
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-[var(--tw-prose-headings)] md:text-4xl">
          {title}
        </h1>
        <p className="text-muted flex justify-between">{summary}</p>
        <div className="text-muted-foreground flex flex-row gap-x-4 text-sm">
          <h6>{formatDate(createdAt)}</h6>

          <h6 className="list-item list-inside list-disc">{`${readTime} read`}</h6>
        </div>
      </section>

      <Suspense fallback={<div>Loading Table of Contents...</div>}>
        <TableOfContents />
      </Suspense>
      <Suspense fallback={<div>Loading Content...</div>}>
        <MdxContent />
      </Suspense>
    </>
  );
}
