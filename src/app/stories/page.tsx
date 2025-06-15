import { Page } from "@/components/page";
import { getFilteredSortedArticles } from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Short Stories",
};

export default async function ShortsPage() {
  const stories = await getFilteredSortedArticles("All", "stories");

  return (
    <Page>
      <Page.Section>
        <Page.Heading>Short Stories</Page.Heading>

        {/* Articles Summary */}
        <div className="max-w-4xl">
          {stories.map((story) => (
            <article className="mb-4 pb-4" key={story.id}>
              <div className="grid gap-6 md:grid-cols-[1fr_3fr] md:gap-12">
                <div className="mt-0.5 hidden space-y-1 md:block">
                  <div className="text-muted-foreground text-sm">
                    {story.category}
                  </div>
                  <div className="text-sm">{formatDate(story.date)}</div>
                  <div className="text-muted-foreground text-sm">
                    {story.readTime}
                  </div>
                </div>
                <div>
                  <Link href={story.href}>
                    <h2 className="hover:text-muted-foreground mb-3 text-xl transition-colors">
                      {story.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {story.summary}
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
