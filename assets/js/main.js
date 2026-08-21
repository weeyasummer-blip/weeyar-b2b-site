(() => {
  const measurementId = 'G-H3QXK4X1K4';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: true });

  const analyticsScript = document.createElement('script');
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(analyticsScript);
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
    } else if (href.includes('product-detail.html') || /(?:^|\/)products\//.test(href)) {
      window.gtag('event', 'product_detail_click', {
        link_text: linkText,
        link_url: href,
        page_path: window.location.pathname
      });
    } else if (href.includes('/categories/') || href.startsWith('categories/')) {
      window.gtag('event', 'product_category_click', {
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

  const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const query = new URLSearchParams(window.location.search);
  attributionKeys.forEach((key) => {
    const value = query.get(key);
    if (value) window.sessionStorage.setItem(key, value);
  });
  if (!window.sessionStorage.getItem('landing_page')) {
    window.sessionStorage.setItem('landing_page', window.location.href);
  }

  const inquiryForm = document.querySelector('#inquiry');
  if (inquiryForm) {
    const supplyExperience = document.querySelector('.response span');
    if (supplyExperience) supplyExperience.textContent = 'Dietary supplement supply experience';
    const note = inquiryForm.querySelector('.file-note');
    if (note) note.textContent = 'Images, PDF, Word and Excel files are accepted.';

    const status = document.createElement('div');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    inquiryForm.querySelector('.submit').before(status);

    inquiryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = inquiryForm.querySelector('.submit');
      const formData = new FormData(inquiryForm);
      attributionKeys.forEach((key) => {
        formData.append(key, window.sessionStorage.getItem(key) || 'direct');
      });
      formData.append('landing_page', window.sessionStorage.getItem('landing_page') || window.location.href);
      formData.append('_subject', 'New Weeyar Website Inquiry');
      formData.append('_template', 'table');

      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';

      try {
        const response = await fetch('https://formsubmit.co/ajax/summer@weeyar.com', {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Submission failed');

        status.className = 'form-status show success';
        status.textContent = 'Thank you. Your inquiry has been sent successfully. We will contact you shortly.';
        if (window.gtag) {
          window.gtag('event', 'generate_lead', {
            form_name: 'contact_inquiry',
            product_category: formData.get('Product Category') || 'not_selected',
            target_market: formData.get('Target Market') || 'not_provided'
          });
          window.gtag('event', 'rfq_submit', { form_name: 'contact_inquiry' });
        }
        inquiryForm.reset();
        if (referenceFileName) referenceFileName.textContent = 'No file selected';
      } catch (error) {
        status.className = 'form-status show error';
        status.innerHTML = 'The form could not be sent. Please email <a href="mailto:summer@weeyar.com">summer@weeyar.com</a> or contact us on WhatsApp.';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Inquiry →';
      }
    });
  }
});
