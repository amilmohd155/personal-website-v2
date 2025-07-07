import { CategoryFilter } from "@/components/category-filter";
import { Page } from "@/components/page";
import { getFilteredSortedArticles } from "@/lib/articles";
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{
    collection: string;
  }>;
  searchParams?: Promise<{
    filter?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export async function generateStaticParams() {
  return config.collections.map((collection) => ({
    collection: collection.toLowerCase(),
  }));
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { collection } = await params;
  const _searchParams = await searchParams;
  const filter = _searchParams?.filter || "All";

  const filteredArticles = await getFilteredSortedArticles(
    filter,
    "devlog",
    collection,
  );

  const publishedArticles = filteredArticles.filter(
    (article) => article.published,
  );

  const categories = [
    "All",
    ...new Set(publishedArticles.map((article) => article.category)),
  ];

  return (
    <Page>
      <Page.Section>
        <Page.Heading className="uppercase">{collection}</Page.Heading>
        {/* Categories */}
        <CategoryFilter categories={categories} />

        {/* Articles Summary */}
        <div className="max-w-4xl">
          {publishedArticles.map((article) => (
            <article className="mb-4 pb-4" key={article.id}>
              <div className="grid gap-6 md:grid-cols-[1fr_3fr] md:gap-12">
                <div className="text-muted-foreground mt-0.5 hidden space-y-1 text-sm md:block">
                  <p>{article.category}</p>
                  <p>{formatDate(article.date)}</p>
                  <p>{article.readTime}</p>
                </div>
                <div>
                  <Link href={`/devlog/${collection}/${article.slug}`}>
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
