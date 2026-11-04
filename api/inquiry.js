import { randomUUID, createHash } from "node:crypto";

function inquiryChannel(input) {
  const rawSource = String(input.first_visit_source || input.utm_source || "").trim().toLowerCase();
  const source = ["external_referral","direct_or_unknown","direct","(direct)","(none)","none","not_available"].includes(rawSource) ? "" : rawSource;
  const ref = String(input.first_visit_referrer || input.entry_referrer || "");
  let host = ""; try { host = new URL(ref).hostname.toLowerCase(); } catch {}
  const match = (domains) => domains.some(d => host === d || host.endsWith("." + d));
  let channel = "未知 / 直接访问";
  if (["chatgpt","chatgpt.com","openai"].includes(source) || !source && match(["chatgpt.com","chat.openai.com"])) channel = "ChatGPT";
  else if (source === "google" || !source && match(["google.com","google.co.uk","google.ca","google.com.au"])) channel = "Google";
  else if (source === "bing" || !source && match(["bing.com"])) channel = "Bing";
  else if (["facebook","fb","facebook.com"].includes(source) || !source && match(["facebook.com","fb.com"])) channel = "Facebook";
  else if (["instagram","ig","instagram.com"].includes(source) || !source && match(["instagram.com"])) channel = "Instagram";
  else if (["youtube","yt","youtube.com"].includes(source) || !source && match(["youtube.com","youtu.be"])) channel = "YouTube";
  else if (source && !["direct","(direct)","(none)","none"].includes(source)) channel = "其他来源：" + source;
  else if (host && host !== "weeyar.com" && host !== "www.weeyar.com") channel = "其他引荐：" + host;
  return { channel, evidence: source ? "来源参数（访客浏览器记录）" : host && !["weeyar.com","www.weeyar.com"].includes(host) ? "引荐网址（访客浏览器记录）" : "未取得可识别的外部来源" };
}

const attempts = new Map();
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const reply = (code, body) => res.status(code).json(body);
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return reply(405, { success: false, message: "Method not allowed." }); }
  const origins = new Set(["https://weeyar.com", "https://www.weeyar.com"]);
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) origins.add("https://" + process.env.VERCEL_URL);
  if (!origins.has(req.headers.origin)) return reply(403, { success: false, message: "Please submit from our contact page." });
  if (!process.env.RESEND_API_KEY) return reply(503, { success: false, message: "Online submission is temporarily unavailable. Please email supplements@weeyar.com." });
  const now = Date.now();
  for (const [key, item] of attempts) if (item.until < now) attempts.delete(key);
  const ip = createHash("sha256").update(String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0]).digest("hex");
  const item = attempts.get(ip) || { count: 0, until: now + 600000 };
  if (attempts.size >= 10000 && !attempts.has(ip)) return reply(429, { success: false, message: "Please try again later." });
  item.count++; attempts.set(ip, item);
  if (item.count > 5) return reply(429, { success: false, message: "Please wait 10 minutes before trying again." });
  let input;
  try {
    if (!String(req.headers["content-type"] || "").startsWith("application/json")) throw new Error();
    input = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!input || typeof input !== "object" || Array.isArray(input) || JSON.stringify(input).length > 16000) throw new Error();
    if (Object.values(input).some(v => typeof v !== "string" || v.length > 5000)) throw new Error();
    if (!input.Name?.trim() || !input["Project Details"]?.trim() || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(input.Email || "")) throw new Error();
    if (input.website) throw new Error();
  } catch { return reply(400, { success: false, message: "Please check your name, email and inquiry." }); }
  const reference = randomUUID();
  const isTest = input.submission_type === "test";
  const fields = ["Name", "Email", "Project Details", "Target Market", "Estimated Quantity", "Company / Brand", "Product of Interest", "source_product", "source_product_page", "landing_page", "entry_referrer", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "first_visit_source", "first_visit_medium", "first_visit_campaign", "first_visit_content", "first_visit_term", "first_visit_landingPage", "first_visit_referrer"];
  const attribution = inquiryChannel(input);
  const receivedAt = new Intl.DateTimeFormat("zh-CN", {timeZone:"Asia/Shanghai",dateStyle:"medium",timeStyle:"medium",hour12:false}).format(new Date(now));
  const summary = ["收到一封来自【" + attribution.channel + "】的网站询盘", "→ 时间：" + receivedAt + "（北京时间）", "→ 姓名：" + input.Name, "→ 邮箱：" + input.Email, "→ 公司：" + (input["Company / Brand"] || "未填写"), "→ 目标市场（客户填写）：" + (input["Target Market"] || "未填写"), "→ 产品：" + (input["Product of Interest"] || input.source_product || "未填写"), "→ 数量：" + (input["Estimated Quantity"] || "未填写"), "→ 询盘原文：" + input["Project Details"], "→ 来源依据：" + attribution.evidence, "→ 首次落地页：" + (input.first_visit_landingPage || input.landing_page || "未记录"), "", "—— 原始记录 ——"];
  const text = [...summary, "Weeyar Supplements website inquiry", "Submission type: " + (isTest ? "TEST - exclude from customer inquiry totals" : "CUSTOMER"), "Reference: " + reference, "", ...fields.filter(k => input[k]).map(k => k + ": " + input[k]), "", "Use Reply to respond to the customer's email."].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Weeyar Supplements Website <website@notifications.weeyarcosmetics.com>", to: ["supplements@weeyar.com"], reply_to: input.Email.trim(), subject: (isTest ? "[TEST] " : "") + "[Weeyar Supplements] Website inquiry", text }),
      signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || !result.id) throw new Error();
    return reply(200, { success: true, reference });
  } catch {
    console.error("supplement_inquiry_unconfirmed", { reference });
    return reply(502, { success: false, message: "Delivery could not be confirmed. Please contact supplements@weeyar.com. Reference: " + reference });
  }
}
