import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "YourTyping — Free Typing Speed Test & WPM Test",
  description:
    "Test your typing speed for free. Check your WPM and accuracy, play typing games, track your progress, and climb the leaderboard.",
};

export default function RootLayout({ children }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
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
      </head>
      <body
        className="min-h-screen"
        style={{ background: "var(--bg-page)", color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <AuthProvider>
          <Nav />
          <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
