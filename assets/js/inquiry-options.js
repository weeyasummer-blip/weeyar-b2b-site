document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#inquiry");
  if (!form) return;
  const details = form.querySelector("#contact-details");
  const product = form.querySelector("#contact-product");
  const hint = form.querySelector("#request-choice-status");

  // Only update the site's automatic contact messages; keep hand-written links intact.
  const mailLinks = [...document.querySelectorAll('a[href="mailto:supplements@weeyar.com"]')];
  const whatsappLinks = [...document.querySelectorAll('a[href^="https://wa.me/8613802837662"]')].filter(link => {
    const text = new URL(link.href).searchParams.get("text") || "";
    return !text || text.startsWith("Hello Weeyar, I found you through weeyar.com.") ||
      (text.startsWith("Hello Weeyar, I am interested in ") && text.includes("\nProduct page: " + location.href));
  });
  function syncContactMessages() {
    const selectedProduct = product ? product.value.trim() : "";
    const request = details ? details.value.trim() : "";
    const market = form.querySelector("#contact-market");
    const quantity = form.querySelector("#contact-quantity");
    const message = (selectedProduct ? "Hello Weeyar, I am interested in " + selectedProduct + "." : "Hello Weeyar, I found you through weeyar.com.") +
      "\n" + (request || "Please send quotation, MOQ and sample options.") +
      (market && market.value.trim() ? "\nDestination country / market: " + market.value.trim() : "") +
      (quantity && quantity.value.trim() ? "\nEstimated quantity: " + quantity.value.trim() : "");
    mailLinks.forEach(link => {
      link.href = "mailto:supplements@weeyar.com?subject=" +
        encodeURIComponent(selectedProduct ? "Product inquiry: " + selectedProduct.replace(/[\r\n]/g, " ") : "Supplement project inquiry") +
        "&body=" + encodeURIComponent(message);
    });
    whatsappLinks.forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set("text", message);
      link.href = url.toString();
    });
  }
  syncContactMessages();
  form.addEventListener("input", syncContactMessages);
  form.addEventListener("reset", () => window.setTimeout(syncContactMessages, 0));

  let lastSuggestion = "";
  const requests = {
    quote: "Please send a quotation and available packaging options.",
    sample: "I would like to request samples. Please confirm sample charges and shipping.\nDestination country / postal code: ",
    label: "I am interested in private-label options. Please send packaging and sample options."
  };
  form.querySelectorAll("[data-request-choice]").forEach(button => {
    button.addEventListener("click", () => {
      const suggestion = (product && product.value ? "Product: " + product.value + "\n" : "") + requests[button.dataset.requestChoice];
      if (!details.value.trim() || details.value === lastSuggestion) {
        details.value = suggestion;
        lastSuggestion = suggestion;
        hint.textContent = "A starting message has been added. You can edit it before sending.";
      } else {
        hint.textContent = "Your message has been kept. Add any extra requirements before sending.";
      }
      syncContactMessages();
      details.focus();
    });
  });
  let started = false;
  form.addEventListener("input", () => {
    if (started) return;
    started = true;
    try { if (window.gtag) window.gtag("event", "inquiry_form_start", {form_name: "contact_inquiry", packaging_type: details && details.value.startsWith("Packaging interest:") ? new URLSearchParams(location.search).get("packaging") : "not_selected"}); } catch {}
  });
});
