import { config } from "@/lib/config";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";
export const alt = "Open Graph Image for Devlog Article";

export default async function Image({
  params,
}: {
  params: { collection: string };
}) {
  const { collection } = params;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#17181C",
          color: "#DBDBDB",
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <div tw="flex flex-1 items-center justify-center relative ">
          <p tw="uppercase absolute top-16 right-16">{config.author}</p>
          <div tw="flex flex-col items-center justify-center ">
            <p tw="text-5xl">Devlog</p>
            <p tw="text-9xl capitalize">{collection}</p>
          </div>
        </div>
      </div>
    ),
  );
}
