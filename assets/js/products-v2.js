document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('[data-product-category]'));
  const buttons = Array.from(document.querySelectorAll('button[data-category]'));
  const count = document.querySelector('#catalog-count');
  if (!cards.length) return;
  const applyFilter = (requested) => {
    const filter = buttons.some(b => b.dataset.category === requested) ? requested : 'All';
    let visible = 0;
    cards.forEach(card => {
      card.hidden = filter !== 'All' && card.dataset.productCategory !== filter;
      if (!card.hidden) visible++;
    });
    buttons.forEach(button => {
      const active = button.dataset.category === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (count) count.textContent = visible + (visible === 1 ? ' product' : ' products');
  };
  applyFilter(new URLSearchParams(window.location.search).get('category') || 'All');
  buttons.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.category)));
});
