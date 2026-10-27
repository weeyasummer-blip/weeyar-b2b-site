document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('[data-product-category]'));
  const buttons = Array.from(document.querySelectorAll('button[data-category]'));
  const count = document.querySelector('#catalog-count');
  if (!cards.length) return;
  const search = document.querySelector('#catalog-search-input');
  const searchBox = document.querySelector('.catalog-search');
  const reset = document.querySelector('#catalog-reset');
  const empty = document.querySelector('#catalog-empty');
  const normalize = value => value.toLowerCase().trim().replace(/\s+/g, ' ');
  const textByCard = new Map(cards.map(card => [card, normalize(
    (card.querySelector('h3')?.textContent || '') + ' ' +
    (card.querySelector('.catalog-body p')?.textContent || '') + ' ' +
    card.dataset.productCategory
  )]));
  let category = 'All';
  const applyFilter = requested => {
    category = buttons.some(button => button.dataset.category === requested) ? requested : 'All';
    const terms = normalize(search?.value || '').split(' ').filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = category === 'All' || card.dataset.productCategory === category;
      card.hidden = !matchesCategory || !terms.every(term => textByCard.get(card).includes(term));
      if (!card.hidden) visible++;
    });
    buttons.forEach(button => {
      const active = button.dataset.category === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (count) count.textContent = visible + (visible === 1 ? ' product' : ' products');
    if (empty) empty.hidden = visible !== 0;
    if (reset) reset.hidden = !terms.length && category === 'All';
  };
  if (searchBox) searchBox.hidden = false;
  applyFilter(new URLSearchParams(window.location.search).get('category') || 'All');
  buttons.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.category)));
  search?.addEventListener('input', () => applyFilter(category));
  reset?.addEventListener('click', () => {
    if (search) search.value = '';
    applyFilter('All');
    search?.focus();
  });
});
