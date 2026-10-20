"use client";

import { useEffect } from "react";

const revealPlan = [
  { section: "#vision", groups: [[".section-head", "rise"], [".purpose-card", ["pop", "start", "end"]]] },
  { section: ".goals", groups: [[".goals-layout > div:first-child", "start"], [".goal", ["rise", "start", "end"]]] },
  { section: ".home-identity:not(.home-audience)", groups: [[".section-head", "rise"], [".purpose-card", ["end", "pop", "start"]]] },
  { section: ".home-audience", groups: [[".section-head", "rise"], [".purpose-card", ["start", "rise", "end"]]] },
  { section: ".timeline:not(.academy-journey)", groups: [[".section-head", "rise"], [".era", ["start", "pop", "end"]]] },
  { section: ".impact", groups: [[".impact-copy", "start"], [".impact-box", "end"]] },
  { section: ".academy-journey", groups: [[".section-head", "rise"], [".era", ["pop", "end", "start"]]] },
];

export default function HomeScrollReveal({ locale = "ar" }) {
  useEffect(() => {
    const page = document.querySelector(locale === "en" ? ".site-page--index-en" : ".site-page--index");
    if (!page) return;

    const targets = [];
    revealPlan.forEach(({ section: selector, groups }) => {
      const section = page.querySelector(selector);
      if (!section) return;
      groups.forEach(([groupSelector, variants]) => {
        section.querySelectorAll(groupSelector).forEach((element, index) => {
          const variant = Array.isArray(variants) ? variants[index % variants.length] : variants;
          element.dataset.scrollReveal = variant;
          element.style.setProperty("--reveal-delay", `${Math.min(index * 110, 440)}ms`);
          targets.push(element);
        });
      });
    });

    if (!targets.length) return;
    page.classList.add("home-scroll-reveal-ready");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return () => page.classList.remove("home-scroll-reveal-ready");
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add("is-visible");
        observer.unobserve(target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -5% 0px" });

    targets.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      page.classList.remove("home-scroll-reveal-ready");
      targets.forEach((element) => {
        delete element.dataset.scrollReveal;
        element.classList.remove("is-visible");
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, [locale]);

  return null;
}
