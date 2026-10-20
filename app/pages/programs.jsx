import SiteLayout from "../components/layout/SiteLayout";
import ManagedContent from "../components/ui/ManagedContent";

const pathways = [
  { icon: "gymnastics", eyebrow: "قبل الحرب", title: "التدريب الرياضي", text: "برامج رياضية في الجمباز والباركور والكاراتيه وأنشطة فردية أخرى، أسهمت في تنمية المهارات وبناء علاقات إيجابية." },
  { icon: "karate", eyebrow: "خلال الحرب", title: "التدريب الميداني", text: "أنشطة بدنية وحركية تصل إلى الأطفال في الأماكن المتاحة، مع تكييف التمارين بحسب الظروف والفئات العمرية." },
  { icon: "kungfu", eyebrow: "تنمية متكاملة", title: "المشاركة والدعم", text: "فعاليات وأنشطة ترفيهية واجتماعية داعمة تمنح الأطفال فرصًا للحركة واللعب والتفاعل والتعبير." },
];

export default function ProgramsPage() {
  return (
    <SiteLayout page="programs" locale="ar">
      <main className="site-main">
        <section className="inner-hero"><div className="wrap"><div className="crumb"><a href="index.html">الرئيسية</a> / البرامج</div><span className="eyebrow">البرامج</span><h1>برامج تنمّي الموهبة وتفتح آفاق المشاركة</h1><p>تطوّر الأكاديمية برامجها وفق احتياجات الأطفال والظروف المحيطة بهم، وتجمع بين التدريب الرياضي والتعلم والتفاعل المجتمعي.</p></div></section>
        <section><div className="wrap"><div className="section-head"><span className="eyebrow">مساراتنا</span><h2>برامج تتكيف مع احتياجات الأطفال</h2><p>من التدريب في مقر الأكاديمية إلى الأنشطة الميدانية، نواصل توفير فرص آمنة للحركة والتعلم والمشاركة.</p></div><div className="program-grid">{pathways.map((item) => <article className="info-card" key={item.title}><div className="icon" aria-hidden="true">{item.icon}</div><small>{item.eyebrow}</small><h2>{item.title}</h2><p>{item.text}</p></article>)}</div><ManagedContent type="programs" locale="ar" className="program-grid" /><a className="button" href="services.html">تعرّف على خدمات الأكاديمية <span>←</span></a></div></section>
      </main>
    </SiteLayout>
  );
}
