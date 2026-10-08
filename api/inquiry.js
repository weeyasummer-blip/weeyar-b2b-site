import { randomUUID, createHash } from "node:crypto";

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
  const fields = ["Name", "Email", "Project Details", "Target Market", "Estimated Quantity", "Company / Brand", "Product of Interest", "source_product", "source_product_page", "landing_page", "utm_source", "utm_medium", "utm_campaign"];
  const text = ["Weeyar Supplements website inquiry", "Reference: " + reference, "", ...fields.filter(k => input[k]).map(k => k + ": " + input[k]), "", "Use Reply to respond to the customer's email."].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Weeyar Supplements Website <website@notifications.weeyarcosmetics.com>", to: ["supplements@weeyar.com"], reply_to: input.Email.trim(), subject: "[Weeyar Supplements] Website inquiry", text }),
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
