import SiteLayout from "../components/layout/SiteLayout";
import ContactForm from "../components/ui/ContactForm";

export default function ContactEnPage() {
  return (
    <SiteLayout page="contact-en" locale="en">
      <>
        <main className="site-main"><section className="inner-hero"><div className="wrap"><div className="crumb"><a href="index-en.html">Home</a> / Contact</div><span className="eyebrow">Let’s connect</span><h1>Contact the academy</h1><p>We welcome parents, organizations, partners and everyone interested in academy activities.</p></div></section><section className="contact" id="contact"><div className="wrap contact-grid"><div className="contact-info"><span className="eyebrow">Let’s connect</span><h2>Contact the academy</h2><p>We welcome parents, organizations, partners and everyone interested in our activities and programs.</p><div className="contact-item"><i>⌖</i><div><b>Main location</b><span>Sheikh Radwan, Gaza City, Palestine</span></div></div></div><ContactForm className="form" successMessage={"Thank you for your interest in Al-Istiqlal Sports Academy."}><div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required placeholder="Full name" /></div><div className="field"><label htmlFor="organization">Organization, if applicable</label><input id="organization" name="organization" placeholder="Organization" /></div><div className="field"><label htmlFor="reply">Email or phone number</label><input id="reply" name="reply" required placeholder="Your contact details" /></div><div className="field"><label htmlFor="subject">Subject</label><input id="subject" name="subject" required placeholder="Inquiry, partnership..." /></div><div className="field full"><label htmlFor="message">Your inquiry or partnership request</label><textarea id="message" name="message" required placeholder="Write your message here"></textarea></div><button className="button" type="submit">Send message <span>→</span></button><p className="form-hint" id="form-status">We look forward to hearing from you and working together for a brighter future for children.</p></ContactForm></div></section></main>
      </>
    </SiteLayout>
  );
}
