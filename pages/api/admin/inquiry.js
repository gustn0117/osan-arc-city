import { assertAuth, readAll, writeAll } from "@/lib/inquiries";

const VALID_STATUS = new Set(["new", "contacted", "done"]);

export default function handler(req, res) {
  if (!assertAuth(req, res)) return;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { id, action, status, memo } = req.body || {};
  if (!id || !action) {
    return res.status(400).json({ error: "id, action 필수" });
  }

  const all = readAll();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });

  if (action === "update") {
    if (status !== undefined) {
      if (!VALID_STATUS.has(status)) {
        return res.status(400).json({ error: "status 값이 올바르지 않습니다." });
      }
      all[idx].status = status;
    }
    if (memo !== undefined) {
      all[idx].memo = String(memo).slice(0, 500);
    }
    writeAll(all);
    return res.status(200).json({ item: all[idx] });
  }

  if (action === "delete") {
    all.splice(idx, 1);
    writeAll(all);
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: "알 수 없는 action" });
}
