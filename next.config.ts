import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import highlight from "remark-sugar-high";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import bundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  // webpack: (config, { dev }) => {
  //   if (config.cache && !dev) {
  //     config.cache = Object.freeze({
  //       type: "memory",
  //     });
  //   }
  //   // Important: return the modified config
  //   return config;
  // },
  // webpack: (config, { dev }) => {
  //   // minify class names (does not apply to tailwindcss) (e.g. .my-class--active -> .xSrdL)
  //   config.module.rules.forEach((rule: any) => {
  //     if (!rule.oneOf) return;
  //     rule.oneOf.forEach((oneOf: any) => {
  //       if (
  //         oneOf.test &&
  //         oneOf.test.toString().includes("\\.module\\.(css|scss|sass)$") &&
  //         oneOf.use
  //       ) {
  //         oneOf.use.forEach((loader: any) => {
  //           if (
  //             loader.loader &&
  //             loader.loader.includes("css-loader") &&
  //             !loader.loader.includes("postcss-loader")
  //           ) {
  //             loader.options = {
  //               ...loader.options,
  //               modules: {
  //                 ...loader.options.modules,
  //                 localIdentName: dev
  //                   ? "[name]__[local]__[hash:base64:5]"
  //                   : "[hash:base64:8]",
  //               },
  //             };
  //           }
  //         });
  //       }
  //     });
  //   });
  //   return config;
  // },
};

const withMdx = createMDX({
  extension: /\.(md|mdx)?$/,
  options: {
    remarkPlugins: [remarkGfm, highlight],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["decoration-[none]"],
          },
        },
      ],
    ],
  },
});

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withMdx(nextConfig));
