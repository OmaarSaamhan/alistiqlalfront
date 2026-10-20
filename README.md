# أكاديمية الاستقلال الرياضية — Next.js

أُعيد بناء صفحات الموقع الـ44 داخل Next.js App Router مع مكوّنات React مشتركة. الترويسة والتذييل والتنقل بين اللغتين ومعرض الصور وشريط الشركاء عناصر مشتركة، وتُحفظ عناوين الصفحات الحالية التي تنتهي بـ`.html`. الصفحات الأساسية موجودة في `app/pages/`، ومحتوى الأخبار والفعاليات والشركاء في `data/`، والتنسيقات العامة في `app/globals.css` والتنسيقات الخاصة بمجموعات الصفحات في `public/styles/pages/`. ملفات HTML القديمة داخل `outputs/` محفوظة كنسخ مرجعية فقط؛ التطبيق لا يقرأها وقت التشغيل.

## التشغيل محليًا

ثبّت Node.js إصدار LTS، ثم افتح Terminal داخل مجلد المشروع وشغّل:

```bash
npm install
npm run dev
```

افتح `http://localhost:3000`. لإيقاف الخادم اضغط `Ctrl + C` في Terminal. لبناء نسخة الإنتاج استخدم `npm run build` ثم `npm start`.
# Local development

```bash
npm install
npm run dev
```

The original HTML pages are retained in `outputs/` as the visual/content reference. The App Router preserves their `.html` addresses.

## Structure

- `app/[[...slug]]/page.jsx` resolves the retained page URLs, metadata and data-driven detail templates.
- `app/components/layout/` contains the shared header, footer and page shell.
- `app/components/ui/` contains small interactive client components.
- `app/components/content/` contains reusable templates for news articles, events and partners.
- `data/` contains page metadata and bilingual article, event and partner content.
- `public/styles/pages/` contains route-scoped visual styles. The shell loads only the style group needed by the current page.
- `public/images/` contains the original images and logos.
- `work/reference-originals/outputs/` is a frozen copy of the original HTML files for visual and content comparison.

Set `NEXT_PUBLIC_SITE_URL` to the production origin before deploying so the sitemap and robots metadata use the public host. It defaults to `http://localhost:3000` for local development.

## لوحة الإدارة وواجهة ASP.NET Core 10

المشروع يتضمن الآن لوحة تحكم عربية على `/admin` وواجهة API مستقلة في `server/Academy.Api`. تحفظ سجلات المحتوى في SQLite داخل `server/Academy.Api/App_Data/academy.db`، وتحفظ الصور المرفوعة في `server/Academy.Api/wwwroot/uploads/`. تُنشأ قاعدة البيانات عند أول تشغيل. الأنواع المدعومة: المؤسسات والشركاء، الأنشطة والفعاليات، البرامج، البرامج المستقبلية، اللاعبون المميزون، والأخبار. الصور تقبل JPG وPNG وWEBP وGIF حتى 10 ميغابايت للصورة.

### تشغيل لوحة الإدارة محليًا

افتح نافذتي Terminal من مجلد المشروع. في النافذة الأولى شغّل الواجهة الخلفية مع كلمة مرور خاصة بك:

```bash
ADMIN_PASSWORD='ضع-كلمة-مرور-قوية-هنا' WEB_ORIGIN='http://localhost:3000' dotnet run --project server/Academy.Api
```

في النافذة الثانية:

```bash
npm run dev
```

افتح `http://localhost:3000/admin` وسجّل الدخول بكلمة المرور التي وضعتها في `ADMIN_PASSWORD`. لا تضع كلمة المرور في ملفات المشروع أو في `next.config.mjs`. تبقى قاعدة البيانات وملفات الصور في مجلد مشروع الـAPI بعد إيقاف الخوادم. روابط API المحلية تمر عبر Next.js، وواجهة الإدارة تعتمد على تشغيل الخادمين معًا.

نقاط API العامة: `GET /api/content/{type}` و`GET /api/content/{type}/{slug}`. عمليات الإدارة تتطلب جلسة دخول، وتُتاح عبر `/api/admin/session`, `/api/admin/content`, و`/api/admin/uploads`.
