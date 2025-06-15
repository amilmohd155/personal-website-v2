import { Page } from "@/components/page";
import { config } from "@/lib/config";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

const collectionsMap = config.collections;

export const metadata: Metadata = {
  title: "Devlog",
};

export default async function DevlogPage() {
  if (collectionsMap.length === 1) {
    redirect(`/devlog/${collectionsMap[0]}`);
  }

  return (
    <Page>
      <Page.Section>
        <Page.Heading>Devlog</Page.Heading>

        {/* Collections */}
        <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
          {collectionsMap.map((collection) => (
            <Link
              key={collection}
              href={`/devlog/${collection.toLowerCase()}`}
              className="hover:bg-muted-foreground/10 rounded-xl border px-4 py-6 text-center"
            >
              {collection}
            </Link>
          ))}
        </div>
      </Page.Section>
    </Page>
  );
}
