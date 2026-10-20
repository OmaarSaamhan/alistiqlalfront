"use client";

import { useEffect, useState } from "react";

function displayDate(value, locale) {
  if (!value) return "";
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "en" ? "en" : "ar-PS", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(date);
}

export default function ActivityArchive({ locale = "ar" }) {
  const [records, setRecords] = useState([]);
  const english = locale === "en";

  useEffect(() => {
    let active = true;
    fetch("/api/content/activities", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((items) => { if (active && Array.isArray(items)) setRecords(items); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const text = (item, key) => english ? (item[`${key}En`] || item[key] || "") : (item[key] || item[`${key}En`] || "");
  return records.map((item) => {
    const title = text(item, "title") || text(item, "name");
    const subtitle = text(item, "subtitle");
    const content = text(item, "content");
    const detailHref = `/content/activities/${encodeURIComponent(item.slug)}${english ? "?lang=en" : ""}`;
    return <section className="featured-event" key={item.id}>
      <div className="wrap"><article className="featured-event-card">
        {item.cardImage && <img src={item.cardImage} alt={title} loading="lazy" />}
        <div className="featured-event-copy">
          <small>{text(item, "category") || (english ? "Activity & event" : "نشاط وفعالية")}</small>
          {item.date && <time dateTime={item.date}>{displayDate(item.date, locale)}</time>}
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
          {content && <p>{content.length > 320 ? `${content.slice(0, 317)}…` : content}</p>}
          <a className="button event-details-button" href={detailHref}>{english ? "View event details" : "اعرف المزيد"}<span>{english ? "→" : "←"}</span></a>
        </div>
      </article></div>
    </section>;
  });
}
