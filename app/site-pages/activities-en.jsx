import SiteLayout from "../components/layout/SiteLayout";
import ActivityArchive from "../components/ui/ActivityArchive";

export default function ActivitiesEnPage() {
  return (
    <SiteLayout page="activities-en" locale="en">
      <main className="site-main">
        <section className="inner-hero">
          <div className="wrap">
            <div className="crumb"><a href="index-en.html">Home</a> / Activities &amp; Events</div>
            <span className="eyebrow">Our archive</span>
            <h1>Space to move and express</h1>
            <p>From sports training before the war to field initiatives and recreational activities, we document the academy’s work with children and the community.</p>
          </div>
        </section>
        <section className="activities-archive-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Academy activities</span>
              <h2>Activities &amp; Events</h2>
            </div>
            <ActivityArchive locale="en" />
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
