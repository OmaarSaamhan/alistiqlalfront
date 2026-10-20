import sitePages from "../data/site-pages.json";
import newsArticles from "../data/news-articles.json";
import partners from "../data/partners.json";

const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap() {
  const staticPages = sitePages.map((page) => ({
    url: new URL(page.file === "index.html" ? "/" : `/${page.file}`, origin).toString(),
    changeFrequency: "monthly",
    priority: page.file === "index.html" ? 1 : 0.7,
  }));
  const detailPages = [newsArticles, partners].flatMap((records) =>
    Object.keys(records).flatMap((slug) => [
      { url: new URL(`/${slug}.html`, origin).toString(), changeFrequency: "yearly", priority: 0.5 },
      { url: new URL(`/${slug}-en.html`, origin).toString(), changeFrequency: "yearly", priority: 0.5 },
    ]),
  );
  return [...new Map([...staticPages, ...detailPages].map((page) => [page.url, page])).values()];
}
