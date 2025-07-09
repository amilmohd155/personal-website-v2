import { MDXContent } from "@/components/mdx-content";
import TableOfContents from "@/components/table-of-contents";
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { devlog, devlogCollections } from "@content";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    collection: string;
    slug: string;
  }>;
};

function getArticleBySlug(slug: string, collection: string) {
  try {
    const article = devlog.find(
      (article) =>
        article.slug === slug &&
        article.collection === collection &&
        article.published,
    );

    if (!article) {
      throw new Error("Article not found");
    }
    return article;
  } catch (error) {
    console.error("Error loading content:", error);
    throw notFound();
  }
}

export default async function DevlogPage({ params }: Props) {
  const { collection, slug } = await params;

  const {
    category,
    title,
    summary,
    date: createdAt,
    readTime,
    toc,
    body,
  } = getArticleBySlug(slug, collection);

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
            url: `${config.baseUrl}/${slug}`,
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

          <h6 className="list-item list-inside list-disc">{readTime}</h6>
        </div>
      </section>

      <Suspense fallback={<div>Loading Table of Contents...</div>}>
        <TableOfContents toc={toc} />
      </Suspense>
      <Suspense fallback={<div>Loading Content...</div>}>
        <MDXContent code={body} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  const params = devlogCollections.collections.flatMap((c) => {
    const collection = c.name.toLowerCase();

    return devlog
      .filter((article) => article.collection === c.name && article.published)
      .map((article) => ({
        collection,
        slug: article.slug,
      }));
  });

  return params;
}

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const { collection, slug } = await params;

  const article = getArticleBySlug(slug, collection);

  return {
    title: {
      absolute: article.title,
    },
    keywords: article.tags,
    description: article.summary,
  };
}
