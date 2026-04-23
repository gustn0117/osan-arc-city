import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, unit, message, agree } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: "성함과 연락처는 필수입니다." });
  }
  if (!agree) {
    return res.status(400).json({ error: "개인정보 수집·이용 동의가 필요합니다." });
  }
  if (!/^[0-9\-+\s()]{8,20}$/.test(phone)) {
    return res.status(400).json({ error: "올바른 연락처 형식이 아닙니다." });
  }

  const entry = {
    at: new Date().toISOString(),
    name: String(name).slice(0, 40),
    phone: String(phone).slice(0, 30),
    unit: String(unit || "").slice(0, 30),
    message: String(message || "").slice(0, 1000),
  };

  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "inquiries.jsonl");
    fs.appendFileSync(file, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    console.error("Failed to write inquiry:", err);
  }

  return res.status(200).json({ ok: true });
}
