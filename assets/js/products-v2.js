document.addEventListener('DOMContentLoaded',async()=>{
  const data=await fetch('products-v2.json').then(r=>r.json());
  const grid=document.querySelector('#catalogGrid');
  const render=(filter='All')=>{grid.innerHTML=data.filter(p=>filter==='All'||p.category===filter).map(p=>`<article class="catalog-card"><a class="catalog-image" href="product-detail.html?id=${p.slug}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a><div class="catalog-body"><span class="format-tag">${p.category}</span><h3>${p.name}</h3><p>${p.summary}</p><div class="catalog-actions"><a class="view-link" href="product-detail.html?id=${p.slug}">View Details →</a></div></div></article>`).join('')};
  render();
  document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-category]').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.category)}));
});
