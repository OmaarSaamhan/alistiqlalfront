"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const labels = {
  ar: {
    brand: "أكاديمية الاستقلال الرياضية", home: "الرئيسية", about: "عن الأكاديمية", story: "قصتنا",
    vision: "الرؤية والرسالة", team: "فريقنا", programs: "البرامج", activities: "الأنشطة والفعاليات",
    projects: "المشاريع المستقبلية", services: "خدماتنا", news: "الأخبار", contact: "تواصل معنا",
    openMenu: "فتح القائمة", closeMenu: "إغلاق القائمة", language: "العربية", flag: "🇸🇦", other: "English",
  },
  en: {
    brand: "Al-Istiqlal Sports Academy", home: "Home", about: "About", story: "Our story",
    vision: "Vision & mission", team: "Our team", programs: "Programs", activities: "Activities & events",
    projects: "Future projects", services: "Our services", news: "News", contact: "Contact us",
    openMenu: "Open menu", closeMenu: "Close menu", language: "English", flag: "🇺🇸", other: "العربية",
  },
};

function route(name, locale) {
  const suffix = locale === "en" ? "-en" : "";
  return `/${name}${suffix}.html`;
}

export default function SiteHeader({ locale = "ar", page = "index" }) {
  const t = labels[locale];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const otherPage = page.replace(/-en$/, "");
  const languageHref = (targetLocale) => pathname?.startsWith("/content/")
    ? `${pathname}${targetLocale === "en" ? "?lang=en" : ""}`
    : route(otherPage, targetLocale);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="topbar">
      <nav className="nav wrap" aria-label={locale === "en" ? "Main navigation" : "التنقل الرئيسي"}>
        <a className="brand" href={route("index", locale)}>
          <img className="brand-logo" src="/logo.png" alt={locale === "en" ? "Academy logo" : "شعار أكاديمية الاستقلال الرياضية"} />
          <span>{t.brand}</span>
        </a>
        <button className="mobile-toggle" type="button" aria-label={menuOpen ? t.closeMenu : t.openMenu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "×" : "☰"}</button>
        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          <a href={`${route("index", locale)}#home`} onClick={closeMenu}>{t.home}</a>
          <div className={`nav-dropdown${aboutOpen ? " open" : ""}`}>
            <button className="nav-dropdown-toggle" type="button" aria-expanded={aboutOpen} aria-haspopup="true" onClick={() => setAboutOpen(!aboutOpen)}>{t.about} <span className="chevron" aria-hidden="true">⌄</span></button>
            <div className="nav-dropdown-menu">
              <a href={`${route("about", locale)}#story`} onClick={closeMenu}>{t.story}</a>
              <a href={`${route("about", locale)}#vision`} onClick={closeMenu}>{t.vision}</a>
              <a href={route("team", locale)} onClick={closeMenu}>{t.team}</a>
            </div>
          </div>
          <div className={`nav-dropdown${programsOpen ? " open" : ""}`}>
            <button className="nav-dropdown-toggle" type="button" aria-expanded={programsOpen} aria-haspopup="true" onClick={() => setProgramsOpen(!programsOpen)}>{t.programs} <span className="chevron" aria-hidden="true">⌄</span></button>
            <div className="nav-dropdown-menu">
              <a href={route("programs", locale)} onClick={closeMenu}>{t.programs}</a>
              <a href={route("activities", locale)} onClick={closeMenu}>{t.activities}</a>
              <a href={route("projects", locale)} onClick={closeMenu}>{t.projects}</a>
            </div>
          </div>
          <a href={route("services", locale)} onClick={closeMenu}>{t.services}</a>
          <a href={route("news", locale)} onClick={closeMenu}>{t.news}</a>
          <a className="nav-contact" href={route("contact", locale)} onClick={closeMenu}>{t.contact}</a>
        </div>
        <details className="language-picker">
          <summary className="language-button" aria-haspopup="true">
            <span className="lang-flag" dir="ltr">{t.flag}</span><span lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>{t.language}</span><span className="chevron" aria-hidden="true">⌄</span>
          </summary>
          <div className="language-menu">
            <a href={languageHref("ar")} lang="ar" aria-current={locale === "ar" ? "page" : undefined}><span dir="ltr">🇸🇦</span><span lang="ar" dir="rtl">العربية</span></a>
            <a href={languageHref("en")} lang="en" aria-current={locale === "en" ? "page" : undefined}><span dir="ltr">🇺🇸</span><span lang="en" dir="ltr">English</span></a>
          </div>
        </details>
      </nav>
    </header>
  );
}
