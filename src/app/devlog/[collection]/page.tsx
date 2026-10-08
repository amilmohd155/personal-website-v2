import { CategoryFilter } from "@/components/category-filter";
import { ListSkeleton } from "@/components/skeletons";
import { Page } from "@/components/page";
import { formatDate } from "@/lib/utils";
import { devlog, devlogCollections } from "@content";
import { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

function getArticles(collection: string) {
  return devlog
    .filter((article) => article.collection === collection && article.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function CollectionPage({
  params,
  searchParams,
}: PageProps<"/devlog/[collection]">) {
  return (
    <Page>
      <Page.Section>
        {/* params and searchParams are URL data, so only this part streams in */}
        <Suspense fallback={<ListSkeleton />}>
          <FilteredArticles params={params} searchParams={searchParams} />
        </Suspense>
      </Page.Section>
    </Page>
  );
}

async function FilteredArticles({
  params,
  searchParams,
}: PageProps<"/devlog/[collection]">) {
  const { collection } = await params;
  const { filter = "All" } = await searchParams;

  return (
    <>
      <Page.Heading className="uppercase">{collection}</Page.Heading>
      <ArticleList
        collection={collection}
        filter={Array.isArray(filter) ? filter[0] : filter}
      />
    </>
  );
}

async function ArticleList({
  collection,
  filter,
}: {
  collection: string;
  filter: string;
}) {
  "use cache";
  cacheLife("max");

  const articles = getArticles(collection);
  const filteredArticles = articles.filter((article) => {
    if (filter === "All") return true;
    return article.category === filter;
  });

  const categories = [
    "All",
    ...new Set(articles.map((article) => article.category)),
  ];

  return (
    <>
      {/* Categories */}
      <CategoryFilter categories={categories} />

      {/* Articles Summary */}
      <div className="max-w-4xl">
        {filteredArticles.map((article) => (
          <article className="mb-4 pb-4" key={article.slug}>
            <div className="grid gap-6 md:grid-cols-[1fr_3fr] md:gap-12">
              <div className="text-muted-foreground mt-0.5 hidden space-y-1 text-sm md:block">
                <p>{article.category}</p>
                <p>{formatDate(article.date)}</p>
                <p>{article.readTime}</p>
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
    </>
  );
}

export async function generateStaticParams() {
  const collections = devlogCollections.collections;
  return collections.map((collection) => ({
    collection: collection.name.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/devlog/[collection]">): Promise<Metadata> {
  const { collection } = await params;

  return {
    title: `Devlog - ${collection.charAt(0).toUpperCase() + collection.slice(1)}`,
    description: `Devlog for ${collection}`,
    openGraph: {},
    twitter: {
      card: "summary_large_image",
    },
  };
}
