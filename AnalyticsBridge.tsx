"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendEvent(event: string, parameters: Record<string, string>) {
  if (typeof window.gtag === "function") {
    window.gtag("event", event, parameters);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...parameters });
}

export function AnalyticsBridge(){
  useEffect(()=>{
    const handleClick=(event:MouseEvent)=>{
      const target=event.target as Element | null;
      const anchor=target?.closest("a") as HTMLAnchorElement | null;
      if(!anchor) return;
      const href=anchor.getAttribute("href")||"";
      let eventName=anchor.dataset.event||"";
      if(!eventName&&href.startsWith("/contact")) eventName="quote_click";
      if(!eventName&&(href.includes("wa.me")||href.includes("api.whatsapp.com"))) eventName="whatsapp_click";
      if(!eventName&&href.startsWith("mailto:")) eventName="email_click";
      if(!eventName) return;
      sendEvent(eventName, {
        site: "weeyarcosmetics",
        source: anchor.dataset.source || window.location.pathname,
        product: anchor.dataset.product || "general",
        link_url: anchor.href,
      });
    };
    document.addEventListener("click",handleClick);
    return()=>document.removeEventListener("click",handleClick);
  },[]);
  return null;
}
