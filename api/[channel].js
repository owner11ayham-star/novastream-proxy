export default async function handler(req, res) {
  const { channel } = req.query;

  // قائمة القنوات مع روابطها الأصلية
  const channels = {
    nova11: "http://125x.org:8080/bn3hd/tracks-v1a1/mono.m3u8",
    nova2: "https://example.com/stream2.m3u8"
  };

  // إذا القناة غير موجودة
  if (!channels[channel]) {
    res.status(404).send("Channel not found");
    return;
  }

  try {
    const upstream = await fetch(channels[channel], {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": channels[channel]
      }
    });

    if (!upstream.ok) {
      res.status(upstream.status).send("Error fetching stream");
      return;
    }

    // تحديد الهيدر للبث m3u8 أو ts
    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("mpegurl")) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    } else if (contentType.includes("video")) {
      res.setHeader("Content-Type", contentType);
    }

    // إعادة البيانات مباشرة للعميل
    upstream.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}
