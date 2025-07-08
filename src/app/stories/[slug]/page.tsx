import { MDXContent } from "@/components/mdx-content";
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { stories } from "@content";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function getStoryBySlug(slug: string) {
  try {
    const story = stories.find((article) => article.slug === slug);
    if (!story) {
      throw new Error(`Story with slug "${slug}" not found`);
    }
    return story;
  } catch (error) {
    console.error("Error loading content:", error);
    throw notFound();
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const {
    title,
    summary,
    date: createdAt,
    readTime,
    body,
  } = getStoryBySlug(slug);

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
            url: `${config.baseUrl}/story/${slug}`,
            author: {
              "@type": "Person",
              name: config.author,
            },
          }),
        }}
      />
      <section className="space-y-6 border-b pb-6">
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
        <MDXContent code={body} />
      </Suspense>
      <p>The End</p>
    </>
  );
}

export async function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { summary: description, title, date: createdAt } = getStoryBySlug(slug);

  return {
    title,
    description,
    publisher: config.author,
    referrer: "origin-when-cross-origin",
    authors: [{ name: config.author, url: config.githubUrl }],
    openGraph: {
      title,
      description,
      publishedTime: new Date(createdAt).toISOString(),
      type: "article",
      url: new URL(`/stories/${slug}`, config.baseUrl),
    },
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}
