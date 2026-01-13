document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  document.getElementById("status").innerText = "Posting...";

  // 🔹 TELEGRAM POST (UNCHANGED)
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

  // 🔹 TEMPLATE SWITCH
  const card = document.getElementById("jobCard");
  card.className = data.template;

  // 🔹 FILL IMAGE DATA
  imgTitle.innerText = data.title;
  imgCompany.innerText = data.company;
  imgLocation.innerText = "📍 " + data.location;
  imgExperience.innerText = "🧠 " + data.experience;
  imgApply.innerText = "🔗 " + data.applyLink;

  card.style.display = "block";

  // 🔹 IMAGE GENERATION
  const canvas = await html2canvas(card, {
    scale: 2,
    width: 1080,
    height: 1080
  });

  // 🔹 DOWNLOAD BUTTON
  downloadBtn.style.display = "inline-block";
  downloadBtn.onclick = () => {
    const link = document.createElement("a");
    link.download = "job-post.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // 🔹 AUTO CAPTION
  const caption = `
🚀 ${data.title}
🏢 ${data.company}
📍 ${data.location}
🧠 ${data.experience}

Apply here:
${data.applyLink}
`;

  copyCaptionBtn.style.display = "inline-block";
  copyCaptionBtn.onclick = () => {
    navigator.clipboard.writeText(caption.trim());
    alert("Caption copied!");
  };
});
document.getElementById("logoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("logoPreview").src = reader.result;
  };
  reader.readAsDataURL(file);
});

