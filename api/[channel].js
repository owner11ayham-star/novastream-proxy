export default async function handler(req, res) {
  const { channel } = req.query;

  // ضع هنا روابط m3u8 للقنوات
  const channels = {
    nova1: "http://125x.org:8080/bn3hd/tracks-v1a1/mono.m3u8",
    nova2: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  };

  if (!channels[channel]) {
    return res.status(404).send("Channel not found");
  }

  try {
    const fetchResponse = await fetch(channels[channel]);
    if (!fetchResponse.ok) {
      return res.status(500).send("Failed to fetch stream");
    }

    // تمرير الهيدر الصحيح حتى يشتغل m3u8
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    fetchResponse.body.pipe(res);
  } catch (error) {
    res.status(500).send("Error fetching stream");
  }
}
