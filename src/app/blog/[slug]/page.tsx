import { TableOfContents } from "@/components/table-of-contents";
import {
  getArticleBySlug,
  getArticles,
  retrieveArticleData,
} from "@/lib/articles";
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getContent(slug: string) {
  try {
    const { fileName } = await getArticleBySlug(slug);

    return lazy(() => import(`@/content/blog/${fileName}`));
  } catch (error) {
    console.error("Error loading content:", error);
    throw notFound();
  }
}

export async function generateStaticParams() {
  let paths: Array<{ slug: string }> = [];
  const files = (await getArticles()).map((article) => ({
    slug: article.slug,
  }));

  paths = paths.concat(files);

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const {
    href,
    summary: description,
    title,
    createdAt,
    tags,
  } = await getArticleBySlug(slug);

  return {
    title,
    description,
    keywords: tags,
    publisher: config.author,
    referrer: "origin-when-cross-origin",
    authors: [{ name: config.author, url: config.githubUrl }],
    openGraph: {
      title,
      description,
      publishedTime: new Date(createdAt).toISOString(),
      type: "article",
      url: config.baseUrl + href,
    },
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const { category, title, summary, createdAt, readTime } =
    await getArticleBySlug(slug);

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
          {category}
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

      <Suspense>
        <TableOfContents />
      </Suspense>
      <Suspense>
        <MdxContent />
      </Suspense>
    </>
  );
}
