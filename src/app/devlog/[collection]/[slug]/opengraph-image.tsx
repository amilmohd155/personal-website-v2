import { getArticleBySlug } from "@/lib/articles";
import { config } from "@/lib/config";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";
export const alt = "Open Graph Image for Devlog Article";

export default async function Image({
  params,
}: {
  params: { collection: string; slug: string };
}) {
  const { collection, slug } = params;

  const article = await getArticleBySlug(slug, "devlog", collection);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: "#17181C",
          color: "#DBDBDB",
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <div tw="flex flex-1 items-center justify-center relative px-16">
          <p tw="uppercase absolute top-8 right-16">{config.author}</p>
          <div tw="flex flex-col items-center justify-center ">
            <p tw="text-5xl w-full text-start">{article.title}</p>
            <p tw="text-4xl text-[#A1A1A1]">{article.summary}</p>
          </div>
          <p tw="uppercase absolute bottom-8 left-16">{`devlog / ${collection} - #${article.index}`}</p>
        </div>
      </div>
    ),
  );
}
