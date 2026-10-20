"use client";

import { useEffect, useState } from "react";

const networks = [
  { key: "facebook", label: "Facebook", path: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" },
  { key: "instagram", label: "Instagram", path: "M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5Zm0 2A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h10a2.5 2.5 0 0 0 2.5-2.5V7A2.5 2.5 0 0 0 17 4.5H7Zm5 2.2a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm5.5-3a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z" },
  { key: "tiktok", label: "TikTok", path: "M19.6 7.2a6.8 6.8 0 0 1-4.2-1.5v8.1a6.1 6.1 0 1 1-5.2-6.1v3.3a2.9 2.9 0 1 0 2 2.8V2.5h3.2c.2 2.1 1.9 3.8 4.2 4v.7Z" },
  { key: "youtube", label: "YouTube", path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.3 3.7-6.3 3.7Z" },
  { key: "twitter", label: "Twitter", path: "M23.4 4.8a9.2 9.2 0 0 1-2.7.7 4.7 4.7 0 0 0 2-2.6 9.3 9.3 0 0 1-3 1.1 4.6 4.6 0 0 0-8 4.2 13.1 13.1 0 0 1-9.5-4.8 4.6 4.6 0 0 0 1.4 6.2 4.6 4.6 0 0 1-2.1-.6v.1a4.6 4.6 0 0 0 3.7 4.5 4.6 4.6 0 0 1-2.1.1 4.6 4.6 0 0 0 4.3 3.2A9.3 9.3 0 0 1 1.7 19a13.1 13.1 0 0 0 20.2-11 9.4 9.4 0 0 0 2.3-2.4Z" },
];

function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

export default function SocialLinks({ locale = "ar" }) {
  const [links, setLinks] = useState({});
  const isEnglish = locale === "en";

  useEffect(() => {
    let active = true;
    fetch("/api/content/settings", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (!active || !Array.isArray(items)) return;
        const settings = items.find((item) => item.slug === "social-links");
        if (!settings?.content) return;
        const parsed = JSON.parse(settings.content);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) setLinks(parsed);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <div className="academy-footer__social" aria-label={isEnglish ? "Social media" : "التواصل الاجتماعي"}>
      <h2>{isEnglish ? "Follow us" : "تابعونا"}</h2>
      <div className="academy-footer__social-list">
        {networks.map(({ key, label, path }) => {
          const href = safeUrl(links[key] || "");
          const icon = <svg viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>;
          return href
            ? <a href={href} key={key} aria-label={label} title={label} target="_blank" rel="noreferrer">{icon}</a>
            : <span key={key} aria-label={`${label} — ${isEnglish ? "add its link in the dashboard" : "أضف رابطه من لوحة التحكم"}`} title={label}>{icon}</span>;
        })}
      </div>
    </div>
  );
}
