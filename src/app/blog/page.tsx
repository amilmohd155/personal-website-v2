import { Page } from "@/components/page";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { CategoryFilter } from "@/components/category-filter";
import { ListSkeleton } from "@/components/skeletons";
import { blogs } from "@content";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog",
};

const articles = [...blogs].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
const categories = [
  "All",
  ...new Set(articles.map((article) => article.category)),
];

export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <Page>
      <Page.Section>
        <Page.Heading>Blog</Page.Heading>

        {/* searchParams is request data, so only this part streams in */}
        <Suspense fallback={<ListSkeleton />}>
          <FilteredBlog searchParams={searchParams} />
        </Suspense>
      </Page.Section>
    </Page>
  );
}

async function FilteredBlog({
  searchParams,
}: Pick<PageProps<"/blog">, "searchParams">) {
  const { filter } = await searchParams;

  return (
    <>
      {/* Categories */}
      <CategoryFilter categories={categories} />

      {/* Articles Summary */}
      <ArticleList
        filter={(Array.isArray(filter) ? filter[0] : filter) ?? "All"}
      />
    </>
  );
}

async function ArticleList({ filter }: { filter: string }) {
  "use cache";
  cacheLife("max");

  const filteredArticles = articles.filter((article) => {
    return filter === "All" || article.category === filter;
  });

  return (
    <div className="max-w-4xl">
      {filteredArticles.map((article) => (
        <article className="mb-4 pb-4" key={article.slug}>
          <div className="grid gap-6 md:grid-cols-[1fr_3fr] md:gap-12">
            <div className="mt-0.5 hidden space-y-1 md:block">
              <div className="text-muted-foreground text-sm">
                {article.category}
              </div>
              <div className="text-sm">{formatDate(article.date)}</div>
              <div className="text-muted-foreground text-sm">
                {article.readTime}
              </div>
            </div>
            <div>
              <Link href={article.permalink}>
                <h2 className="hover:text-muted-foreground mb-3 text-xl transition-colors">
                  {article.title}
                </h2>
              </Link>
              <p className="text-muted-foreground mb-4 text-sm">
                {article.summary}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
