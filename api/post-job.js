import axios from "axios";
import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const job = await req.json();

  // --- Generate Image ---
  const image = new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          background: "#020617",
          color: "white",
          padding: "80px",
          fontSize: "48px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <strong style={{ color: "#22c55e", fontSize: 64 }}>
          WE'RE HIRING
        </strong>

        <div style={{ marginTop: 40 }}>{job.title}</div>
        <div style={{ marginTop: 20 }}>🏢 {job.company}</div>
        <div>📍 {job.location}</div>
        <div>🧑‍💻 {job.experience}</div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );

  const imageBuffer = Buffer.from(await image.arrayBuffer());

  // --- Telegram ---
  const caption = `
🚀 ${job.title}

🏢 ${job.company}
📍 ${job.location}
🧑‍💻 ${job.experience}

🔗 Apply:
${job.applyLink}
`;

  const form = new FormData();
  form.append("chat_id", process.env.TG_CHANNEL);
  form.append("caption", caption);
  form.append("photo", new Blob([imageBuffer]), "job.png");

  await axios.post(
    `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`,
    form
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
