import axios from "axios";
import { createCanvas } from "canvas";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY)
    return res.status(401).end();

  const job = req.body;

  try {
    const imageBuffer = generateImage(job);
    await sendToTelegram(job, imageBuffer);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Telegram post failed" });
  }
}

/* -------- IMAGE GENERATION -------- */
function generateImage(job) {
  const canvas = createCanvas(1080, 1080);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 64px Arial";
  ctx.fillText("WE'RE HIRING", 80, 140);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px Arial";
  ctx.fillText(job.title, 80, 280);

  ctx.font = "40px Arial";
  ctx.fillText(`Company: ${job.company}`, 80, 380);
  ctx.fillText(`Location: ${job.location}`, 80, 450);
  ctx.fillText(`Experience: ${job.experience}`, 80, 520);

  ctx.font = "32px Arial";
  ctx.fillText("Apply link in caption", 80, 650);

  return canvas.toBuffer("image/png");
}

/* -------- TELEGRAM POST -------- */
async function sendToTelegram(job, imageBuffer) {
  const caption = `
🚀 ${job.title}

🏢 ${job.company}
📍 ${job.location}
🧑‍💻 ${job.experience}

🔗 Apply here:
${job.applyLink}
  `;

  const form = new FormData();
  form.append("chat_id", process.env.TG_CHANNEL);
  form.append("caption", caption);
  form.append("photo", imageBuffer, "job.png");

  await axios.post(
    `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`,
    form,
    { headers: form.getHeaders() }
  );
}
