import SiteLayout from "../components/layout/SiteLayout";

export default function PartnershipsPage() {
  return (
    <SiteLayout page="partnerships" locale="ar">
      <>
        <main className="site-main"><section className="inner-hero"><div className="wrap"><div className="crumb"><a href="index.html">الرئيسية</a> / الشراكات والتعاون</div><span className="eyebrow">معًا من أجل الأطفال</span><h1>الشراكات والتعاون</h1><p>نعمل مع المؤسسات والمبادرات لتطوير أنشطة رياضية ومجتمعية تلبي احتياجات الأطفال.</p></div></section><section className="partnership" id="partners"><div className="wrap partnership-grid"><div className="partnership-visual" aria-hidden="true"><div className="orbit"><b>⚽</b><b>✳</b><b>♡</b><b>↗</b></div><div className="orbit-center">معًا من أجل<br />الأطفال</div></div><div className="partnership-copy"><span className="eyebrow">الشراكات والتعاون</span><h2>معًا من أجل الأطفال</h2><p>نؤمن بأهمية التعاون في توسيع نطاق العمل الرياضي والمجتمعي وتطوير البرامج التي تستجيب لاحتياجات الأطفال.</p><p>نرحب بالتواصل مع المؤسسات المحلية والدولية، والمبادرات المجتمعية، والجهات المهتمة بالرياضة وتنمية الطفولة والدعم النفسي والترفيهي، لتبادل الخبرات وتنفيذ مبادرات مشتركة ذات أثر إيجابي.</p><p><strong>للتعاون أو بناء شراكة، يسعدنا استقبال تواصلكم.</strong></p><a className="button" href="contact.html">ابدأ حوارًا معنا <span>←</span></a></div></div></section></main>
      </>
    </SiteLayout>
  );
}
