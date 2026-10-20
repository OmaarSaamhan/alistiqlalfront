import SiteLayout from "../layout/SiteLayout";

const logoFrame = { maxWidth: "85%", maxHeight: "120px", objectFit: "contain", background: "#fff", padding: "14px", borderRadius: "16px" };
const circleLogoFrame = { width: "180px", height: "180px", objectFit: "contain", borderRadius: "50%", background: "white" };

export default function PartnerDetail({ slug, locale, partner }) {
  const isEnglish = locale === "en";
  const home = isEnglish ? "index-en.html" : "index.html";
  const contact = isEnglish ? "contact-en.html" : "contact.html";
  const logoStyle = slug === "partner-khotwa" || slug === "partner-ruwwad" ? circleLogoFrame : logoFrame;
  const imagePath = partner.logo.startsWith("/") ? partner.logo : `/${partner.logo}`;

  return (
    <SiteLayout page={`${slug}${isEnglish ? "-en" : ""}`} locale={locale}>
      <main className="site-main">
        <section className="inner-hero">
          <div className="wrap">
            <div className="crumb"><a href={home}>{isEnglish ? "Home" : "الرئيسية"}</a> / <a href={`${home}#partners`}>{isEnglish ? "Partners & organizations" : "الشركاء والمؤسسات"}</a> / {partner.title}</div>
            <span className="eyebrow">{partner.heroEyebrow}</span><h1>{partner.title}</h1><p>{partner.summary}</p>
          </div>
        </section>
        <section className="partnership" id="partners">
          <div className="wrap partnership-grid">
            <div className="partnership-visual"><img src={imagePath} alt={partner.logoAlt} style={logoStyle} /></div>
            <div className="partnership-copy"><span className="eyebrow">{partner.eyebrow}</span><h2>{partner.heading}</h2>
              {partner.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              <a className="button" href={`${home}#partners`}>{isEnglish ? "Back to home" : "العودة إلى الرئيسية"} <span>{isEnglish ? "→" : "←"}</span></a>
            </div>
          </div>
        </section>
      </main>
      <section className="inner-hero">
        <div className="wrap"><div className="crumb"><a href={home}>{isEnglish ? "Home" : "الرئيسية"}</a> / {partner.followup.title}</div>
          <span className="eyebrow">{partner.followup.heroEyebrow}</span><h1>{partner.followup.title}</h1><p>{partner.followup.summary}</p>
        </div>
      </section>
      <section className="partnership">
        <div className="wrap partnership-grid">
          <div className="partnership-visual" aria-hidden="true"><div className="orbit">{partner.followup.icons.map((icon, index) => <b key={index}>{icon}</b>)}</div><div className="orbit-center">{partner.followup.orbit}</div></div>
          <div className="partnership-copy"><span className="eyebrow">{partner.followup.eyebrow}</span><h2>{partner.followup.heading}</h2>
            {partner.followup.paragraphs.map((paragraph, index) => <p key={index}>{index === partner.followup.paragraphs.length - 1 ? <strong>{paragraph}</strong> : paragraph}</p>)}
            <a className="button" href={contact}>{(partner.followup.button?.text || (isEnglish ? "Contact the academy" : "تواصل مع الأكاديمية")).replace(/[←→]\s*$/, "")} <span>{isEnglish ? "→" : "←"}</span></a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
