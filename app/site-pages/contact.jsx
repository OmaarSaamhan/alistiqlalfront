import SiteLayout from "../components/layout/SiteLayout";
import ContactForm from "../components/ui/ContactForm";

export default function ContactPage() {
  return (
    <SiteLayout page="contact" locale="ar">
      <>
        <main className="site-main"><section className="inner-hero"><div className="wrap"><div className="crumb"><a href="index.html">الرئيسية</a> / تواصل معنا</div><span className="eyebrow">نحن على تواصل</span><h1>تواصل مع الأكاديمية</h1><p>يسعدنا التواصل مع أولياء الأمور والمؤسسات والشركاء والمهتمين بأنشطة الأكاديمية.</p></div></section><section className="contact" id="contact"><div className="wrap contact-grid"><div className="contact-info"><span className="eyebrow">نحن على تواصل</span><h2>تواصل مع الأكاديمية</h2><p>يسعدنا التواصل مع أولياء الأمور والمؤسسات والشركاء وكل المهتمين بأنشطتنا وبرامجنا.</p><div className="contact-item"><i>⌖</i><div><b>المقر الأساسي</b><span>الشيخ رضوان، مدينة غزة، فلسطين</span></div></div></div>
      <ContactForm className="form" successMessage={"شكرًا لاهتمامكم بأكاديمية الاستقلال الرياضية."}><div className="field"><label htmlFor="name">الاسم الكامل</label><input id="name" name="name" required placeholder="الاسم الكامل" /></div><div className="field"><label htmlFor="organization">اسم المؤسسة، إن وجد</label><input id="organization" name="organization" placeholder="اسم المؤسسة" /></div><div className="field"><label htmlFor="reply">البريد الإلكتروني أو رقم الهاتف</label><input id="reply" name="reply" required placeholder="وسيلة التواصل" /></div><div className="field"><label htmlFor="subject">موضوع الرسالة</label><input id="subject" name="subject" required placeholder="استفسار، تعاون..." /></div><div className="field full"><label htmlFor="message">تفاصيل الاستفسار أو طلب التعاون</label><textarea id="message" name="message" required placeholder="اكتب رسالتك هنا"></textarea></div><button className="button" type="submit">إرسال الرسالة <span>←</span></button><p className="form-hint" id="form-status">نسعد بالتواصل معكم والعمل معًا من أجل مستقبل أفضل للأطفال.</p></ContactForm>
    </div></section></main>
      </>
    </SiteLayout>
  );
}
