document.addEventListener('DOMContentLoaded',async()=>{
  const products=await fetch('products-v2.json').then(r=>r.json());
  const id=new URLSearchParams(location.search).get('id');
  const p=products.find(x=>x.slug===id)||products[0];
  document.title=`${p.name} | Weeyar Private Label`;
  document.querySelector('#detailImage').src=p.image;document.querySelector('#detailImage').alt=p.name;
  document.querySelector('#detailCategory').textContent=p.category;document.querySelector('#detailName').textContent=p.name;document.querySelector('#detailSummary').textContent=p.summary;
  document.querySelector('#detailFeatures').innerHTML=p.features.map(x=>`<li>${x}</li>`).join('');
  document.querySelector('#detailFormat').textContent=p.category;document.querySelector('#detailPackaging').textContent=p.packaging;
  const msg=encodeURIComponent(`Hello Weeyar, I am interested in ${p.name}. Please send product details, MOQ and private label options.`);
  document.querySelector('#detailWhatsApp').href=`https://wa.me/8613802837662?text=${msg}`;
});
