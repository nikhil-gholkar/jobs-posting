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
  imgTitle.innerText = `Job Role- ${data.title}`;
  imgCompany.innerText = `Company Name- ${data.company}`;
  imgLocation.innerText = "📍 " +"Location- "+ data.location;
  imgExperience.innerText = "🧠 " +"experience- " + data.experience;
  // imgApply.innerText = "🔗 " + data.applyLink;

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
  const caption = ` Follow @jobs.dekhho for more job updates
opening for ${data.title} in ${data.company} Apply here link in bio
.
.
.
.
[itjobs, techjobs, softwarejobs, hiringnow, jobopening, 
developerjobs, freshersjobs, engineeringjobs, techcareers, careeropportunities]
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

