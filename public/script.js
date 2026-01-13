document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));
  document.getElementById("status").innerText = "Posting...";

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
});
