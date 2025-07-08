import { HomeLayout } from "@/components/home-layout";
import { MDXContent } from "@/components/mdx-content";
import { pages } from "@content";
import { notFound } from "next/navigation";

export default function Page() {
  const homepage = pages.find((page) => page.slug === "home");

  if (!homepage) {
    return notFound;
  }

  return (
    <HomeLayout>
      <MDXContent code={homepage.body} />
    </HomeLayout>
  );
}
