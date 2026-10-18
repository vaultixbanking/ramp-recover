import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import ContactDock from "@/app/components/ContactDock";
import { CONTACT, liveChatEnabled } from "@/app/config/contact";
import { HOME_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, pageMetadata } from "@/app/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site-wide defaults; each page adds its own title, canonical link and preview tags (see config/site.ts).
export const metadata: Metadata = {
  ...pageMetadata({ title: HOME_TITLE, description: SITE_DESCRIPTION, path: "/" }),
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  // Not inherited: a page without its own canonical link must not claim to be the home page.
  alternates: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ContactDock />
        {liveChatEnabled && (
          <Script id="smartsupp-live-chat" strategy="afterInteractive">
            {`
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = ${JSON.stringify(CONTACT.smartsuppKey)};
              window.smartsupp || (function(d) {
                var s, c, o = smartsupp = function() { o._.push(arguments); };
                o._ = [];
                s = d.getElementsByTagName('script')[0];
                c = d.createElement('script');
                c.type = 'text/javascript';
                c.charset = 'utf-8';
                c.async = true;
                c.src = 'https://www.smartsuppchat.com/loader.js?';
                s.parentNode.insertBefore(c, s);
              })(document);
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
