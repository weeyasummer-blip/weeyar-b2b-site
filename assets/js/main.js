const attributionKey = "weeyar_first_visit_v1";
let memory = null;
function captureAttribution() {
  if (typeof window === "undefined") return null;
  try {
    const saved = JSON.parse(
      window.sessionStorage.getItem(attributionKey) || "null",
    );
    if (
      saved &&
      typeof saved.source === "string" &&
      typeof saved.landingPage === "string"
    )
      memory = saved;
  } catch (_) {}
  if (memory) return memory;
  const url = new URL(window.location.href);
  let referrer = "";
  try {
    const ref = new URL(document.referrer);
    if (ref.origin !== url.origin) referrer = ref.origin + ref.pathname;
  } catch (_) {}
  memory = {
    source:
      url.searchParams.get("utm_source") ||
      (referrer ? "external_referral" : "direct_or_unknown"),
    medium:
      url.searchParams.get("utm_medium") || (referrer ? "referral" : "none"),
    campaign: url.searchParams.get("utm_campaign") || "none",
    content: url.searchParams.get("utm_content") || "none",
    term: url.searchParams.get("utm_term") || "none",
    landingPage: url.origin + url.pathname,
    referrer: referrer || "Direct / unavailable",
  };
  try {
    window.sessionStorage.setItem(attributionKey, JSON.stringify(memory));
  } catch (_) {}
  return memory;
}

(() => {
  const measurementId = "G-H3QXK4X1K4";
  const testSetting = new URLSearchParams(window.location.search).get(
    "weeyar_test",
  );
  let storedTest = false;
  try {
    if (testSetting === "1") window.sessionStorage.setItem("weeyar_test", "1");
    if (testSetting === "0") window.sessionStorage.removeItem("weeyar_test");
    storedTest = window.sessionStorage.getItem("weeyar_test") === "1";
  } catch (_) {}
  window.weeyarTestMode =
    testSetting === "1" || (testSetting !== "0" && storedTest);
  window["ga-disable-" + measurementId] = window.weeyarTestMode;
  if (window.weeyarTestMode) {
    window.gtag = function () {};
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: true });

  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(analyticsScript);
})();

document.addEventListener("DOMContentLoaded", () => {
  // Keep the TikTok profile available in every footer that uses the shared site script.
  document
    .querySelectorAll(
      "footer .home-social, footer .about-social, footer .oem-social, footer .insights-social, footer .contact-social, footer .social-links",
    )
    .forEach((social) => {
      if (social.querySelector('a[href*="tiktok.com/"]')) return;
      const link = document.createElement("a");
      link.href = "https://www.tiktok.com/@weeyar.summer";
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", "TikTok");
      link.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 3v10.1a4.6 4.6 0 1 1-3.7-4.5v3.1a1.7 1.7 0 1 0 .7 1.4V3h3c.3 2.1 1.5 3.5 3.5 4.1v3.1a8.2 8.2 0 0 1-3.5-1.5V3Z"/></svg>';
      social.appendChild(link);
    });

  document.querySelectorAll("footer .nf-social").forEach((social) => {
    if (social.querySelector('a[href*="tiktok.com/"]')) return;
    const link = document.createElement("a");
    link.href = "https://www.tiktok.com/@weeyar.summer";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "TikTok";
    social.appendChild(link);
  });
  // Storage can be unavailable in restricted browser sessions; inquiries must still work.
  const memory = Object.create(null);
  const storage = {
    getItem(key) {
      try {
        return window.sessionStorage.getItem(key) || memory[key] || null;
      } catch (_) {
        return memory[key] || null;
      }
    },
    setItem(key, value) {
      memory[key] = String(value);
      try {
        window.sessionStorage.setItem(key, value);
      } catch (_) {}
    },
    removeItem(key) {
      delete memory[key];
      try {
        window.sessionStorage.removeItem(key);
      } catch (_) {}
    },
  };
  if (window.weeyarTestMode) {
    const banner = document.createElement("div");
    banner.setAttribute("role", "status");
    banner.style.cssText =
      "padding:12px 16px;background:#fff4cc;color:#312400;font:14px/1.5 Arial,sans-serif;overflow-wrap:anywhere";
    banner.textContent =
      "Test mode: analytics are disabled for this tab. Form submissions still send a real email marked TEST. ";
    const exit = document.createElement("a");
    const exitUrl = new URL(window.location.href);
    exitUrl.searchParams.set("weeyar_test", "0");
    exit.href = exitUrl.href;
    exit.textContent = "Exit test mode";
    exit.style.cssText =
      "color:#312400;text-decoration:underline;font-weight:bold";
    banner.appendChild(exit);
    document.body.prepend(banner);
  }
  const menu = document.querySelector(".menu");
  const links = document.querySelector(".links");

  if (menu && links) {
    menu.addEventListener("click", () => links.classList.toggle("open"));
  }

  document.querySelectorAll(".filter[data-f]").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".product").forEach((card) => {
        card.style.display =
          button.dataset.f === "all" || card.dataset.c === button.dataset.f
            ? "block"
            : "none";
      });
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !window.gtag) return;

    const href = link.getAttribute("href") || "";
    const linkText = link.textContent.trim().replace(/\s+/g, " ").slice(0, 100);
    const clickedPackaging = new URL(link.href, location.href).searchParams.get("packaging");
    if (link.classList.contains("pkg-button") && Object.prototype.hasOwnProperty.call(packagingNames, clickedPackaging)) {
      try { window.gtag("event", "packaging_inquiry_click", {
        packaging_type: clickedPackaging,
        page_path: window.location.pathname
      }); } catch { /* Analytics must not prevent navigation. */ }
    }


    if (href.includes("tiktok.com/")) {
      window.gtag("event", "social_click", {
        platform: "tiktok",
        link_url: href,
        page_path: window.location.pathname,
      });
    } else if (href.includes("wa.me/")) {
      window.gtag("event", "whatsapp_click", {
        contact_method: "whatsapp",
        link_text: linkText,
        page_path: window.location.pathname,
      });
    } else if (href.startsWith("mailto:")) {
      window.gtag("event", "email_click", {
        contact_method: "email",
        link_text: linkText,
        page_path: window.location.pathname,
      });
    } else if (href.includes("Weeyar-B2B-Supplement-Buyer-Checklist.pdf")) {
      window.gtag("event", "checklist_download", {
        file_name: href.split("/").pop(),
        link_text: linkText,
        page_path: window.location.pathname,
      });
    } else if (href.includes("/downloads/") || href.endsWith(".pdf")) {
      window.gtag("event", "catalog_download", {
        file_name: href.split("/").pop(),
        link_text: linkText,
        page_path: window.location.pathname,
      });
    } else if (
      href.includes("product-detail.html") ||
      /(?:^|\/)products\//.test(href)
    ) {
      window.gtag("event", "product_detail_click", {
        link_text: linkText,
        link_url: href,
        page_path: window.location.pathname,
      });
    } else if (
      href.includes("/categories/") ||
      href.startsWith("categories/")
    ) {
      window.gtag("event", "product_category_click", {
        link_text: linkText,
        link_url: href,
        page_path: window.location.pathname,
      });
    } else if (
      /(?:^|\/)contact(?:\.html)?(?:[?#]|$)/.test(href) ||
      href === "#quote"
    ) {
      window.gtag("event", "quote_click", {
        link_text: linkText,
        page_path: window.location.pathname,
      });
    }
  });

  // Turn generic WhatsApp links into useful, page-aware conversations.
  // Existing product-specific messages are preserved.
  const pageProduct = document.querySelector(".pd-grid h1, .detail-copy h1");
  const requestedWhatsAppProduct = new URLSearchParams(
    window.location.search,
  ).get("product");
  const whatsappProduct =
    (pageProduct && pageProduct.textContent.trim()) || requestedWhatsAppProduct;
  const whatsappMessage = whatsappProduct
    ? `Hello Weeyar, I am interested in ${whatsappProduct}.\n\nTarget market:\nEstimated quantity:\nProject route: Ready stock / Private label / Custom formula\nPackaging or label needs:\n\nPlease send the current specification, MOQ, sample and quotation options.\nProduct page: ${window.location.href}`
    : "Hello Weeyar, I found you through weeyar.com.\n\nProduct or format:\nTarget market:\nEstimated quantity:\nPrivate label needed: Yes / No\n\nPlease recommend suitable supplement options.";
  document
    .querySelectorAll('a[href^="https://wa.me/8613802837662"]')
    .forEach((link) => {
      const url = new URL(link.href);
      if (url.searchParams.get("text")) return;
      url.searchParams.set("text", whatsappMessage);
      link.href = url.toString();
    });

  if (/^\/products\//.test(window.location.pathname) && pageProduct) {
    document.querySelectorAll(".pd-hero .actions, .pd-cta .container").forEach(
      (actionArea) => {
        if (actionArea.querySelector(".product-whatsapp")) return;
        const whatsapp = document.createElement("a");
        const whatsappUrl = new URL("https://wa.me/8613802837662");
        whatsappUrl.searchParams.set("text", whatsappMessage);
        whatsapp.href = whatsappUrl.toString();
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener";
        whatsapp.className = "btn product-whatsapp";
        whatsapp.textContent = "Ask on WhatsApp";
        whatsapp.style.borderColor = "#20b85a";
        whatsapp.style.color = "#15743b";
        whatsapp.style.background = "#fff";
        whatsapp.style.margin = "10px 0 0 10px";
        actionArea.appendChild(whatsapp);
      },
    );
  }

  const referenceFile = document.querySelector("#contact-file");
  const referenceFileName = document.querySelector("#contact-file-name");
  if (referenceFile && referenceFileName) {
    referenceFile.addEventListener("change", () => {
      referenceFileName.textContent =
        referenceFile.files && referenceFile.files[0]
          ? referenceFile.files[0].name
          : "No file selected";
    });
  }

  const attributionKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  const query = new URLSearchParams(window.location.search);
  const firstVisit = captureAttribution();
  if (query.get("utm_source"))
    attributionKeys.forEach((key) => storage.removeItem(key));
  if (!storage.getItem("entry_referrer"))
    storage.setItem("entry_referrer", document.referrer || "not_available");
  attributionKeys.forEach((key) => {
    const value = query.get(key);
    if (value) storage.setItem(key, value);
  });
  if (!storage.getItem("landing_page")) {
    storage.setItem("landing_page", window.location.href);
  }

  const productHeading = document.querySelector(".pd-grid h1, .detail-copy h1");
  if (/^\/products\//.test(window.location.pathname) && productHeading) {
    storage.setItem("source_product", productHeading.textContent.trim());
    storage.setItem("source_product_page", window.location.href);
    const categoryLabel = document.querySelector(
      ".pd-grid .badge, .detail-copy .eyebrow",
    );
    if (categoryLabel)
      storage.setItem(
        "source_product_category",
        categoryLabel.textContent.trim(),
      );
    else storage.removeItem("source_product_category");
  }
  const packagingNames = {"container-change":"Container change","label-only":"Label-only customization","capsule-bottle":"Capsule bottles","gummy-bottle":"Gummy bottles","powder-tub":"Powder tubs","stick-sachet":"Stick sachets","dropper-bottle":"Dropper bottles","paper-carton":"Paper cartons","gift-box":"Gift boxes","fitted-insert":"Fitted inserts"};
  const packagingProducts = {"creatine-gummies":"Creatine Gummies", "milk-thistle-drops":"Milk Thistle Herbal Drops"};
  // Accept the older product-name links as well as the current item links.
  const explicitPackagingItem = query.get("item");
  const namedPackagingItem = Object.keys(packagingProducts).find(item =>
    [packagingProducts[item], item, item === "milk-thistle-drops" ? "Milk Thistle Drops" : ""]
      .filter(Boolean).some(name => name.toLowerCase() === (query.get("product") || "").trim().toLowerCase())
  );
  const packagingItem = explicitPackagingItem || namedPackagingItem;
  const packagingProduct = Object.prototype.hasOwnProperty.call(packagingProducts, packagingItem) ? packagingProducts[packagingItem] : "";
  const packagingSource = packagingProduct ? "https://weeyar.com/products/" + packagingItem : "https://weeyar.com/oem#packaging-design";
  if (packagingProduct && document.querySelector(".pkg-showcase")) {
    const note = document.createElement("p");
    note.className = "packaging-product-context";
    note.textContent = "Packaging ideas for " + packagingProduct + ". New packaging is optional; you can also customize the existing bottle label from 500 bottles. ";
    const back = document.createElement("a");back.href = "/products/" + packagingItem;back.textContent = "Return to product";back.style.textDecoration="underline";note.append(back);
    const label = document.createElement("a");label.href="/contact?item="+packagingItem+"&packaging=label-only#quote";label.textContent="Discuss label-only customization";label.className="pkg-button";label.style.margin="12px 0";
    document.querySelector(".pkg-heading").append(note,label);
    document.querySelectorAll(".pkg-button").forEach(a=>{const url=new URL(a.href);url.searchParams.set("item",packagingItem);a.href=url.pathname+url.search+url.hash;});
  }
  const packagingKey = query.get("packaging");
  const selectedPackaging = Object.prototype.hasOwnProperty.call(packagingNames, packagingKey) ? packagingNames[packagingKey] : "";
  if (selectedPackaging) {
    storage.removeItem("source_product_category");
    storage.removeItem("documentation_request");
    storage.setItem("source_product", packagingProduct || "Supplement packaging project");
    storage.setItem("source_product_page", packagingSource);
  }
  const requestedProduct = selectedPackaging ? (packagingProduct || "Supplement packaging project") : query.get("product");
  const requestedCategory = query.get("category");
  const requestedDocumentation = query.get("request");
  if (requestedProduct) {
    if (requestedProduct !== storage.getItem("source_product")) {
      storage.removeItem("source_product_page");
      storage.removeItem("source_product_category");
    }
    storage.setItem("source_product", requestedProduct);
    if (!storage.getItem("source_product_page") && document.referrer) {
      storage.setItem("source_product_page", document.referrer);
    }
  }
  if (requestedCategory)
    storage.setItem("source_product_category", requestedCategory);
  if (requestedDocumentation)
    storage.setItem("documentation_request", requestedDocumentation);

  const inquiryForm = document.querySelector("#inquiry");
  if (inquiryForm && selectedPackaging) {
    const details = inquiryForm.querySelector("#contact-details");
    if (details && !details.value.trim()) details.value = "Packaging interest: " + selectedPackaging + (packagingProduct ? "\nProduct: " + packagingProduct + "\nProduct page: " + packagingSource : "") + (packagingKey === "label-only" ? "\nI want to keep the existing bottle and customize the label only. I understand the minimum is 500 bottles. Please confirm label requirements and whether any existing carton artwork needs updating." : "") + "\nI would like to discuss this packaging concept for a supplement project. Please confirm feasibility, available specifications and project requirements.\n\nProduct / formula:\nTarget market:\nEstimated quantity:\nPreferred size / material / artwork:\nReference: https://weeyar.com/oem#packaging-design";
    const status = inquiryForm.querySelector("#request-choice-status");
    if(status) status.textContent = "Selected packaging: " + selectedPackaging + ". Your starting message is ready to edit below.";
  }

  if (inquiryForm) {
    const productInput = inquiryForm.querySelector("#contact-product");
    const productField = inquiryForm.querySelector("#product-context-field");
    const productNote = inquiryForm.querySelector("#product-context-note");
    const categorySelect = inquiryForm.querySelector("#contact-category");
    const documentationSelect = inquiryForm.querySelector(
      "#contact-documentation",
    );
    const productContext =
      requestedProduct || storage.getItem("source_product");
    const categoryContext =
      requestedCategory || storage.getItem("source_product_category");
    const documentationContext =
      requestedDocumentation || storage.getItem("documentation_request");

    if (productContext && productInput && productField) {
      productInput.value = (selectedPackaging ? (packagingProduct ? packagingProduct + " - " : "") + selectedPackaging : productContext.slice(0, 160));
      if (selectedPackaging) {
        const label = inquiryForm.querySelector('label[for="contact-product"]');
        if (label) label.textContent = packagingProduct ? "Product and customization" : "Selected packaging";
        if (productNote) productNote.textContent = "Your selected packaging concept is included below. Specifications and availability will be confirmed for your project.";
      }
      productField.hidden = false;
      if (productNote) productNote.classList.add("show");
    }
    if (documentationContext && documentationSelect) {
      const matchingDocument = Array.from(documentationSelect.options).find(
        (option) =>
          option.value.toLowerCase() === documentationContext.toLowerCase(),
      );
      if (matchingDocument) documentationSelect.value = matchingDocument.value;
      const details = inquiryForm.querySelector("#contact-details");
      if (details)
        details.placeholder =
          "Tell us the product, target market, estimated quantity and documents your team needs to review.";
    }
    if (categoryContext && categorySelect) {
      const matchingOption = Array.from(categorySelect.options).find(
        (option) =>
          option.value.toLowerCase() === categoryContext.toLowerCase(),
      );
      if (matchingOption) categorySelect.value = matchingOption.value;
    }

    const supplyExperience = document.querySelector(".response span");
    if (supplyExperience)
      supplyExperience.textContent = "Dietary supplement supply experience";
    const note = inquiryForm.querySelector(".file-note");
    if (note)
      note.textContent = "Images, PDF, Word and Excel files are accepted.";

    const status = document.createElement("div");
    status.className = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    inquiryForm.querySelector(".submit").before(status);

    inquiryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitButton = inquiryForm.querySelector(".submit");
      if (submitButton.disabled) return;
      const formData = new FormData(inquiryForm);
      formData.set("_replyto", String(formData.get("Email") || "").trim());
      formData.set("email", String(formData.get("Email") || "").trim());
      attributionKeys.forEach((key) => {
        formData.append(key, storage.getItem(key) || "direct");
      });
      if (firstVisit)
        Object.entries(firstVisit).forEach(([key, value]) =>
          formData.append("first_visit_" + key, value),
        );
      formData.append(
        "entry_referrer",
        storage.getItem("entry_referrer") || "not_available",
      );
      formData.append(
        "landing_page",
        storage.getItem("landing_page") || window.location.href,
      );
      formData.append(
        "source_product",
        storage.getItem("source_product") || "not_specified",
      );
      formData.append(
        "source_product_page",
        storage.getItem("source_product_page") || "not_specified",
      );
      formData.append(
        "_subject",
        window.weeyarTestMode
          ? "[TEST] Weeyar Website Inquiry"
          : "New Weeyar Website Inquiry",
      );
      formData.append(
        "submission_type",
        window.weeyarTestMode ? "test" : "customer",
      );
      formData.append("_template", "table");

      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
      status.className = "form-status";
      status.textContent = "";

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(
          "/api/inquiry",
          {
            method: "POST",
            signal: controller.signal,
            body: JSON.stringify(Object.fromEntries(formData.entries())),
            headers: { Accept: "application/json", "Content-Type": "application/json" },
          },
        );
        const result = await response.json();
        if (!response.ok || (result.success !== true && result.success !== "true"))
          throw new Error(typeof result.message === "string" ? result.message.slice(0, 300) : "Submission not accepted");

        status.className = "form-status show success";
        status.textContent =
          "Thank you. Your inquiry has been sent successfully. We will contact you shortly.";
        try { if (window.gtag) {
          window.gtag("event", "generate_lead", {
            form_name: "contact_inquiry",
              packaging_type: selectedPackaging ? packagingKey : "not_selected",
            product_category:
              formData.get("Product Category") || "not_selected",
            documentation_request:
              formData.get("Documentation Request") || "not_selected",
            source_product: formData.get("source_product") || "not_specified",
          });
        }
        } catch { /* Analytics must not change submission status. */ }
        inquiryForm.reset();
        if (productInput && productContext)
          productInput.value = (selectedPackaging ? (packagingProduct ? packagingProduct + " - " : "") + selectedPackaging : productContext.slice(0, 160));
      if (selectedPackaging) {
        const label = inquiryForm.querySelector('label[for="contact-product"]');
        if (label) label.textContent = packagingProduct ? "Product and customization" : "Selected packaging";
        if (productNote) productNote.textContent = "Your selected packaging concept is included below. Specifications and availability will be confirmed for your project.";
      }
        if (categorySelect && categoryContext) {
          const option = Array.from(categorySelect.options).find(
            (item) =>
              item.value.toLowerCase() === categoryContext.toLowerCase(),
          );
          if (option) categorySelect.value = option.value;
        }
        if (documentationSelect && documentationContext) {
          const docOption = Array.from(documentationSelect.options).find(
            (item) =>
              item.value.toLowerCase() === documentationContext.toLowerCase(),
          );
          if (docOption) documentationSelect.value = docOption.value;
        }
        if (referenceFileName)
          referenceFileName.textContent = "No file selected";
      } catch (error) {
        try { if (window.gtag) window.gtag("event", "rfq_error", { form_name: "contact_inquiry" }); } catch {}
        status.className = "form-status show error";
        status.innerHTML =
          'We could not confirm your submission. Your details are still here. If you have not received a reply, please email <a href="mailto:supplements@weeyar.com">supplements@weeyar.com</a> or <a href="https://wa.me/8613802837662" target="_blank" rel="noopener">contact us on WhatsApp</a>.';
        if (error instanceof Error && error.message !== "Failed to fetch") {
          const detail = document.createElement("p");
          detail.textContent = "Details: " + error.message;
          status.append(detail);
        }
      } finally {
        window.clearTimeout(timeout);
        submitButton.disabled = false;
        submitButton.textContent = "Send Inquiry →";
      }
    });
  }
});

// Packaging is part of OEM/ODM; shared navigation also serves the mobile menu.
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = '.pkg-nav{position:relative;display:inline-flex;align-items:center;gap:2px}.pkg-nav-toggle{border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;padding:8px;min-width:32px;min-height:40px}.pkg-nav-panel{position:absolute;top:100%;left:0;min-width:220px;background:#fff;border:1px solid #e6def4;border-radius:12px;padding:12px;box-shadow:0 12px 30px #24143f20;z-index:100}.pkg-nav-panel[hidden]{display:none}.pkg-nav-panel a{display:block!important;padding:12px!important;color:#573399!important;font-size:14px!important;white-space:nowrap}.pkg-nav-toggle:focus-visible{outline:2px solid #7548f5}@media(max-width:980px){.links.open .pkg-nav{display:flex;flex-wrap:wrap;width:100%}.links.open .pkg-nav-panel{position:static;flex-basis:100%;box-shadow:none;margin:4px 0 8px}.links.open .pkg-nav-panel a{white-space:normal}}';
  document.head.append(style);
  document.querySelectorAll('header nav.links a').forEach(link => {
    if (new URL(link.href).pathname.replace(/\/$/,'') !== '/oem') return;
    if (link.closest('.pkg-nav')) return;
    const group = document.createElement('span'); group.className = 'pkg-nav';
    link.before(group); group.append(link);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'pkg-nav-toggle'; button.textContent = '▾';
    button.setAttribute('aria-label','Show OEM / ODM packaging options');button.setAttribute('aria-expanded','false');
    const panel = document.createElement('span');panel.className = 'pkg-nav-panel';panel.hidden = true;
    panel.id = 'pkg-nav-options';button.setAttribute('aria-controls',panel.id);
    const packaging = document.createElement('a');packaging.href='/oem#packaging-design';packaging.textContent='Packaging & Design';panel.append(packaging);
    const close=()=>{panel.hidden=true;button.setAttribute('aria-expanded','false');};
    button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));});
    group.addEventListener('keydown',e=>{if(e.key==='Escape'){close();button.focus();}});
    document.addEventListener('click',e=>{if(!group.contains(e.target))close();});
    packaging.addEventListener('click',()=>{close();document.querySelector('header .links')?.classList.remove('open');});
    group.append(button,panel);
  });
  const footer=document.querySelector('footer');
  if(footer){
    const existing=[...footer.querySelectorAll('a')].find(a=>/packaging/i.test(a.textContent));
    if(existing){existing.href='/oem#packaging-design';existing.textContent='Packaging & Design';}
    else {
      const heading=[...footer.querySelectorAll('h3,h4')].find(h=>/solutions/i.test(h.textContent));
      if(heading){const a=document.createElement('a');a.href='/oem#packaging-design';a.textContent='Packaging & Design';heading.parentElement.append(a);}
    }
  }
});
