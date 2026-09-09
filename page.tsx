import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CategoryProductIcon } from "../components/CategoryProductIcon";
import { products } from "../lib/products";
import { SITE_URL } from "../lib/site";

const categories = [
  {title:"Facial Skincare", desc:"Serums, ampoules, creams and targeted facial care", formats:["Serums","Creams","Ampoules"]},
  {title:"Hand & Foot Care", desc:"Hand creams, foot masks, cuticle care and intensive moisture", formats:["Creams","Masks","Balms"]},
  {title:"Body Care", desc:"Body lotions, oils, scrubs and everyday moisture care", formats:["Lotions","Oils","Scrubs"]},
  {title:"Hair & Scalp", desc:"Shampoos, scalp serums, hair oils and targeted treatments", formats:["Shampoo","Serums","Hair Oils"]},
  {title:"Bath & Shower", desc:"Cleansing bars, shower steamers, bath bombs and shower care", formats:["Soaps","Steamers","Bath Care"]},
  {title:"Oral Care", desc:"Whitening pens, strips, foams, tongue care and daily oral care", formats:["Whitening","Foams","Daily Care"]},
  {title:"Aromatherapy", desc:"Massage oils, essential-oil blends and diffuser oils", formats:["Massage Oils","Blends","Diffuser Oils"]},
  {title:"Home Fragrance", desc:"Diffuser refills, scented plaster and home-scent formats", formats:["Refills","Scented Décor","Home Scent"]},
  {title:"Color Cosmetics", desc:"Lip, cheek, brow and complexion products for market testing", formats:["Lip","Cheek","Complexion"]},
];
const steps = [
  ["Select ready-stock products", "Choose market-ready products in their authentic packaging."],
  ["Build a mixed trial order", "Combine multiple SKUs without overcommitting inventory."],
  ["Confirm & dispatch", "We verify stock, quote shipping and prepare your order."],
  ["Scale your winners", "Move successful products into Private Label or OEM/ODM."],
];

export default function Home() {
  const organizationSchema={"@context":"https://schema.org","@type":"Organization",name:"Weeyar Cosmetics (Guangzhou) Co., Ltd.",url:SITE_URL,email:"summer@weeyar.com",telephone:"+86 138 0283 7662",address:{"@type":"PostalAddress",addressLocality:"Guangzhou",addressCountry:"CN"},contactPoint:{"@type":"ContactPoint",contactType:"sales",email:"summer@weeyar.com",telephone:"+86 138 0283 7662",availableLanguage:["English","Chinese"]}};
  const websiteSchema={"@context":"https://schema.org","@type":"WebSite",name:"Weeyar Cosmetics",url:SITE_URL,description:"Ready-stock personal care and skincare supply for global businesses."};
  return <main>
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema)}}/>

    <section className="hero shell" id="top">
      <div>
        <p className="eyebrow">Personal care & skincare supply</p>
        <h1>Start with ready-stock.<br/><em>Scale what sells.</em></h1>
        <p className="lead">Source market-ready personal care and skincare with proven packaging. Start with 30 pieces total and mix products with only 3 pieces per SKU.</p>
        <div className="actions"><a className="button" href="/wholesale/30-piece-mixed-order" data-event="mixed_order_start" data-source="homepage-hero">Build a 30-Piece Mixed Order →</a><a className="textlink" href="/products" data-event="catalog_click" data-source="homepage-hero">Browse Products ↗</a></div>
        <p className="response-note">Stock and shipping confirmed before payment · Replies within one business day</p>
        <div className="proof"><span><b>30 PCS Total</b>Mixed trial order</span><span><b>3 PCS / SKU</b>Test more products</span><span><b>Fast Dispatch</b>Ship from confirmed stock</span></div>
      </div>
      <div className="heroart">
        <img className="hero-scene" src="/hero-ready-stock-care-v2.webp" alt="Ready-stock personal care and skincare assortment with shipping cartons"/>
      </div>
    </section>

    <section className="orangebar"><div className="shell"><p>Built for retailers, online sellers, salons and distributors who want to test products before committing to large production runs.</p><span>Flexible sourcing, made practical.</span></div></section>

    <section className="buyer-shortcuts shell" aria-label="Wholesale buyer shortcuts">
      <a href="/wholesale/cosmetics-wholesale-with-prices" data-event="price_list_click" data-source="homepage-shortcuts"><small>01 · PLAN YOUR BUDGET</small><h2>View wholesale prices</h2><p>Compare published tier prices before building your trial order.</p><b>See price list →</b></a>
      <a href="/wholesale/30-piece-mixed-order" data-event="mixed_order_start" data-source="homepage-shortcuts"><small>02 · CHOOSE PRODUCTS</small><h2>Build a mixed order</h2><p>Select products across categories from 30 pieces total.</p><b>Start selecting →</b></a>
      <a href="/contact?source=homepage-shortcuts" data-event="quote_click" data-source="homepage-shortcuts"><small>03 · CONFIRM AVAILABILITY</small><h2>Ask our sourcing team</h2><p>Send your market, quantity and product requirements for review.</p><b>Request support →</b></a>
    </section>

    <section className="section shell category-section" id="products">
      <div className="sectionhead"><div><p className="eyebrow">Shop by category</p><h2>One trusted supply partner.<br/>9 ready-stock product categories.</h2></div><div className="stock-intro"><p>Explore nine ready-stock categories built for flexible product testing and fast sourcing.</p><a className="textlink" href="/products">Browse Ready-Stock Catalog →</a></div></div>
      <div className="category-nav-grid">{categories.map((category,i)=><a className="category-nav-card" href={`/products?category=${encodeURIComponent(category.title)}`} key={category.title}><div className="category-card-top"><span>0{i+1}</span><small>READY-STOCK CATEGORY</small></div><CategoryProductIcon category={category.title} className="category-icon"/><div className="category-card-copy"><h3>{category.title}</h3><p>{category.desc}</p><div className="category-formats">{category.formats.map(format=><i key={format}>{format}</i>)}</div></div><b>Explore category →</b></a>)}</div>
    </section>

    <section className="featured section"><div className="shell"><div className="sectionhead"><div><p className="eyebrow">Featured ready-stock</p><h2>Test what’s trending now.</h2></div><a className="textlink" href="/products">View all {products.length} products →</a></div><div className="featured-grid">{products.filter(p=>p.featured).slice(0,4).map(product=><a className="featured-card" href={`/products/${product.slug}`} key={product.slug}><div><img src={product.image} alt={product.name}/></div><small>{product.category}</small><h3>{product.name}</h3><p>{product.size} · 3 pieces minimum per SKU</p><b>Request quote →</b></a>)}</div></div></section>

    <section className="section dark" id="how"><div className="shell">
      <div className="sectionhead"><div><p className="eyebrow">Simple sourcing</p><h2>From trial order to growth.</h2></div><p>One flexible supply path for testing now and building your brand later.</p></div>
      <div className="steps">{steps.map(([title,desc],i)=><article key={title}><small>0{i+1}</small><h3>{title}</h3><p>{desc}</p></article>)}</div>
    </div></section>

    <section className="section shell split" id="why">
      <div className="warehouse"><span>Stock · inspection · packing</span><div>Authentic packaging<br/>On-site order checks</div></div>
      <div><p className="eyebrow">Supply confidence</p><h2>Not just products.<br/>A practical supply partner.</h2><p className="lead">We focus on the details that matter after you find a product: stock confirmation, packaging checks, mixed-order coordination, export documents and worldwide shipping support.</p>
      <ul><li><b>Stock visibility</b><span>Reconfirmed before order</span></li><li><b>Order inspection</b><span>Packaging and quantity checked</span></li><li><b>Document support</b><span>COA & MSDS where applicable</span></li></ul></div>
    </section>

    <section className="upgrade" id="private-label"><div className="shell"><div><p className="eyebrow">Grow on your terms</p><h2>When a product proves itself,<br/>make it truly yours.</h2></div><div><p>Start with existing packaging to test demand. For larger orders, move into custom labels, packaging, formulas and full OEM/ODM development.</p><a className="button cream" href="/private-label">Explore Private Label →</a></div></div></section>

    <section className="section shell home-contact" id="quote"><div><p className="eyebrow">Start sourcing</p><h2>Send one brief.<br/>We’ll help shape the order.</h2></div><div><p className="lead">Share a product link, category, target quantity or market. We’ll help identify suitable ready-stock options and confirm availability before you order.</p><a className="button" href="/contact">Send a Sourcing Request →</a></div></section>
    <SiteFooter />
  </main>;
}
