import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { blogs } from "@content";
import { MDXContent } from "@/components/mdx-content";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getBlogBySlug(slug: string) {
  try {
    const article = blogs.find((article) => article.slug === slug);

    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    return article;
  } catch (error) {
    console.error("Error loading content:", error);
    throw notFound();
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const { title, summary, category, date, readTime, body, toc } =
    await getBlogBySlug(slug);

  const renderLoader = () => <div className="loader" />;

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
            datePublished: date,
            dateModified: date,
            url: `${config.baseUrl}/blog/${slug}`,
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
          <h6>{formatDate(date)}</h6>

          <h6 className="list-item list-inside list-disc">{`${readTime} read`}</h6>
        </div>
      </section>
      {/* <Suspense fallback={renderLoader()}>
        <TableOfContents />
      </Suspense> */}
      <Suspense fallback={renderLoader()}>
        <MDXContent code={body} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  return blogs.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const {
    summary: description,
    title,
    date: createdAt,
    tags,
  } = await getBlogBySlug(slug);

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
      url: config.baseUrl + "/blog/" + slug,
    },
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}
