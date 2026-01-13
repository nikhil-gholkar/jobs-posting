import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const job = req.body;

  const text = `
🚀 ${job.title}

🏢 Company: ${job.company}
🎓 Qualification: ${job.quali}
💵 CTC: ${job.ctc}
📍 Location: ${job.location}
🧑‍💻 Experience: ${job.experience}

🔗 Apply here:
${job.applyLink}

Join @jobs_dekhho for more job updates

`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TG_CHANNEL,
        text
      }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Telegram failed" });
  }
}
