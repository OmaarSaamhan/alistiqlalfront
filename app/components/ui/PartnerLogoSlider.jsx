"use client";

import { useEffect, useState } from "react";

const defaults = {
  ar: [
    { href: "partner-jawwal.html", src: "/images/jawwal-logo.webp", alt: "شعار شركة جوال", name: "شركة جوال" },
    { href: "partner-islamic-bank.html", src: "/images/palestine-islamic-bank-logo.png", alt: "شعار البنك الإسلامي الفلسطيني", name: "البنك الإسلامي الفلسطيني" },
    { href: "partner-impact.html", src: "/images/impact-school-placeholder.svg", alt: "شعار مدرسة IMPACT الأمريكية", name: "مدرسة IMPACT الأمريكية" },
    { href: "partner-ruwwad.html", src: "/images/partner-ruwwad.svg", alt: "شعار شركة روّاد فلسطين للحلول التقنية", name: "شركة روّاد فلسطين للحلول التقنية" },
    { href: "partner-khotwa.html", src: "/images/partner-khotwa.svg", alt: "شعار شركة خطوة للمسؤولية المجتمعية", name: "شركة خطوة للمسؤولية المجتمعية" },
  ],
  en: [
    { href: "partner-jawwal-en.html", src: "/images/jawwal-logo.webp", alt: "Jawwal logo", name: "Jawwal" },
    { href: "partner-islamic-bank-en.html", src: "/images/palestine-islamic-bank-logo.png", alt: "Palestine Islamic Bank logo", name: "Palestine Islamic Bank" },
    { href: "partner-impact-en.html", src: "/images/impact-school-placeholder.svg", alt: "IMPACT American Kindergarten logo", name: "IMPACT American Kindergarten" },
    { href: "partner-ruwwad-en.html", src: "/images/partner-ruwwad.svg", alt: "Ruwwad Palestine logo", name: "Ruwwad Palestine" },
    { href: "partner-khotwa-en.html", src: "/images/partner-khotwa.svg", alt: "Khotwa community solutions logo", name: "Khotwa Community Solutions" },
  ],
};

export default function PartnerLogoSlider({ locale = "ar" }) {
  const english = locale === "en";
  const [logos, setLogos] = useState(defaults[english ? "en" : "ar"]);
  useEffect(() => {
    let active = true;
    fetch("/api/content/partners", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((records) => {
        if (!active || !records.length) return;
        setLogos(records.map((record) => ({
          href: `/content/partners/${encodeURIComponent(record.slug)}${english ? "?lang=en" : ""}`,
          src: record.logoImage,
          alt: english ? `${record.nameEn || record.name} logo` : `شعار ${record.name}`,
          name: english ? (record.nameEn || record.name) : record.name,
        })));
      }).catch(() => {});
    return () => { active = false; };
  }, [english]);
  const groups = [0, 1, 2, 3];
  return <div className="partner-track" aria-label={english ? "Organizations we have worked with" : "المؤسسات التي عملنا معها"}>
    <div className="partner-loop" style={{ "--partner-loop-distance": "-25%" }}>
      {groups.map((group) => <div key={group} className="partner-loop-group" aria-hidden={group !== 0}>
        {logos.map((partner, index) => <a key={`${partner.href}-${index}`} className="partner-slide" href={partner.href} tabIndex={group === 0 ? 0 : -1}>
          <span className="partner-logo-circle"><img src={partner.src} alt={group === 0 ? partner.alt : ""} loading="lazy" /></span>
          <span>{partner.name}</span>
        </a>)}
      </div>)}
    </div>
  </div>;
}
