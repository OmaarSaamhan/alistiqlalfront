"use client";

import { useEffect, useState } from "react";
import styles from "./ManagedContent.module.css";

const paths = { activities: "activities", programs: "programs", projects: "projects", news: "news", players: "players" };

export default function ManagedContent({ type, locale = "ar", limit, className = "" }) {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    let active = true;
    fetch(`/api/content/${type}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((items) => { if (active && Array.isArray(items)) setRecords(items); })
      .catch(() => {});
    return () => { active = false; };
  }, [type]);

  const visible = limit ? records.slice(0, limit) : records;
  if (!visible.length) return null;
  const english = locale === "en";
  const typeName = english ? ({ activities: "Activities", programs: "Programs", projects: "Future initiatives", news: "News", players: "Featured players" }[type]) : ({ activities: "أنشطة وفعاليات مضافة", programs: "برامج الأكاديمية", projects: "البرامج المستقبلية", news: "أخبار الأكاديمية", players: "لاعبون مميزون" }[type]);

  return <div className={`${styles.collection} ${styles[type]} ${className}`} aria-label={typeName}>
    {visible.map((item) => {
      const text = (key) => english ? (item[`${key}En`] || item[key] || "") : (item[key] || item[`${key}En`] || "");
      const image = item.cardImage;
      const href = `/content/${paths[type]}/${encodeURIComponent(item.slug)}${english ? "?lang=en" : ""}`;
      const summary = text("subtitle") || text("content");
      const tags = english ? (item.hashtagsEn?.length ? item.hashtagsEn : item.hashtags) : item.hashtags;
      return <article className={`${styles.card} ${styles[`card-${type}`]}`} key={item.id}>
        {image && (type === "players"
          ? <div className={styles.image}><img src={image} alt={playerNameForAlt(item, english)} loading="lazy" /></div>
          : <a className={styles.image} href={href} tabIndex={-1} aria-hidden="true"><img src={image} alt="" loading="lazy" /></a>)}
        <div className={styles.body}>
          {(text("category") || text("sport") || item.date) && <div className={styles.meta}><span>{text("category") || text("sport") || typeName}</span>{item.date && <time dateTime={item.date}>{item.date}</time>}</div>}
          <h2>{type === "players" ? (text("name") || text("title")) : <a href={href}>{text("name") || text("title")}</a>}</h2>
          {type !== "players" && text("subtitle") && <h3>{text("subtitle")}</h3>}
          {type !== "players" && summary && <p>{summary.length > 250 ? `${summary.slice(0, 247)}…` : summary}</p>}
          {item.type === "players" && text("playingPeriod") && <div className={styles.period}><span>{english ? "Playing period" : "فترة اللعب"}</span><b>{text("playingPeriod")}</b></div>}
          {type !== "players" && !!tags?.length && <div className={styles.tags}>{tags.map((tag) => <span key={tag}>#{tag.replace(/^#/, "")}</span>)}</div>}
          {type !== "players" && <a className={styles.readMore} href={href}>{english ? "Read more" : "التفاصيل"}<span>{english ? "→" : "←"}</span></a>}
        </div>
      </article>;
    })}
  </div>;
}

function playerNameForAlt(item, english) {
  return english ? (item.nameEn || item.name || "") : (item.name || item.nameEn || "");
}
