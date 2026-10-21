"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";

const sections = [
  { id: "partners", label: "المؤسسات والشركاء", icon: "◇" },
  { id: "activities", label: "الأنشطة والفعاليات", icon: "✳" },
  { id: "programs", label: "البرامج", icon: "▦" },
  { id: "projects", label: "البرامج المستقبلية", icon: "↗" },
  { id: "players", label: "اللاعبون المميزون", icon: "◎" },
  { id: "team", label: "فريقنا", icon: "♙" },
  { id: "news", label: "الأخبار", icon: "▤" },
  { id: "settings", label: "روابط التواصل", icon: "◎" },
];

const emptyForm = (type) => ({
  type, slug: "", name: "", logoImage: "", cardImage: "", title: "", subtitle: "", content: "",
  date: "", category: "", sport: "", playingPeriod: "", gallery: [], hashtags: [],
  socialLinks: { facebook: "", instagram: "", tiktok: "", youtube: "", twitter: "" },
});

const fieldsByType = {
  partners: ["name", "slug", "logoImage", "title", "subtitle", "content", "gallery", "hashtags"],
  activities: ["slug", "cardImage", "title", "subtitle", "date", "content", "gallery", "hashtags"],
  programs: ["slug", "category", "cardImage", "title", "subtitle", "date", "content", "gallery", "hashtags"],
  projects: ["slug", "category", "cardImage", "title", "subtitle", "date", "content", "gallery", "hashtags"],
  players: ["slug", "cardImage", "name", "sport", "playingPeriod"],
  team: ["cardImage", "name", "title", "content"],
  news: ["slug", "cardImage", "title", "subtitle", "date", "category", "content", "hashtags"],
  settings: ["socialLinks"],
};

const labels = {
  slug: "رابط الصفحة المختصر (اختياري)", name: "الاسم", logoImage: "شعار المؤسسة", cardImage: "صورة البطاقة",
  title: "العنوان الرئيسي", subtitle: "العنوان الفرعي", content: "التفاصيل / المحتوى", date: "التاريخ",
  category: "التصنيف", sport: "الرياضة", playingPeriod: "فترة اللعب", gallery: "معرض الصور", hashtags: "الهاشتاغات",
};
const englishLabels = {
  name: "Name (English)", title: "Main title (English)", subtitle: "Subtitle (English)",
  content: "Details / content (English)", category: "Category (English)", sport: "Sport (English)",
  playingPeriod: "Playing period (English)", hashtags: "Hashtags (English)",
};
const localizedFields = new Set(["name", "title", "subtitle", "content", "category", "sport", "playingPeriod", "hashtags"]);

const summaryOf = (item) => item.name || item.title || item.nameEn || item.titleEn || "عنصر بدون عنوان";
const initialFor = (section) => ({
  partners: { title: "المؤسسات والشركاء", subtitle: "إدارة الجهات التي تعاونت معها الأكاديمية." },
  activities: { title: "الأنشطة والفعاليات", subtitle: "وثّق فعاليات الأكاديمية وصورها." },
  programs: { title: "البرامج", subtitle: "إدارة البرامج حسب تصنيفات الأكاديمية." },
  projects: { title: "البرامج المستقبلية", subtitle: "إدارة المبادرات والمشاريع المخطط لها." },
  players: { title: "اللاعبون المميزون", subtitle: "عرض قصص اللاعبين وفترات مشاركتهم." },
  team: { title: "فريقنا", subtitle: "أضف أعضاء الفريق بصورهم وأسمائهم ومناصبهم ونبذة عنهم." },
  news: { title: "الأخبار", subtitle: "إدارة أخبار الأكاديمية ومحتواها." },
  settings: { title: "روابط التواصل الاجتماعي", subtitle: "حدّث الروابط التي تظهر كأيقونات في فوتر الموقع." },
}[section]);

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordValues, setPasswordValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [section, setSection] = useState("partners");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const sectionInfo = useMemo(() => initialFor(section), [section]);
  const api = useCallback(async (url, options = {}) => {
    const response = await fetch(url, { credentials: "same-origin", ...options });
    if (!response.ok) {
      if (response.status === 401) setAuthenticated(false);
      let message = "حدث خطأ أثناء الاتصال بالخادم.";
      try {
        const payload = await response.json();
        message = payload.message || payload.title || Object.values(payload.errors || {}).flat().join(" ") || message;
      } catch {}
      throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
  }, []);

  const loadItems = useCallback(async (type = section) => {
    setError("");
    setItems([]);
    try { setItems(await api(`/api/admin/content?type=${type}`)); }
    catch (exception) {
      setItems([]);
      const apiNeedsRestart = type === "team" && exception.message.includes("نوع المحتوى غير صالح");
      setError(apiNeedsRestart
        ? "خادم الـAPI الحالي لا يتعرف على قسم فريقنا بعد. أوقف خادم Academy.Api وشغّله مجددًا ليقرأ التعديل الجديد."
        : exception.message);
    }
  }, [api, section]);

  useEffect(() => {
    api("/api/admin/session").then(() => setAuthenticated(true)).catch(() => {}).finally(() => setChecking(false));
  }, [api]);

  useEffect(() => { if (authenticated) loadItems(section); }, [authenticated, section, loadItems]);

  async function logIn(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await api("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      setAuthenticated(true); setPassword(""); setNotice("مرحبًا بك في لوحة التحكم.");
    } catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  }

  async function logOut() {
    try { await api("/api/admin/session", { method: "DELETE" }); } catch {}
    setAuthenticated(false); setItems([]); setNotice("");
  }

  async function changePassword(event) {
    event.preventDefault();
    setError(""); setNotice("");
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setError("تأكيد كلمة المرور الجديدة غير مطابق.");
      return;
    }
    if (passwordValues.newPassword.length < 8) {
      setError("يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل.");
      return;
    }
    setBusy(true);
    try {
      await api("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwordValues.currentPassword, newPassword: passwordValues.newPassword }),
      });
      setPasswordDialog(false);
      setPasswordValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setNotice("تم تغيير كلمة المرور. استخدم الجديدة في تسجيل الدخول القادم.");
    } catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  }

  function openNew() { setError(""); setNotice(""); setForm(emptyForm(section)); }
  function openEdit(item) {
    setError(""); setNotice("");
    let socialLinks = emptyForm("settings").socialLinks;
    if (item.type === "settings") {
      try { socialLinks = { ...socialLinks, ...JSON.parse(item.content || "{}") }; } catch {}
    }
    setForm({ ...item, socialLinks, gallery: item.gallery || [], hashtags: item.hashtags || [], hashtagsEn: item.hashtagsEn || [] });
  }
  function setValue(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  function makeSlug(source) {
    const slug = source.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return slug || `content-${Date.now()}`;
  }

  async function upload(file) {
    return api(`/api/admin/uploads?name=${encodeURIComponent(file.name)}`, {
      method: "POST", headers: { "Content-Type": file.type }, body: file,
    });
  }

  async function submitForm(event) {
    event.preventDefault(); if (!form) return;
    // Keep a reference before the first await: React clears currentTarget after
    // the submit handler returns control to the browser event loop.
    const formElement = event.currentTarget;
    setBusy(true); setError(""); setNotice("");
    try {
      const payload = { ...form };
      if (section === "settings") {
        payload.slug = "social-links";
        payload.name = "روابط التواصل الاجتماعي";
        payload.nameEn = "Social media links";
        payload.content = JSON.stringify(form.socialLinks || {});
        delete payload.socialLinks;
      }
      if (!payload.slug) payload.slug = makeSlug(section === "team" ? payload.nameEn : payload.titleEn || payload.nameEn);
      const pathKey = section === "partners" ? "logoImage" : "cardImage";
      const mainFile = formElement.elements.namedItem("mainImage")?.files?.[0];
      if (mainFile) payload[pathKey] = (await upload(mainFile)).url;
      const galleryFiles = [...(formElement.elements.namedItem("galleryFiles")?.files || [])];
      if (galleryFiles.length) {
        const uploaded = await Promise.all(galleryFiles.map(upload));
        payload.gallery = [...(payload.gallery || []), ...uploaded.map((result) => result.url)];
      }
      payload.hashtags = typeof payload.hashtags === "string"
        ? payload.hashtags.split(/[\s,،]+/).map((tag) => tag.replace(/^#/, "")).filter(Boolean)
        : payload.hashtags;
      payload.hashtagsEn = typeof payload.hashtagsEn === "string"
        ? payload.hashtagsEn.split(/[\s,،]+/).map((tag) => tag.replace(/^#/, "")).filter(Boolean)
        : payload.hashtagsEn;
      const editing = Boolean(form.id);
      await api(editing ? `/api/admin/content/${form.id}` : "/api/admin/content", {
        method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      setForm(null); setNotice(editing ? "تم حفظ التعديلات." : "تمت إضافة المحتوى."); await loadItems();
    } catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  }

  async function deleteItem(item) {
    if (!window.confirm(`هل تريد حذف «${summaryOf(item)}»؟`)) return;
    setError("");
    try { await api(`/api/admin/content/${item.id}`, { method: "DELETE" }); setNotice("تم حذف المحتوى."); await loadItems(); }
    catch (exception) { setError(exception.message); }
  }

  if (checking) return <main className={styles.boot}><span className={styles.spinner} /> جارٍ الاتصال بلوحة التحكم…</main>;
  if (!authenticated) return <main className={styles.loginPage} dir="rtl">
    <form className={styles.loginCard} onSubmit={logIn}>
      <a className={styles.brand} href="/index.html"><span className={styles.brandMark}>ا</span><span>أكاديمية الاستقلال الرياضية<small>إدارة المحتوى</small></span></a>
      <span className={styles.kicker}>لوحة الإدارة</span><h1>تسجيل الدخول</h1><p>أدخل كلمة المرور الإدارية للمتابعة.</p>
      {error && <div className={styles.error} role="alert">{error}</div>}
      <label>كلمة المرور<input autoFocus type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      <button className={styles.primary} disabled={busy}>{busy ? "جارٍ الدخول…" : "دخول آمن"}<span>←</span></button>
      <a className={styles.backLink} href="/index.html">العودة إلى الموقع</a>
    </form>
  </main>;

  return <main className={styles.dashboard} dir="rtl">
    <aside className={styles.sidebar}>
      <a className={styles.brand} href="/index.html"><span className={styles.brandMark}>ا</span><span>أكاديمية الاستقلال الرياضية<small>إدارة المحتوى</small></span></a>
      <div className={styles.sideLabel}>إدارة الموقع</div>
      <nav className={styles.navigation} aria-label="أقسام إدارة المحتوى">
        {sections.map((entry) => <button key={entry.id} className={`${styles.navItem} ${section === entry.id ? styles.active : ""}`} onClick={() => { setSection(entry.id); setForm(null); setNotice(""); setError(""); }}><span>{entry.icon}</span>{entry.label}<b>{section === entry.id ? items.length : ""}</b></button>)}
      </nav>
      <div className={styles.sideFoot}><span className={styles.avatar}>م</span><span>مدير الموقع<small>مسجّل الدخول</small></span><button onClick={logOut} title="تسجيل الخروج" aria-label="تسجيل الخروج">↗</button></div>
    </aside>
    <section className={styles.mainArea}>
      <header className={styles.topbar}><span>لوحة الإدارة <i>/</i> {sectionInfo.title}</span><div><button className={styles.topAction} onClick={() => { setError(""); setNotice(""); setPasswordDialog(true); }}>تغيير كلمة المرور</button><button className={styles.topLogout} onClick={logOut}>تسجيل الخروج</button><a href="/index.html" target="_blank" rel="noreferrer">معاينة الموقع <span>↗</span></a></div></header>
      <div className={styles.content}>
        <div className={styles.headingRow}><div><span className={styles.kicker}>إدارة المحتوى</span><h1>{sectionInfo.title}</h1><p>{sectionInfo.subtitle}</p></div><button className={styles.primary} onClick={() => section === "settings" && items[0] ? openEdit(items[0]) : openNew()}>＋ <span>{section === "settings" && items.length ? "تعديل الروابط" : "إضافة جديد"}</span></button></div>
        {notice && <div className={styles.success} role="status">✓ {notice}</div>}
        {error && <div className={styles.error} role="alert">{error}</div>}
        <div className={styles.stats}><div><span>إجمالي العناصر</span><b>{items.length}</b><small>في هذا القسم</small></div><div><span>حالة الخدمة</span><b className={styles.online}><i /> متصلة</b><small>قاعدة البيانات تعمل</small></div><div><span>آخر تحديث</span><b>{items[0] ? new Date(items[0].updatedAt).toLocaleDateString("ar-PS") : "—"}</b><small>أحدث محتوى محفوظ</small></div></div>
        <div className={styles.tableHead}><div><h2>المحتوى المنشور</h2><span>{items.length} عنصر</span></div><button onClick={() => loadItems()} aria-label="تحديث القائمة">⟳</button></div>
        <div className={styles.tableWrap}>
          {items.length ? <table><thead><tr><th>العنصر</th><th>التصنيف / التفاصيل</th><th>التاريخ</th><th>آخر تعديل</th><th><span className={styles.srOnly}>إجراءات</span></th></tr></thead><tbody>
            {items.map((item) => <tr key={item.id}><td><div className={styles.itemCell}>{(item.logoImage || item.cardImage) ? <img src={item.logoImage || item.cardImage} alt="" /> : <span className={styles.placeholder}>{(item.name || item.title || "؟").slice(0, 1)}</span>}<span><b>{summaryOf(item)}</b><small>/{item.slug}</small></span></div></td><td>{item.category || item.sport || item.subtitle || (section === "team" ? item.title : "") || "—"}</td><td>{item.date || item.playingPeriod || "—"}</td><td>{new Date(item.updatedAt).toLocaleDateString("ar-PS")}</td><td><div className={styles.rowActions}><button onClick={() => openEdit(item)}>تعديل</button><button className={styles.delete} onClick={() => deleteItem(item)}>حذف</button></div></td></tr>)}
          </tbody></table> : <div className={styles.empty}><span>▤</span><b>لا يوجد محتوى في هذا القسم بعد</b><p>أضف أول عنصر ليظهر هنا في لوحة التحكم.</p><button className={styles.primary} onClick={openNew}>＋ إضافة محتوى</button></div>}
        </div>
        <p className={styles.privacyNote}>تُحفظ الصور في خادم الأكاديمية، وتُخزن بيانات المحتوى في قاعدة SQLite.</p>
      </div>
    </section>

    {form && <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setForm(null); }}>
      <form className={styles.editor} onSubmit={submitForm}>
        <header><div><span className={styles.kicker}>{form.id ? "تعديل المحتوى" : "محتوى جديد"}</span><h2>{form.id ? "تحديث العنصر" : `إضافة إلى ${sectionInfo.title}`}</h2></div><button type="button" className={styles.close} onClick={() => setForm(null)} aria-label="إغلاق">×</button></header>
        <div className={styles.editorBody}>
          {fieldsByType[section].map((field) => {
            if (field === "socialLinks") {
              const platforms = [
                ["facebook", "رابط فيسبوك"], ["instagram", "رابط إنستغرام"], ["tiktok", "رابط تيكتوك"],
                ["youtube", "رابط يوتيوب"], ["twitter", "رابط تويتر"],
              ];
              return <div className={`${styles.field} ${styles.full}`} key={field}><div className={styles.socialFields}>
                {platforms.map(([key, label]) => <label key={key}>{label}<input type="url" dir="ltr" placeholder="https://" value={form.socialLinks?.[key] || ""} onChange={(event) => setValue("socialLinks", { ...form.socialLinks, [key]: event.target.value })} /></label>)}
              </div><small>اترك الحقل فارغًا لإظهار الأيقونة دون رابط. تُفتح الروابط في نافذة جديدة.</small></div>;
            }
            if (field === "gallery") return <div className={styles.field} key={field}><label>{labels[field]}</label><input name="galleryFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple />{form.gallery?.length > 0 && <div className={styles.galleryPreview}>{form.gallery.map((url, index) => <div key={`${url}-${index}`}><img src={url} alt="" /><button type="button" onClick={() => setValue("gallery", form.gallery.filter((_, imageIndex) => imageIndex !== index))}>×</button></div>)}</div>}<small>يمكنك اختيار عدة صور دفعة واحدة. الحد الأقصى للصورة 10 ميغابايت.</small></div>;
            if (field === "logoImage" || field === "cardImage") return <div className={styles.field} key={field}><label>{section === "team" ? "صورة عضو الفريق" : labels[field]} <span>*</span></label><input name="mainImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />{form[field] && <div className={styles.imagePreview}><img src={form[field]} alt="معاينة الصورة الحالية" /><button type="button" onClick={() => setValue(field, "")}>إزالة الصورة</button></div>}<small>JPG أو PNG أو WEBP، حتى 10 ميغابايت.</small></div>;
            if (localizedFields.has(field)) {
              const isHashtags = field === "hashtags";
              const multiline = field === "content";
              const required = ["name", "title", "sport", "playingPeriod"].includes(field) || (["partners", "news", "team"].includes(section) && field === "content");
              const arabicLabel = section === "team" && field === "title" ? "المنصب" : section === "team" && field === "content" ? "نبذة تعريفية بسيطة" : labels[field];
              const englishLabel = section === "team" && field === "title" ? "Position (English)" : section === "team" && field === "content" ? "Short biography (English)" : englishLabels[field];
              const arabicValue = Array.isArray(form[field]) ? form[field].join("، ") : form[field] || "";
              const englishValue = Array.isArray(form[`${field}En`]) ? form[`${field}En`].join(", ") : form[`${field}En`] || "";
              const updateLocalized = (key, value) => {
                setValue(key, value);
                if (key === "nameEn" && section === "team" && !form.id && value.trim()) {
                  setValue("slug", makeSlug(value));
                } else if ((key === "titleEn" || key === "nameEn") && !form.id && !form.slug && value.trim()) {
                  setValue("slug", makeSlug(value));
                }
              };
              return <div className={`${styles.field} ${styles.full}`} key={field}><div className={styles.localizedPair}>
                <label>{arabicLabel} بالعربية{required && <span> *</span>}{multiline ? <textarea rows={5} dir="rtl" value={arabicValue} onChange={(event) => updateLocalized(field, event.target.value)} /> : <input dir="rtl" type="text" placeholder={isHashtags ? "طفولة، رياضة، غزة" : ""} value={arabicValue} onChange={(event) => updateLocalized(field, event.target.value)} />}</label>
                <label>{englishLabel}{required && <span> *</span>}{multiline ? <textarea rows={5} dir="ltr" value={englishValue} onChange={(event) => updateLocalized(`${field}En`, event.target.value)} /> : <input dir="ltr" type="text" placeholder={isHashtags ? "children, sports, Gaza" : ""} value={englishValue} onChange={(event) => updateLocalized(`${field}En`, event.target.value)} />}</label>
              </div></div>;
            }
            const multiline = field === "content";
            return <div className={`${styles.field} ${multiline ? styles.full : ""}`} key={field}><label htmlFor={`field-${field}`}>{labels[field]}{field === "date" ? <span> *</span> : null}</label>{multiline ? <textarea id={`field-${field}`} rows={5} value={form[field] || ""} onChange={(event) => setValue(field, event.target.value)} /> : <><input id={`field-${field}`} type={field === "date" ? "date" : "text"} placeholder={field === "slug" ? "مثال: academy-partnership-2026" : ""} value={form[field] || ""} onChange={(event) => setValue(field, event.target.value)} />{field === "slug" && <small>معرّف فريد يُستخدم في رابط صفحة المحتوى، ويُنشأ تلقائيًا من العنوان الإنجليزي إذا تركته فارغًا.</small>}</>}</div>;
          })}
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <footer><button type="button" className={styles.secondary} onClick={() => setForm(null)}>إلغاء</button><button disabled={busy} className={styles.primary}>{busy ? "جارٍ الحفظ…" : "حفظ المحتوى"} <span>←</span></button></footer>
      </form>
    </div>}

    {passwordDialog && <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPasswordDialog(false); }}>
      <form className={`${styles.editor} ${styles.passwordEditor}`} onSubmit={changePassword} aria-labelledby="change-password-title">
        <header><div><span className={styles.kicker}>إعدادات الحساب</span><h2 id="change-password-title">تغيير كلمة المرور</h2></div><button type="button" className={styles.close} onClick={() => setPasswordDialog(false)} aria-label="إغلاق">×</button></header>
        <div className={styles.editorBody}>
          <label className={styles.field}>كلمة المرور الحالية<input type="password" autoComplete="current-password" value={passwordValues.currentPassword} onChange={(event) => setPasswordValues((current) => ({ ...current, currentPassword: event.target.value }))} required /></label>
          <label className={styles.field}>كلمة المرور الجديدة<input type="password" autoComplete="new-password" minLength={8} maxLength={256} value={passwordValues.newPassword} onChange={(event) => setPasswordValues((current) => ({ ...current, newPassword: event.target.value }))} required /><small>8 أحرف على الأقل.</small></label>
          <label className={styles.field}>تأكيد كلمة المرور الجديدة<input type="password" autoComplete="new-password" minLength={8} maxLength={256} value={passwordValues.confirmPassword} onChange={(event) => setPasswordValues((current) => ({ ...current, confirmPassword: event.target.value }))} required /></label>
        </div>
        {error && <div className={styles.error} role="alert">{error}</div>}
        <footer><button type="button" className={styles.secondary} onClick={() => setPasswordDialog(false)}>إلغاء</button><button disabled={busy} className={styles.primary}>{busy ? "جارٍ الحفظ…" : "حفظ كلمة المرور"}</button></footer>
      </form>
    </div>}
  </main>;
}
