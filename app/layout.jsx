import "./globals.css";

export const metadata = {
  title: "أكاديمية الاستقلال الرياضية",
  description: "أكاديمية الاستقلال الرياضية — نحو بيئة متكاملة لتنمية الطفل ورعاية موهبته.",
};

export default function RootLayout({ children }) {
  return <html lang="ar" dir="rtl"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>;
}
