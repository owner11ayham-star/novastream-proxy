export default async function handler(req, res) {
  const { channel } = req.query;

  // إزالة .m3u8 إذا موجودة
  const cleanName = channel.replace(/\.m3u8$/, '');

  // قائمة القنوات
  const channels = {
    nova1: "http://125x.org:8080/bn3hd/tracks-v1a1/mono.m3u8",
    // أضف باقي القنوات هنا
  };

  const url = channels[cleanName];

  if (!url) {
    return res.status(404).send("Channel not found");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(500).send("Error fetching stream: " + err.message);
  }
}
