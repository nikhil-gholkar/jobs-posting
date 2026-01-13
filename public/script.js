document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  document.getElementById("status").innerText = "Posting...";

  // 🔹 1. POST TO TELEGRAM (UNCHANGED)
  const res = await fetch("/api/post-job", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": "SECRET123"
    },
    body: JSON.stringify(data)
  });

  document.getElementById("status").innerText =
    res.ok ? "Posted Successfully ✅" : "Failed ❌";

  // 🔹 2. FILL IMAGE CARD (NEW)
  document.getElementById("imgTitle").innerText = data.title;
  document.getElementById("imgCompany").innerText = data.company;
  document.getElementById("imgLocation").innerText = "📍 " + data.location;
  document.getElementById("imgExperience").innerText = "🧠 " + data.experience;
  document.getElementById("imgApply").innerText = "🔗 " + data.applyLink;

  const card = document.getElementById("jobCard");
  card.style.display = "block";

  // 🔹 3. GENERATE IMAGE (NEW)
  const canvas = await html2canvas(card, { scale: 2 });

  // 🔹 4. DOWNLOAD BUTTON (NEW)
  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.style.display = "inline-block";

  downloadBtn.onclick = () => {
    const link = document.createElement("a");
    link.download = "job-post.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
});
