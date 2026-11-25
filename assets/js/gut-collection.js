(() => {
  const choices = [...document.querySelectorAll('input[name="selected-products"]')];
  const count = document.getElementById('selection-count');
  const request = document.getElementById('request-selection');
  const clear = document.getElementById('clear-selection');
  if (!count || !request || !clear) return;
  const selected = () => choices.filter(input => input.checked).map(input => input.value);
  function update() {
    const total = selected().length;
    count.textContent = total + (total === 1 ? ' product selected' : ' products selected');
    request.disabled = clear.disabled = total === 0;
  }
  choices.forEach(input => input.addEventListener('change', update));
  clear.addEventListener('click', () => { choices.forEach(input => { input.checked = false; }); update(); });
  request.addEventListener('click', () => {
    const names = selected();
    if (!names.length) return;
    const params = new URLSearchParams({
      product: names.join('; '),
      category: 'Gut Health & Probiotics',
      request: 'Ingredients and samples'
    });
    window.location.assign('/contact?' + params.toString() + '#quote');
  });
  window.addEventListener('pageshow', update);
  update();
})();
