import SiteLayout from "../components/layout/SiteLayout";
import ActivityArchive from "../components/ui/ActivityArchive";

export default function ActivitiesPage() {
  return (
    <SiteLayout page="activities" locale="ar">
      <main className="site-main">
        <section className="inner-hero">
          <div className="wrap">
            <div className="crumb"><a href="index.html">الرئيسية</a> / الأنشطة والفعاليات</div>
            <span className="eyebrow">أرشيفنا</span>
            <h1>مساحات للحركة والتعبير</h1>
            <p>من التدريبات الرياضية قبل الحرب إلى المبادرات الميدانية والأنشطة الترفيهية، نواصل توثيق ما قدمته الأكاديمية للأطفال والمجتمع.</p>
          </div>
        </section>
        <section className="activities-archive-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">أنشطة الأكاديمية</span>
              <h2>الأنشطة والفعاليات</h2>
            </div>
            <ActivityArchive locale="ar" />
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
