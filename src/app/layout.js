import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

export const metadata = {
  metadataBase: new URL("https://yourtyping.com"),
  title: {
    default: "YourTyping — Free Typing Speed Test & WPM Test",
    template: "%s | YourTyping",
  },
  description:
    "Test your typing speed for free. Check your WPM and accuracy, play typing games, track your progress, and climb the leaderboard.",
  keywords: [
    "typing speed test",
    "wpm test",
    "typing test",
    "free typing test",
    "words per minute test",
    "typing practice",
    "typing games",
  ],
  alternates: {
    canonical: "https://yourtyping.com",
  },
  openGraph: {
    type: "website",
    url: "https://yourtyping.com",
    title: "YourTyping — Free Typing Speed Test & WPM Test",
    description:
      "Test your typing speed for free. Check your WPM and accuracy, play typing games, track your progress, and climb the leaderboard.",
    siteName: "YourTyping",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YourTyping - Free Online Typing Speed Test",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourTyping — Free Typing Speed Test & WPM Test",
    description:
      "Test your typing speed for free. Check your WPM and accuracy, play typing games, track your progress, and climb the leaderboard.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "PASTE_GOOGLE_SEARCH_CONSOLE_CODE_HERE",
  },
};

export default function RootLayout({ children }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('yourtyping-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {adsenseClient && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        {gaId && (
          <>
            <Script
              async
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className="min-h-screen"
        style={{ background: "var(--bg-page)", color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <StructuredData />
        <AuthProvider>
          <Nav />
          <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
