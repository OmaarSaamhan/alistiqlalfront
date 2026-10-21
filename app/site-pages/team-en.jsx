import SiteLayout from "../components/layout/SiteLayout";
import ManagedContent from "../components/ui/ManagedContent";

export default function TeamEnPage() {
  return (
    <SiteLayout page="team-en" locale="en">
      <main className="site-main">
        <section className="inner-hero">
          <div className="wrap">
            <div className="crumb"><a href="index-en.html">Home</a> / Our team</div>
            <span className="eyebrow">Our people</span>
            <h1>The people behind our mission</h1>
            <p>Our team brings together administration, sports, health and psychosocial support to serve children through purposeful activities.</p>
          </div>
        </section>
        <section className="team-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Academy team</span>
              <h2>Our team</h2>
              <p>Meet the people and roles supporting the academy’s work with children.</p>
            </div>
            <ManagedContent type="team" locale="en" className="team" />
          </div>
        </section>
        <section>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Player stories</span>
              <h2>Featured players</h2>
            </div>
            <ManagedContent type="players" locale="en" className="players" />
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
