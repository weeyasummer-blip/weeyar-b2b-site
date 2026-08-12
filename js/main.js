(() => {
  const measurementId = 'G-H3QXK4X1K4';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: true });

  const loadAnalytics = () => {
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(analyticsScript);
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadAnalytics, { timeout: 2500 });
  } else {
    window.addEventListener('load', loadAnalytics, { once: true });
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.links');

  if (menu && links) {
    menu.addEventListener('click', () => links.classList.toggle('open'));
  }

  document.querySelectorAll('.filter').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('.product').forEach((card) => {
        card.style.display = button.dataset.f === 'all' || card.dataset.c === button.dataset.f ? 'block' : 'none';
      });
    });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !window.gtag) return;

    const href = link.getAttribute('href') || '';
    const linkText = link.textContent.trim().replace(/\s+/g, ' ').slice(0, 100);

    if (href.includes('wa.me/')) {
      window.gtag('event', 'whatsapp_click', {
        contact_method: 'whatsapp',
        link_text: linkText,
        page_path: window.location.pathname
      });
    } else if (href.startsWith('mailto:')) {
      window.gtag('event', 'email_click', {
        contact_method: 'email',
        link_text: linkText,
        page_path: window.location.pathname
      });
    } else if (href.includes('/downloads/') || href.endsWith('.pdf')) {
      window.gtag('event', 'catalog_download', {
        file_name: href.split('/').pop(),
        link_text: linkText,
        page_path: window.location.pathname
      });
    } else if (href.includes('product-detail.html')) {
      window.gtag('event', 'product_detail_click', {
        link_text: linkText,
        link_url: href,
        page_path: window.location.pathname
      });
    } else if (href.includes('contact.html') || href === '#quote') {
      window.gtag('event', 'quote_click', {
        link_text: linkText,
        page_path: window.location.pathname
      });
    }
  });

  const referenceFile = document.querySelector('#contact-file');
  const referenceFileName = document.querySelector('#contact-file-name');
  if (referenceFile && referenceFileName) {
    referenceFile.addEventListener('change', () => {
      referenceFileName.textContent = referenceFile.files && referenceFile.files[0]
        ? referenceFile.files[0].name
        : 'No file selected';
    });
  }

  const inquiryForm = document.querySelector('#inquiry');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(inquiryForm);
      const rows = [];
      let selectedFile = '';

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          if (value.name) selectedFile = value.name;
        } else if (String(value).trim()) {
          rows.push(`${key}: ${value}`);
        }
      }

      if (selectedFile) {
        rows.push(`Reference File: ${selectedFile} (please attach this file to the email)`);
      }

      const subject = 'New Weeyar Website Inquiry';
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          form_name: 'contact_inquiry',
          product_category: formData.get('Product Category') || 'not_selected',
          target_market: formData.get('Target Market') || 'not_provided'
        });
        window.gtag('event', 'rfq_submit', {
          form_name: 'contact_inquiry',
          product_category: formData.get('Product Category') || 'not_selected',
          target_market: formData.get('Target Market') || 'not_provided'
        });
      }
      const mailto = `mailto:summer@weeyar.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rows.join('\n'))}`;
      window.location.href = mailto;

      if (selectedFile) {
        window.setTimeout(() => {
          window.alert('Your email app is opening. Please attach the selected reference file before sending.');
        }, 400);
      }
    });
  }
});
