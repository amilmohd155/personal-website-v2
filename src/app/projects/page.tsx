import { CategoryFilter } from "@/components/category-filter";
import { Page } from "@/components/page";
import { projects } from "@content";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

type Params = {
  searchParams?: Promise<{
    filter?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Projects",
};

const categories = [
  "All",
  ...new Set(projects.map((project) => project.category)),
];

export default async function ProjectPage(props: Params) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "All";

  return (
    <Page>
      <Page.Section>
        <Page.Heading>Projects</Page.Heading>

        {/* Categories */}
        <CategoryFilter categories={categories} />

        {/* Filtered Articles */}
        {/* // Todo Loading Skeleton */}
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectListings filter={filter} />
        </Suspense>
      </Page.Section>
    </Page>
  );
}

const ProjectListings = async ({ filter }: { filter: string }) => {
  const filteredProjects = projects
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .filter((project) => {
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
};
