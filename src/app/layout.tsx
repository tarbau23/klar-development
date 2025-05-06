import "./globals.css";

import { Suspense, useEffect } from "react";
import type { Metadata } from "next";
import Head from "next/head";

import { LanguageProvider } from "@/context/languageContext";
import { MessageProvider } from "@/context/messagesContext";

import Header from "@/components/header";
import Footer from "@/components/footer";

import Analytics from "@/lib/analytics";

export const metadata: Metadata = {
  title: "klar-",
  description: "Next Gen GPT",
};

const GA_TRACKING_ID = "G-CBG8HHMXJZ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`antialiased bg-background`}>
        <Suspense>
          <Analytics />
          <LanguageProvider>
            <MessageProvider>
              <Header />
              <div className="pb-[60px]">
              {children}
              </div>
              <Footer />
            </MessageProvider>
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
