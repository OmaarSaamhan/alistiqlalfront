import SocialLinks from "../ui/SocialLinks";

const labels = {
  ar: {
    brand: "أكاديمية الاستقلال الرياضية", alt: "شعار الأكاديمية",
    summary: "مؤسسة رياضية ومجتمعية تسعى إلى تنمية قدرات الأطفال وتعزيز دور الرياضة والأنشطة الهادفة في المجتمع.",
    linksTitle: "روابط سريعة", about: "من نحن", team: "الكادر ومجلس الإدارة", activities: "الأنشطة والفعاليات", projects: "المشاريع المستقبلية", contact: "تواصل معنا", news: "الأخبار",
    rights: "© أكاديمية الاستقلال الرياضية — جميع الحقوق محفوظة.", back: "العودة إلى الأعلى",
  },
  en: {
    brand: "Al-Istiqlal Sports Academy", alt: "Academy logo",
    summary: "A sports and community organization working to develop children's abilities and strengthen the role of sport and purposeful activities.",
    linksTitle: "Explore", about: "About us", team: "Team & board", activities: "Activities & events", projects: "Future projects", contact: "Contact", news: "News",
    rights: "© Al-Istiqlal Sports Academy. All rights reserved.", back: "Back to top",
  },
};

const footerLinks = ["about", "team", "activities", "projects", "news", "contact"];

export default function SiteFooter({ locale = "ar" }) {
  const t = labels[locale];
  const suffix = locale === "en" ? "-en" : "";

  return (
    <footer className="academy-footer">
      <div className="academy-footer__ornament" aria-hidden="true"><span>✳</span></div>
      <div className="academy-footer__container">
        <div className="academy-footer__main">
          <div className="academy-footer__identity">
            <a className="academy-footer__brand" href={`index${suffix}.html`}>
              <span className="academy-footer__logo-frame">
                <img src="/logo.png" alt={t.alt} />
              </span>
              <span className="academy-footer__brand-name">{t.brand}</span>
            </a>
            <p className="academy-footer__summary">{t.summary}</p>
            <SocialLinks locale={locale} />
          </div>

          <nav className="academy-footer__navigation" aria-label={t.linksTitle}>
            <h2 className="academy-footer__links-title">{t.linksTitle}</h2>
            <div className="academy-footer__links">
              {footerLinks.map((key, index) => (
                <a href={`${key}${suffix}.html`} key={key}>
                  <span>{t[key]}</span>
                  <span className="academy-footer__link-arrow" aria-hidden="true">↗</span>
                  <span className="academy-footer__link-index" aria-hidden="true">0{index + 1}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="academy-footer__bottom">
          <span>{t.rights}</span>
          <a className="academy-footer__back" href="#top">
            <span>{t.back}</span><span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
