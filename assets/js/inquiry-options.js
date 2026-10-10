document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#inquiry");
  if (!form) return;
  const details = form.querySelector("#contact-details");
  const product = form.querySelector("#contact-product");
  const hint = form.querySelector("#request-choice-status");

  // Keep alternate contact methods aligned with the product shown in the form.
  const selectedProduct = product ? product.value.trim() : "";
  if (selectedProduct) {
    const message = "Hello Weeyar, I am interested in " + selectedProduct +
      ".\nPlease send quotation, MOQ and sample options.\n\nDestination country:\nEstimated quantity:";
    document.querySelectorAll('a[href="mailto:supplements@weeyar.com"]').forEach(link => {
      link.href = "mailto:supplements@weeyar.com?subject=" +
        encodeURIComponent("Product inquiry: " + selectedProduct.replace(/[\r\n]/g, " ")) +
        "&body=" + encodeURIComponent(message);
    });
    document.querySelectorAll('a[href^="https://wa.me/8613802837662"]').forEach(link => {
      const url = new URL(link.href);
      const existing = url.searchParams.get("text") || "";
      if (!existing || existing.startsWith("Hello Weeyar, I found you through weeyar.com.")) {
        url.searchParams.set("text", message);
        link.href = url.toString();
      }
    });
  }

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
      details.focus();
    });
  });
  let started = false;
  form.addEventListener("input", () => {
    if (started) return;
    started = true;
    try { if (window.gtag) window.gtag("event", "inquiry_form_start", {form_name: "contact_inquiry"}); } catch {}
  });
});
