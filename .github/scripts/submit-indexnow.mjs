const host = process.env.INDEXNOW_HOST || "weeyar.com";
const key =
  process.env.INDEXNOW_KEY ||
  "26bd87aa36524a90926c3b137ba6ec89";

const keyLocation =
  process.env.INDEXNOW_KEY_LOCATION ||
  `https://${host}/${key}.txt`;

const sitemapUrl =
  process.env.SITEMAP_URL ||
  `https://${host}/sitemap.xml`;

function decodeXml(text) {
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

const sitemapResponse = await fetch(sitemapUrl);

if (!sitemapResponse.ok) {
  throw new Error(
    `Unable to download sitemap: ${sitemapResponse.status}`
  );
}

const sitemapXml = await sitemapResponse.text();

const urlList = [
  ...sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/g),
].map((match) => decodeXml(match[1].trim()));

if (urlList.length === 0) {
  throw new Error("No URLs were found in sitemap.xml");
}

console.log(`Found ${urlList.length} URLs in sitemap.`);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  }),
});

const responseText = await response.text();

console.log(`IndexNow response: ${response.status}`);
if (responseText) console.log(responseText);

if (![200, 202].includes(response.status)) {
  throw new Error(
    `IndexNow submission failed with status ${response.status}`
  );
}

console.log(`Successfully submitted ${urlList.length} URLs to IndexNow.`);
