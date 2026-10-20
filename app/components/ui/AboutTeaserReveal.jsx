"use client";

import { useEffect } from "react";

export default function AboutTeaserReveal() {
  useEffect(() => {
    const section = document.querySelector(".about-teaser");
    if (!section) return;

    section.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return null;
}
