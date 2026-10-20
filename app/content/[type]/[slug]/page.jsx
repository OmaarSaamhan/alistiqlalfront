import SiteLayout from "../../../components/layout/SiteLayout";
import EventGallery from "../../../components/ui/EventGallery";
import { notFound } from "next/navigation";
import styles from "./content.module.css";

const allowed = new Set(["partners", "activities", "programs", "projects", "players", "news"]);
const titles = { partners: "المؤسسات والشركاء", activities: "الأنشطة والفعاليات", programs: "البرامج", projects: "البرامج المستقبلية", players: "اللاعبون المميزون", news: "الأخبار" };

export const dynamic = "force-dynamic";

async function getItem(type, slug) {
  const origin = process.env.ACADEMY_API_ORIGIN || "http://localhost:5042";
  try {
    const response = await fetch(`${origin}/api/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`, { cache: "no-store" });
    return response.ok ? response.json() : null;
  } catch { return null; }
}

export async function generateMetadata({ params, searchParams }) {
  const { type, slug } = await params;
  const { lang } = await searchParams;
  const english = lang === "en";
  if (!allowed.has(type)) return {};
  const item = await getItem(type, slug);
  if (!item) return { title: "المحتوى غير موجود" };
  const name = english ? (item.nameEn || item.name) : (item.name || item.nameEn);
  const title = english ? (item.titleEn || item.title) : (item.title || item.titleEn);
  const subtitle = english ? (item.subtitleEn || item.subtitle) : (item.subtitle || item.subtitleEn);
  const content = english ? (item.contentEn || item.content) : (item.content || item.contentEn);
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: name || title,
    description: subtitle || content?.slice(0, 160) || title,
    alternates: {
      canonical: `${siteOrigin}/content/${type}/${encodeURIComponent(slug)}${english ? "?lang=en" : ""}`,
      languages: { ar: `${siteOrigin}/content/${type}/${encodeURIComponent(slug)}`, en: `${siteOrigin}/content/${type}/${encodeURIComponent(slug)}?lang=en` },
    },
    openGraph: { title: name || title, description: subtitle || title, images: [item.cardImage || item.logoImage].filter(Boolean), type: "article", locale: english ? "en_US" : "ar_PS" },
  };
}

export default async function Page({ params, searchParams }) {
  const { type, slug } = await params;
  const { lang } = await searchParams;
  const english = lang === "en";
  if (!allowed.has(type)) notFound();
  const item = await getItem(type, slug);
  if (!item) notFound();
  const localized = (key) => english ? (item[`${key}En`] || item[key] || "") : (item[key] || item[`${key}En`] || "");
  const names = english ? { partners: "Partners", activities: "Activities & Events", programs: "Programs", projects: "Future Programs", players: "Featured Players", news: "News" } : titles;
  const name = localized("name") || localized("title");
  const back = type === "partners" ? (english ? "/index-en.html#partners" : "/index.html#partners") : type === "players" ? (english ? "/index-en.html#players" : "/index.html#players") : `/${type}${english ? "-en" : ""}.html`;
  const cover = item.logoImage || item.cardImage;
  const tags = english ? (item.hashtagsEn?.length ? item.hashtagsEn : item.hashtags) : item.hashtags;

  if (type === "activities") {
    const eventDate = item.date && !Number.isNaN(new Date(`${item.date.slice(0, 10)}T00:00:00Z`).getTime())
      ? new Intl.DateTimeFormat(english ? "en" : "ar-PS", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${item.date.slice(0, 10)}T00:00:00Z`))
      : item.date;
    const paragraphs = localized("content").split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
    const category = localized("category");
    return <SiteLayout page="activities" stylePage={english ? "event-impact-en" : "event-impact"} locale={english ? "en" : "ar"}>
      <main className="site-main" dir={english ? "ltr" : "rtl"}>
        <section className="inner-hero"><div className="wrap">
          <div className="crumb"><a href={english ? "/index-en.html" : "/index.html"}>{english ? "Home" : "الرئيسية"}</a> / <a href={back}>{names.activities}</a> / {name}</div>
          {category && <span className="eyebrow">{category}</span>}
          <h1>{name}</h1>
          {localized("subtitle") && <p>{localized("subtitle")}</p>}
        </div></section>
        <section><div className="wrap"><div className="event-details-layout">
          <article className={`event-story ${styles.activityStory}`}>
            <span className="eyebrow">{english ? "About this activity" : "نبذة عن النشاط"}</span>
            <h2>{english ? "Activity details" : "تفاصيل النشاط"}</h2>
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <div className="event-meta">
              {item.date && <span><b>{english ? "Date:" : "التاريخ:"}</b> <time dateTime={item.date}>{eventDate}</time></span>}
              {category && <span><b>{english ? "Category:" : "تصنيف النشاط:"}</b> {category}</span>}
            </div>
            {!!tags?.length && <div className="event-tags">{tags.map((tag) => <span key={tag}>#{tag.replace(/^#/, "")}</span>)}</div>}
          </article>
          <EventGallery images={item.gallery?.length ? item.gallery : cover ? [cover] : []} title={name} english={english} />
        </div><a className="button button-outline" href={back}>{english ? "← Back to activities & events" : "→ العودة إلى الأنشطة والفعاليات"}</a></div></section>
      </main>
    </SiteLayout>;
  }

  return <SiteLayout page="news" stylePage="news" locale={english ? "en" : "ar"}><main className={styles.page} dir={english ? "ltr" : "rtl"}>
    <section className={styles.hero}><div className={styles.wrap}><div className={styles.breadcrumb}><a href={english ? "/index-en.html" : "/index.html"}>{english ? "Home" : "الرئيسية"}</a> / <a href={type === "partners" ? `${english ? "/index-en.html" : "/index.html"}#partners` : back}>{names[type]}</a></div><span>{localized("category") || item.date || localized("sport") || names[type]}</span><h1>{name}</h1>{localized("subtitle") && <p>{localized("subtitle")}</p>}</div></section>
    <section className={styles.details}><div className={styles.wrap}>
      {cover && <img className={styles.cover} src={cover} alt={name} />}
      <div className={styles.copy}>{item.date && <time>{item.date}</time>}{localized("content") && localized("content").split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{localized("sport") && <p><b>{english ? "Sport:" : "الرياضة:"}</b> {localized("sport")}</p>}{localized("playingPeriod") && <p><b>{english ? "Playing period:" : "فترة اللعب:"}</b> {localized("playingPeriod")}</p>}</div>
      {!!item.gallery?.length && <><h2>{english ? "Photo gallery" : "معرض الصور"}</h2><div className={styles.gallery}>{item.gallery.map((image, index) => <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer"><img src={image} alt={`${name} — ${index + 1}`} loading="lazy" /></a>)}</div></>}
      {!!tags?.length && <div className={styles.tags}>{tags.map((tag) => <span key={tag}>#{tag.replace(/^#/, "")}</span>)}</div>}
      <a className={styles.back} href={back}>{english ? `Back to ${names[type]}` : `العودة إلى ${names[type]}`} <span>{english ? "→" : "←"}</span></a>
    </div></section>
  </main></SiteLayout>;
}
