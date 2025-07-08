import { Page } from "@/components/page";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { CategoryFilter } from "@/components/category-filter";
import { blogs } from "@content";

type Params = {
  searchParams?: Promise<{
    filter?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Blog",
};

// const articles = await getArticles();
const articles = blogs;
const categories = [
  "All",
  ...new Set(articles.map((article) => article.category)),
];

export default async function BlogPage(props: Params) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "All";

  const filteredArticles = articles
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .filter((article) => {
      return filter === "All" || article.category === filter;
    });

  return (
    <Page>
      <Page.Section>
        <Page.Heading>Blog</Page.Heading>

        {/* Categories */}
        <CategoryFilter categories={categories} />

        {/* Articles Summary */}
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
      </Page.Section>
    </Page>
  );
}
