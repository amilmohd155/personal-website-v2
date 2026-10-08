import { CategoryFilter } from "@/components/category-filter";
import { ListSkeleton } from "@/components/skeletons";
import { Page } from "@/components/page";
import { projects } from "@content";
import { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Projects",
};

const sortedProjects = [...projects].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
const categories = [
  "All",
  ...new Set(sortedProjects.map((project) => project.category)),
];

export default function ProjectPage({ searchParams }: PageProps<"/projects">) {
  return (
    <Page>
      <Page.Section>
        <Page.Heading>Projects</Page.Heading>

        {/* searchParams is request data, so only this part streams in */}
        <Suspense fallback={<ListSkeleton />}>
          <FilteredProjects searchParams={searchParams} />
        </Suspense>
      </Page.Section>
    </Page>
  );
}

async function FilteredProjects({
  searchParams,
}: Pick<PageProps<"/projects">, "searchParams">) {
  const { filter = "All" } = await searchParams;

  return (
    <>
      {/* Categories */}
      <CategoryFilter categories={categories} />

      {/* Filtered Projects */}
      <ProjectListings filter={Array.isArray(filter) ? filter[0] : filter} />
    </>
  );
}

async function ProjectListings({ filter }: { filter: string }) {
  "use cache";
  cacheLife("max");

  const filteredProjects = sortedProjects.filter((project) => {
    if (filter === "All") return true;
    return project.category === filter;
  });

  return (
    <div className="max-w-4xl">
      {filteredProjects.map((article) => (
        <Link href={article.permalink} key={article.slug} className="group">
          <article className="group-hover:bg-muted/30 -mx-4 mb-4 space-y-3 overflow-hidden rounded-lg px-4 py-2 transition-colors">
            <div className="space-y-2">
              <h2 className="text-xl transition-colors">{article.title}</h2>
              <p className="text-muted-foreground text-sm">{article.summary}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
