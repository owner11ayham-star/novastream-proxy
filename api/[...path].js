export default async function handler(req, res) {
  try {
    // استخراج الرابط من بعد /api/
    const target = decodeURIComponent(req.url.replace(/^\/api\//, ""));

    // التحقق أن الرابط ينتهي بـ m3u8
    if (!target.startsWith("http") || !target.endsWith(".m3u8")) {
      return res.status(400).send("Invalid or unsupported URL");
    }

    // جلب الملف من المصدر
    const response = await fetch(target);
    const contentType = response.headers.get("content-type") || "application/vnd.apple.mpegurl";
    res.setHeader("Content-Type", contentType);

    // إرسال البيانات كما هي
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}
