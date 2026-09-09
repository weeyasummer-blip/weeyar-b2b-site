"use client";

import { FormEvent, useState } from "react";

type FormProps = { initialProduct?: string; initialSource?: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function track(event: string, details: Record<string, string>) {
  const parameters = { site: "weeyarcosmetics", ...details };
  if (typeof window.gtag === "function") {
    window.gtag("event", event, parameters);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...parameters });
}

export function SourcingForm({ initialProduct = "", initialSource = "contact-page" }: FormProps) {
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const method = submitter?.value || "whatsapp";
    const product = String(data.get("product") || "");
    const lines = [
      "Hello Weeyar Cosmetics, I would like to request a wholesale quote.",
      "",
      `Name: ${data.get("name")}`,
      `Business email: ${data.get("email")}`,
      `Country / market: ${data.get("country")}`,
      `Company / website: ${data.get("company") || "Not provided"}`,
      `Product / category: ${product}`,
      `Target quantity & requirements: ${data.get("message")}`,
      "",
      "Sourcing route: Ready-stock personal care & skincare",
    ];
    const message = lines.join("\n");
    track("generate_lead", { method, source: initialSource, product: product || "general" });

    if (method === "email") {
      const subject = encodeURIComponent(`Ready-stock sourcing request${product ? ` — ${product}` : ""}`);
      window.location.href = `mailto:summer@weeyar.com?subject=${subject}&body=${encodeURIComponent(message)}`;
      setStatus("Your email app is opening with the sourcing brief prepared.");
    } else {
      window.open(`https://wa.me/8613802837662?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      setStatus("WhatsApp is opening with your sourcing brief prepared.");
    }
  }

  return <form className="sourcing-form" onSubmit={submit}>
    <label>Your name<input name="name" autoComplete="name" placeholder="Your name" required/></label>
    <label>Business email<input name="email" type="email" autoComplete="email" placeholder="name@company.com" required/></label>
    <label>Country / market<input name="country" autoComplete="country-name" placeholder="Where will you sell?" required/></label>
    <label>Company / website <i>Optional</i><input name="company" placeholder="Company name or website"/></label>
    <label className="wide">Product / category<input name="product" defaultValue={initialProduct} placeholder="Product link, category or ingredient" required/></label>
    <label className="wide">Target quantity & requirements<textarea name="message" placeholder="Quantity, packaging, target date and anything else we should know..." required/></label>
    <div className="wide form-actions">
      <button className="button" type="submit" name="method" value="whatsapp">Send via WhatsApp →</button>
      <button className="email-button" type="submit" name="method" value="email">Send by Email ↗</button>
    </div>
    <small className="wide form-note">Your details are placed into a message for you to review before sending. We normally reply within one business day.</small>
    {status && <p className="wide form-status" role="status">✓ {status}</p>}
  </form>;
}
