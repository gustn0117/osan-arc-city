import { assertAuth, readAll } from "@/lib/inquiries";

export default function handler(req, res) {
  if (!assertAuth(req, res)) return;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const items = readAll().sort((a, b) => (b.at || "").localeCompare(a.at || ""));
  return res.status(200).json({ items });
}
