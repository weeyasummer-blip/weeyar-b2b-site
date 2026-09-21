const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const products = {
  gummies: [
    ['melatonin-slumber-gummies','Melatonin Slumber Gummies','Gummies','melatonin-slumber-gummies','Bedtime gummy concept with melatonin, chamomile, lemon balm and B-complex positioning.'],
    ['sleep-support-gummies','Sleep Support Gummies','Gummies','sleep-support-gummies','Mixed-berry gummy concept featuring ashwagandha, L-theanine, lemon balm and melatonin.'],
    ['apple-cider-vinegar','Apple Cider Vinegar Gummies','Gummies','apple-cider-vinegar-gummies','Apple-flavored ACV gummies in a compact 30-count retail presentation.'],
    ['tart-cherry-gummies','Tart Cherry Gummies','Gummies','tart-cherry-gummies','Tart-cherry gummy format for daily wellness and sports-recovery collections.'],
    ['multi-collagen-gummies','Hydrolyzed Multi-Collagen Gummies','Gummies','multi-collagen-gummies','Peach-flavored multi-collagen gummy concept for beauty-from-within ranges.'],
    ['tanning-gummies','Tanning Beauty Gummies','Gummies','tanning-gummies','Beauty gummy concept with carotenoids and antioxidant nutrients.']
  ],
  drops: [
    ['liver-detox-drops','Artichoke & Dandelion Herbal Drops','Liquid Drops','liver-detox-drops','60 ml botanical liquid featuring artichoke, dandelion and milk thistle.'],
    ['slippery-elm-drops','Slippery Elm Herbal Drops','Liquid Drops','slippery-elm-drops','Slippery-elm liquid concept for throat, voice and digestive-comfort ranges.'],
    ['lymphatic-drainage-drops','Lymphatic Drainage Herbal Drops','Liquid Drops','lymphatic-drainage-drops','Botanical-drop reference with English and Spanish packaging directions.'],
    ['cutting-drops','Liposomal Botanical Cutting Drops','Liquid Drops','cutting-drops','Compact 30 ml lemon-flavored liquid-drop concept for project evaluation.']
  ],
  capsules: [
    ['aged-garlic-softgels','Aged Odorless Garlic Softgels','Softgels','aged-garlic-softgels','Aged garlic, vitamin K2 and ubiquinol softgel concept.'],
    ['omega-3-fish-oil','Omega-3 Fish Oil Softgels','Softgels','omega-3-fish-oil','60-count fish-oil softgel reference for everyday omega-3 lines.'],
    ['vitamin-b-complex-capsules','Vitamin B-Complex Capsules','Capsules','vitamin-b-complex-capsules','One-daily B-complex concept featuring eight B vitamins.'],
    ['vitamin-b12-tablets','Vitamin B12 Fast-Dissolve Tablets','Tablets','vitamin-b12-tablets','Strawberry-flavored methylcobalamin fast-dissolve tablets.']
  ]
};

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const categoryCard = p => `<article class="catalog-card"><a class="catalog-image" href="../products/${p[0]}.html"><img src="../assets/images/new-products/${p[3]}-1.webp" alt="${esc(p[1])}" loading="lazy"></a><div class="catalog-body"><span class="format-tag">${p[2]}</span><h2>${esc(p[1])}</h2><p>${esc(p[4])}</p><a class="view-link" href="../products/${p[0]}.html">View Details →</a></div></article>`;

function updateCategory(file, additions, existingExtra = []) {
  const fp = path.join(root, file);
  let html = fs.readFileSync(fp, 'utf8');
  for (const p of additions) {
    if (!html.includes(`href="../products/${p[0]}.html"`)) {
      html = html.replace('<div class="catalog-grid">', `<div class="catalog-grid">${categoryCard(p)}`);
    }
  }
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) throw new Error(`JSON-LD not found: ${file}`);
  const data = JSON.parse(match[1]);
  const collection = data['@graph'].find(x => x['@type'] === 'CollectionPage');
  const urls = [...existingExtra, ...additions.map(p => `https://weeyar.com/products/${p[0]}`), ...collection.mainEntity.itemListElement.map(x => x.url)];
  const unique = [...new Set(urls)];
  collection.mainEntity.numberOfItems = unique.length;
  collection.mainEntity.itemListElement = unique.map((url, i) => ({'@type':'ListItem', position:i+1, url}));
  html = html.replace(match[0], `<script type="application/ld+json">${JSON.stringify(data)}</script>`);
  fs.writeFileSync(fp, html);
}

updateCategory('categories/gummies.html', products.gummies);
updateCategory('categories/liquid-drops.html', products.drops);
updateCategory('categories/capsules-probiotics.html', products.capsules);

let caps = fs.readFileSync(path.join(root,'categories/capsules-probiotics.html'),'utf8');
caps = caps.replace('../assets/images/products/vitamin-d3-k2.png','../assets/images/new-products/vitamin-d3-k2-1.webp')
  .replace('alt="Vitamin D3 and K2 Softgels"','alt="Vitamin D3 and K2 Capsules"')
  .replace('<span class="format-tag">Softgels</span><h2>Vitamin D3 + K2 Softgels</h2>','<span class="format-tag">Capsules</span><h2>Vitamin D3 + K2 Capsules</h2>');
fs.writeFileSync(path.join(root,'categories/capsules-probiotics.html'),caps);

const featured = [
  ['vitamin-d3-k2','Vitamin D3 + K2 Capsules','Capsules','vitamin-d3-k2'],
  ['apple-cider-vinegar','Apple Cider Vinegar Gummies','Gummies','apple-cider-vinegar-gummies'],
  ['melatonin-slumber-gummies','Melatonin Slumber Gummies','Gummies','melatonin-slumber-gummies'],
  ['tart-cherry-gummies','Tart Cherry Gummies','Gummies','tart-cherry-gummies'],
  ['omega-3-fish-oil','Omega-3 Fish Oil Softgels','Softgels','omega-3-fish-oil'],
  ['slippery-elm-drops','Slippery Elm Herbal Drops','Liquid Drops','slippery-elm-drops']
];
const homeCard = p => `<article><a class="home-new-image" href="products/${p[0]}.html"><img loading="lazy" decoding="async" src="assets/images/new-products/${p[3]}-1.webp" alt="${esc(p[1])}"></a><div><span>${p[2]}</span><h3>${esc(p[1])}</h3><a href="products/${p[0]}.html">View product →</a></div></article>`;
const section = `<section class="home-new-products"><div class="container"><div class="home-new-head"><div><div class="eyebrow">NEW &amp; TRENDING SUPPLEMENTS</div><h2>Explore Newly Added Product Opportunities</h2><p>Review current packaging references, supplied specifications and B2B sourcing considerations before requesting a project quotation.</p></div><a class="btn" href="products.html#catalog">View All 36 Products →</a></div><div class="home-new-grid">${featured.map(homeCard).join('')}</div></div></section>`;
let home = fs.readFileSync(path.join(root,'index.html'),'utf8');
if (!home.includes('class="home-new-products"')) {
  home = home.replace('<section class="container v95-why">', `${section}<section class="container v95-why">`);
}
fs.writeFileSync(path.join(root,'index.html'),home);
console.log('Category pages and homepage product links updated.');
