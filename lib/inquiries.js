import fs from "fs";
import path from "path";
import crypto from "crypto";

const DIR = path.join(process.cwd(), "data");
const FILE = path.join(DIR, "inquiries.jsonl");
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "1234";

export function assertAuth(req, res) {
  const pass = req.headers["x-admin-pass"];
  if (pass !== ADMIN_PASS) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export function readAll() {
  if (!fs.existsSync(FILE)) return [];
  const content = fs.readFileSync(FILE, "utf8");
  return content
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        const e = JSON.parse(line);
        if (!e.id) {
          e.id = crypto
            .createHash("md5")
            .update(`${e.at}|${e.name}|${e.phone}`)
            .digest("hex")
            .slice(0, 16);
        }
        if (!e.status) e.status = "new";
        if (e.memo === undefined) e.memo = "";
        return e;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export function writeAll(entries) {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  const body = entries.map((e) => JSON.stringify(e)).join("\n");
  fs.writeFileSync(FILE, body + (entries.length ? "\n" : ""), "utf8");
}
