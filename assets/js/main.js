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
