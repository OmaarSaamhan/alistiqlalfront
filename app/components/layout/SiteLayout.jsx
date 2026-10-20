import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import DocumentLocale from "../ui/DocumentLocale";
import HomeScrollReveal from "../ui/HomeScrollReveal";
import EliteGoldTheme from "../ui/EliteGoldTheme";

export default function SiteLayout({ page, stylePage = page, locale, children }) {
  const isEnglish = locale === "en";
  const styleKey = stylePage.startsWith("event-") ? "events" : stylePage.startsWith("partner-") ? "partners" : stylePage.startsWith("news-") ? "news" : stylePage.replace(/-en$/, "");
  return <div id="top" className={`site-page site-page--${stylePage}`} lang={locale} dir={isEnglish ? "ltr" : "rtl"}>
    <link rel="stylesheet" href={`/styles/pages/${styleKey}.css`} precedence="academy-page" />
    <link rel="stylesheet" href="/styles/site-footer.css" precedence="academy-page-footer" />
    <link rel="stylesheet" href="/styles/responsive.css" precedence="academy-responsive" />
    {(page === "index" || page === "index-en") && <link rel="stylesheet" href="/styles/scroll-reveal.css" precedence="academy-page" />}
    <DocumentLocale locale={locale} />
    <EliteGoldTheme />
    <SiteHeader locale={locale} page={page} />
    {(page === "index" || page === "index-en") && <HomeScrollReveal locale={isEnglish ? "en" : "ar"} />}
    {children}
    <SiteFooter locale={locale} />
  </div>;
}
