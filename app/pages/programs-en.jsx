import SiteLayout from "../components/layout/SiteLayout";
import ManagedContent from "../components/ui/ManagedContent";

const pathways = [
  { icon: "gymnastics", eyebrow: "Before the war", title: "Sports training", text: "Gymnastics, parkour, karate and other individual sports helped children develop skills and build positive relationships." },
  { icon: "karate", eyebrow: "During the war", title: "Field training", text: "Physical and movement activities reach children in available spaces, adapted to circumstances and age groups." },
  { icon: "kungfu", eyebrow: "Holistic development", title: "Participation and support", text: "Recreational and social activities give children opportunities to move, play, connect and express themselves." },
];

export default function ProgramsEnPage() {
  return (
    <SiteLayout page="programs-en" locale="en">
      <main className="site-main">
        <section className="inner-hero"><div className="wrap"><div className="crumb"><a href="index-en.html">Home</a> / Programs</div><span className="eyebrow">Programs</span><h1>Programs that grow talent and open opportunities</h1><p>The Academy develops programs around children’s needs and circumstances, bringing together sports training, learning and community participation.</p></div></section>
        <section><div className="wrap"><div className="section-head"><span className="eyebrow">Our pathways</span><h2>Programs that adapt to children’s needs</h2><p>From training at the Academy to field activities, we continue to create safe opportunities for movement, learning and participation.</p></div><div className="program-grid">{pathways.map((item) => <article className="info-card" key={item.title}><div className="icon" aria-hidden="true">{item.icon}</div><small>{item.eyebrow}</small><h2>{item.title}</h2><p>{item.text}</p></article>)}</div><ManagedContent type="programs" locale="en" className="program-grid" /><a className="button" href="services-en.html">Explore Academy services <span>→</span></a></div></section>
      </main>
    </SiteLayout>
  );
}
