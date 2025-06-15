import type { MetadataRoute } from "next";

import { config } from "@/lib/config";
import { getArticles } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleList = await getArticles();

  const devlogs = config.collections.map((collection) => ({
    url: `${config.baseUrl}/devlog/${collection}`,
    lastModified: new Date().toISOString(),
  }));

  const devlogList = await getArticles("devlog", "quizcript");

  const devlogArticles = devlogList.map((metadata) => ({
    url: config.baseUrl + metadata.href,
    lastModified: metadata.updatedAt,
  }));

  const articles = articleList.map((metadata) => ({
    url: config.baseUrl + metadata.href,
    lastModified: metadata.updatedAt,
  }));

  const staticPages = ["", "blog", "devlog", "projects", "story", "skills"].map(
    (page) => ({
      url: `${config.baseUrl}/${page}`,
      lastModified: new Date().toISOString(),
    }),
  );

  return [...staticPages, ...devlogs, ...articles, ...devlogArticles];
}
