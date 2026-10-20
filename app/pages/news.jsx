import SiteLayout from "../components/layout/SiteLayout";
import ManagedContent from "../components/ui/ManagedContent";

export default function NewsPage() {
  return (
    <SiteLayout page="news" locale="ar">
      <>
        <main className="site-main"><section className="inner-hero"><div className="wrap"><div className="crumb"><a href="index.html">الرئيسية</a> / الأخبار</div><span className="eyebrow">آخر المستجدات</span><h1>أخبار الأكاديمية</h1><p className="news-intro">تابعوا أخبار الأكاديمية وبرامجها الرياضية والمجتمعية وأنشطتها في خدمة الأطفال.</p></div></section><section><div className="wrap"><div className="news-grid"><article className="news-card"><div className="news-art"><span>⚽</span></div><div className="news-content"><div className="news-meta"><span>التدريب الرياضي</span></div><h2>برامج الجمباز والباركور والكاراتيه</h2><p>قدمت الأكاديمية للأطفال تدريبات في الجمباز والباركور والكاراتيه ضمن مسيرتها الرياضية في الشيخ رضوان.</p><a className="read-more" href="news-1.html">اقرأ التفاصيل <span>←</span></a></div></article><article className="news-card"><div className="news-art"><span>⌖</span></div><div className="news-content"><div className="news-meta"><span>الأنشطة الميدانية</span></div><h2>التدريب الميداني واستمرار الأنشطة</h2><p>كيّفت الأكاديمية أنشطتها خلال الحرب، وواصلت الوصول إلى الأطفال عبر التدريب الميداني في الأماكن المتاحة.</p><a className="read-more" href="news-2.html">اقرأ التفاصيل <span>←</span></a></div></article><article className="news-card"><div className="news-art"><img src="images/activity-01.jpg" alt="لاعبو الأكاديمية في صالة التدريب" loading="lazy" /></div><div className="news-content"><div className="news-meta"><span>٢٠١٩</span><span>مسيرة الأكاديمية</span></div><h2>انطلاق أكاديمية الاستقلال الرياضية</h2><p>بدأت الأكاديمية في الشيخ رضوان بغزة، ووضعت تنمية قدرات الأطفال ومواهبهم الرياضية في مقدمة أولوياتها.</p><a className="read-more" href="news-4.html">اقرأ التفاصيل <span>←</span></a></div></article>
<article className="news-card"><div className="news-art"><span>☺</span></div><div className="news-content"><div className="news-meta"><span>الدعم النفسي والترفيه</span></div><h2>فعاليات ترفيهية ودعم نفسي للأطفال</h2><p>تضمنت أنشطة الأكاديمية فعاليات ترفيهية ومجتمعية وفرت للأطفال فرصًا للعب والتفاعل والتعبير.</p><a className="read-more" href="news-3.html">اقرأ التفاصيل <span>←</span></a></div></article></div><ManagedContent type="news" locale="ar" className="news-grid" /></div></section></main>
      </>
    </SiteLayout>
  );
}
