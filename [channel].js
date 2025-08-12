export default async function handler(req, res) {
  const channels = {
    nova1: "http://125x.org:8080/bn3hd/tracks-v1a1/mono.m3u8",
    nova2: "http://testserver.com/live/stream2.m3u8",
    // تقدر تضيف قنوات زيادة بنفس الطريقة
  };

  const { channel } = req.query;

  if (!channels[channel]) {
    res.status(404).send("Channel not found");
    return;
  }

  try {
    const response = await fetch(channels[channel]);
    if (!response.ok) throw new Error("Failed to fetch stream");

    // نرسل البث مباشرة
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    const body = await response.text();
    res.send(body);
  } catch (error) {
    res.status(500).send("Error streaming channel");
  }
}
