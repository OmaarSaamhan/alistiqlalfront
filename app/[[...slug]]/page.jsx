import AboutEnPage from "../site-pages/about-en";
import AboutPage from "../site-pages/about";
import ActivitiesEnPage from "../site-pages/activities-en";
import ActivitiesPage from "../site-pages/activities";
import ContactEnPage from "../site-pages/contact-en";
import ContactPage from "../site-pages/contact";
import IndexEnPage from "../site-pages/index-en";
import IndexPage from "../site-pages/index";
import NewsEnPage from "../site-pages/news-en";
import NewsPage from "../site-pages/news";
import PartnershipsEnPage from "../site-pages/partnerships-en";
import PartnershipsPage from "../site-pages/partnerships";
import ProgramsEnPage from "../site-pages/programs-en";
import ProgramsPage from "../site-pages/programs";
import ProjectsEnPage from "../site-pages/projects-en";
import ProjectsPage from "../site-pages/projects";
import ServicesEnPage from "../site-pages/services-en";
import ServicesPage from "../site-pages/services";
import TeamEnPage from "../site-pages/team-en";
import TeamPage from "../site-pages/team";
import sitePages from "../../data/site-pages.json";
import newsArticles from "../../data/news-articles.json";
import partnerPages from "../../data/partners.json";
import NewsArticle from "../components/content/NewsArticle";
import PartnerDetail from "../components/content/PartnerDetail";
import { notFound } from "next/navigation";

const pageComponents = {
  "about-en.html": AboutEnPage,
  "about.html": AboutPage,
  "activities-en.html": ActivitiesEnPage,
  "activities.html": ActivitiesPage,
  "contact-en.html": ContactEnPage,
  "contact.html": ContactPage,
  "index-en.html": IndexEnPage,
  "index.html": IndexPage,
  "news-en.html": NewsEnPage,
  "news.html": NewsPage,
  "partnerships-en.html": PartnershipsEnPage,
  "partnerships.html": PartnershipsPage,
  "programs-en.html": ProgramsEnPage,
  "programs.html": ProgramsPage,
  "projects-en.html": ProjectsEnPage,
  "projects.html": ProjectsPage,
  "services-en.html": ServicesEnPage,
  "services.html": ServicesPage,
  "team-en.html": TeamEnPage,
  "team.html": TeamPage
};
const pageByPath = new Map(sitePages.map((page) => [page.file, page]));

const descriptions = {
  "about.html": "تعرف على قصة أكاديمية الاستقلال الرياضية ورؤيتها ورسالتها في اكتشاف مواهب الأطفال ورعايتها وتنمية قدراتهم في غزة.",
  "about-en.html": "Learn about Al-Istiqlal Sports Academy’s story, mission and work to discover children’s talents and support their development in Gaza.",
  "activities.html": "اكتشف الأنشطة والفعاليات الرياضية والمجتمعية التي تنفذها أكاديمية الاستقلال الرياضية للأطفال في غزة.",
  "activities-en.html": "Explore sports and community activities and events for children at Al-Istiqlal Sports Academy in Gaza.",
  "contact.html": "تواصل مع أكاديمية الاستقلال الرياضية للاستفسارات أو التعاون والشراكات التي تخدم الأطفال والمجتمع.",
  "contact-en.html": "Contact Al-Istiqlal Sports Academy about inquiries, collaboration and partnerships that support children and the community.",
  "services.html": "تعرف على الأندية الرياضية والثقافية والاجتماعية والإعلامية وبرامج رعاية المواهب والدعم النفسي والاجتماعي للأطفال.",
  "services-en.html": "Explore the Academy’s sports, cultural, social and media clubs, talent development and psychosocial support programs for children.",
  "partnerships.html": "تعرف على فرص الشراكة والتعاون مع أكاديمية الاستقلال الرياضية في البرامج الرياضية والمجتمعية للأطفال.",
  "partnerships-en.html": "Learn about partnership and collaboration opportunities with Al-Istiqlal Sports Academy in sports and community programs for children.",
};

export const dynamicParams = false;

const detailDatasets = [
  ["news", newsArticles],
  ["partner", partnerPages],
];

function detailPaths() {
  return detailDatasets.flatMap(([kind, records]) =>
    Object.keys(records).flatMap((name) => [
      { slug: [`${name}.html`] },
      { slug: [`${name}-en.html`] },
    ]),
  );
}

export function generateStaticParams() {
  return [...sitePages.map((page) => ({ slug: [page.file] })), ...detailPaths(), { slug: [] }];
}

export async function generateMetadata({ params }) {
  const { slug = [] } = await params;
  const key = slug.join("/") || "index.html";
  const articleMatch = key.match(/^(news-[1-4])(-en)?\.html$/);
  if (articleMatch) {
    const [, articleSlug, englishSuffix] = articleMatch;
    const locale = englishSuffix ? "en" : "ar";
    const article = newsArticles[articleSlug]?.[locale];
    if (!article) notFound();
    return detailMetadata(articleSlug, locale, article);
  }
  const partnerMatch = key.match(/^(partner-(?:impact|islamic-bank|jawwal|khotwa|ruwwad))(-en)?\.html$/);
  if (partnerMatch) {
    const [, partnerSlug, englishSuffix] = partnerMatch;
    const locale = englishSuffix ? "en" : "ar";
    const partner = partnerPages[partnerSlug]?.[locale];
    if (!partner) notFound();
    return detailMetadata(partnerSlug, locale, partner);
  }
  const page = pageByPath.get(key);
  if (!page) return {};
  const arFile = `${page.page.replace(/-en$/, "")}.html`;
  const enFile = `${page.page.replace(/-en$/, "")}-en.html`;
  const languages = {};
  if (pageByPath.has(arFile)) languages.ar = arFile === "index.html" ? "/" : `/${arFile}`;
  if (pageByPath.has(enFile)) languages.en = `/${enFile}`;
  return {
    title: page.title,
    description: descriptions[page.file] || page.description,
    alternates: {
      canonical: page.file === "index.html" ? "/" : `/${page.file}`,
      languages: { ...languages, "x-default": "/" },
    },
    robots: { index: true, follow: true },
    openGraph: { title: page.title, description: page.description, locale: page.locale === "en" ? "en_US" : "ar_PS", type: "website" },
  };
}

function detailMetadata(slug, locale, record) {
  const file = `${slug}${locale === "en" ? "-en" : ""}.html`;
  const translatedFile = `${slug}${locale === "en" ? "" : "-en"}.html`;
  const title = record.title;
  const description = record.summary || record.description || title;
  return {
    title,
    description,
    alternates: {
      canonical: `/${file}`,
      languages: {
        ar: `/${(locale === "ar" ? file : translatedFile)}`,
        en: `/${(locale === "en" ? file : translatedFile)}`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: { title, description, locale: locale === "en" ? "en_US" : "ar_PS", type: "article" },
  };
}

export default async function Page({ params }) {
  const { slug = [] } = await params;
  const key = slug.join("/") || "index.html";
  const articleMatch = key.match(/^(news-[1-4])(-en)?\.html$/);
  if (articleMatch) {
    const [, articleSlug, englishSuffix] = articleMatch;
    const locale = englishSuffix ? "en" : "ar";
    const article = newsArticles[articleSlug]?.[locale];
    if (!article) notFound();
    return <NewsArticle slug={articleSlug} locale={locale} article={article} />;
  }
  const partnerMatch = key.match(/^(partner-(?:impact|islamic-bank|jawwal|khotwa|ruwwad))(-en)?\.html$/);
  if (partnerMatch) {
    const [, partnerSlug, englishSuffix] = partnerMatch;
    const locale = englishSuffix ? "en" : "ar";
    const partner = partnerPages[partnerSlug]?.[locale];
    if (!partner) notFound();
    return <PartnerDetail slug={partnerSlug} locale={locale} partner={partner} />;
  }
  const Component = pageComponents[key];
  if (!Component) notFound();
  return <Component />;
}
