import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { retrieveArticleData } from "@/lib/articles";
import Link from "next/link";

import { formatDate } from "@/lib/utils";

const PER_PAGE = 10;

export default async function BlogPage() {
  const articles = await retrieveArticleData();

  const filteredArticles = articles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const categories = [
    "All",
    ...new Set(articles.map((article) => article.category)),
  ];

  return (
    <Page>
      <Page.Section>
        <Page.Heading>Blog</Page.Heading>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 text-sm">
            {categories.map((category) => (
              <Button
                key={category}
                variant="link"
                className="p-0 tracking-wider uppercase"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Summary */}
        <div className="max-w-4xl">
          {filteredArticles.map((article) => (
            <article className="mb-4 pb-4" key={article.id}>
              <div className="grid gap-6 md:grid-cols-[1fr_3fr] md:gap-12">
                <div className="mt-0.5 hidden space-y-1 md:block">
                  <div className="text-muted-foreground text-sm">
                    {article.category}
                  </div>
                  <div className="text-sm">{formatDate(article.createdAt)}</div>
                  <div className="text-muted-foreground text-sm">
                    {article.readTime}
                  </div>
                </div>
                <div>
                  <Link href="/blog/example">
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
