import SiteLayout from "../layout/SiteLayout";

export default function NewsArticle({ slug, locale, article }) {
  const isEnglish = locale === "en";
  const newsUrl = isEnglish ? "news-en.html" : "news.html";
  const homeUrl = isEnglish ? "index-en.html" : "index.html";

  return (
    <SiteLayout page={`${slug}${isEnglish ? "-en" : ""}`} locale={locale}>
      <main className="site-main">
        <section className="article-wrap">
          <div className="crumb"><a href={homeUrl}>{isEnglish ? "Home" : "الرئيسية"}</a> / <a href={newsUrl}>{isEnglish ? "News" : "الأخبار"}</a></div>
          <a className="back-news" href={newsUrl}>{isEnglish ? "Back to news" : "العودة إلى الأخبار"}</a>
          <article>
            <header className="article-head">
              <div className="news-meta"><span>{article.category}</span></div>
              <h1>{article.title}</h1>
              <p>{article.summary}</p>
            </header>
            <div className="article-body">{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          </article>
        </section>
      </main>
    </SiteLayout>
  );
}
