import type { MetadataRoute } from "next";

import { config } from "@/lib/config";
import { blogs, devlog, devlogCollections, stories } from "@content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const devlogs = devlogCollections.collections.map((collection) => ({
    url: config.baseUrl + "/devlog/" + collection.name,
    lastModified: new Date().toISOString(),
  }));

  const devlogArticles = devlog.map((metadata) => ({
    url: config.baseUrl + metadata.permalink,
    lastModified: metadata.date,
  }));

  const articles = blogs.map((metadata) => ({
    url: config.baseUrl + metadata.permalink,
    lastModified: metadata.date,
  }));

  const storyMap = stories.map((metadata) => ({
    url: config.baseUrl + metadata.permalink,
    lastModified: metadata.date,
  }));

  const staticPages = ["", "blog", "devlog", "projects", "story", "skills"].map(
    (page) => ({
      url: config.baseUrl + "/" + page,
      lastModified: new Date().toISOString(),
    }),
  );

  return [
    ...staticPages,
    ...devlogs,
    ...articles,
    ...devlogArticles,
    ...storyMap,
  ];
}
