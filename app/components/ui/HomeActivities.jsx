"use client";

import { useEffect, useState } from "react";

function displayDate(value) {
  if (!value) return "";
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ar-PS", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export default function HomeActivities({ locale = "ar" }) {
  const [items, setItems] = useState([]);
  const english = locale === "en";
  useEffect(() => {
    let active = true;
    fetch("/api/content/activities", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((records) => { if (active && Array.isArray(records)) setItems(records.slice(0, 3)); })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  if (!items.length) return <p className="activities-empty">{english ? "No activities have been published yet." : "لا توجد أنشطة منشورة حاليًا."}</p>;
  const text = (item, key) => english ? (item[`${key}En`] || item[key] || "") : (item[key] || item[`${key}En`] || "");
  return <div className="activity-grid">{items.map((item) => <a className="activity photo-tile" key={item.id || item.slug} href={item.href || `/content/activities/${encodeURIComponent(item.slug)}${english ? "?lang=en" : ""}`}>
    {item.cardImage && <img src={item.cardImage} alt="" loading="lazy" />}
    <small>{text(item, "category") || (english ? "Activity & event" : "نشاط وفعالية")}{item.date ? ` · ${displayDate(item.date)}` : ""}</small>
    <h3>{text(item, "title") || text(item, "name")}</h3>
  </a>)}</div>;
}
