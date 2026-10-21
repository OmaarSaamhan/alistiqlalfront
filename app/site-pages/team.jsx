import SiteLayout from "../components/layout/SiteLayout";
import ManagedContent from "../components/ui/ManagedContent";

export default function TeamPage() {
  return (
    <SiteLayout page="team" locale="ar">
      <main className="site-main">
        <section className="inner-hero">
          <div className="wrap">
            <div className="crumb"><a href="index.html">الرئيسية</a> / فريقنا</div>
            <span className="eyebrow">فريقنا</span>
            <h1>الأشخاص وراء رسالتنا</h1>
            <p>يجمع فريق الأكاديمية بين العمل الإداري والرياضي والصحي والنفسي، لخدمة الأطفال وتنفيذ أنشطة هادفة.</p>
          </div>
        </section>
        <section className="team-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">فريق الأكاديمية</span>
              <h2>فريقنا</h2>
              <p>تعرّف على أعضاء الفريق وأدوارهم في خدمة الأطفال.</p>
            </div>
            <ManagedContent type="team" locale="ar" className="team" />
          </div>
        </section>
        <section>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">قصص اللاعبين</span>
              <h2>اللاعبون المميزون</h2>
            </div>
            <ManagedContent type="players" locale="ar" className="players" />
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
