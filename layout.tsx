import type { Metadata } from "next";
import Script from "next/script";
import { WhatsAppFloat } from "../components/WhatsAppFloat";
import { AnalyticsBridge } from "../components/AnalyticsBridge";
import { SITE_URL } from "../lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Weeyar Cosmetics | Ready-Stock Personal Care & Skincare", template: "%s | Weeyar Cosmetics" },
  description: "Ready-stock personal care and skincare supply with low MOQs, mixed trial orders and fast dispatch.",
  icons:{icon:"/favicon.svg"},
  openGraph:{title:"Weeyar Cosmetics | Ready-Stock Personal Care & Skincare",description:"Market-ready personal care and skincare with a 30-piece mixed MOQ and only 3 pieces per SKU.",type:"website"},
  twitter:{card:"summary",title:"Weeyar Cosmetics | Ready-Stock Personal Care & Skincare",description:"Market-ready personal care and skincare with flexible mixed trial orders."},
};
const GA_MEASUREMENT_ID = "G-WVPMDYXWXD";

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en">
    <body>
      {children}
      <AnalyticsBridge/>
      <WhatsAppFloat />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });`}
      </Script>
    </body>
  </html>
}
