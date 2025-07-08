import { Page } from "@/components/page";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { devlogCollections } from "@content";

function getCollection() {
  return devlogCollections.collections;
}

export const metadata: Metadata = {
  title: "Devlog",
};

export default async function DevlogPage() {
  const collections = getCollection();

  if (collections.length === 1) {
    redirect(`/devlog/${collections[0].name}`);
  }
  return (
    <Page>
      <Page.Section>
        <Page.Heading>Devlog</Page.Heading>

        {/* Collections */}
        <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={`/devlog/${collection.name.toLowerCase()}`}
              className="hover:bg-muted-foreground/10 rounded-xl border px-4 py-6 text-center"
            >
              {collection.name}
            </Link>
          ))}
        </div>
      </Page.Section>
    </Page>
  );
}
