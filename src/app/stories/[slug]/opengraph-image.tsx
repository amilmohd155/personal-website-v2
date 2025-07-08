import { config } from "@/lib/config";
import { stories } from "@content";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";
export const alt = "Open Graph Image for Stories";

type Props = {
  params: { slug: string };
};

export default async function Image({ params: { slug } }: Props) {
  const bgData = await readFile(join(process.cwd(), "public", "blurry.jpg"));
  const bgBase64 = Buffer.from(bgData).toString("base64");
  const bgImageSrc = `data:image/jpeg;base64,${bgBase64}`;

  const article = stories.find((story) => story.slug === slug);

  if (!article) return null;

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
        <img
          src={bgImageSrc}
          alt="Background"
          tw="absolute inset-0 object-cover"
        />
        <div tw="absolute inset-0 bg-black opacity-50" />
        <div tw="flex flex-1 flex-col items-start justify-end relative px-16 py-12">
          <p tw="text-8xl italic font-bold">{article.title}</p>
          <p tw="uppercase text-2xl">
            <span>Stories by</span> &nbsp;{config.author.split(" ")[0]}
          </p>
        </div>
      </div>
    ),
  );
}
