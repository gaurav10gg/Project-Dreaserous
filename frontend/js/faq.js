// js/faq.js
document.addEventListener("DOMContentLoaded", () => {
  const BASE_API = "";
 // changed to match backend port
  const faqList = document.getElementById("faq-list");
  const searchInput = document.getElementById("faq-search");

  let faqs = [];

  async function loadFaqs() {
    faqList.innerHTML = `<div class="loading">Loading FAQs…</div>`;
    try {
  // backend endpoint: /api/faqs
  const res = await fetch(`${BASE_API}/api/faqs`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      faqs = await res.json();
      renderFaqs(faqs);
    } catch (err) {
      console.error("FAQ load error:", err);
      faqList.innerHTML = `<div class="error">Could not load FAQs. (${err.message})</div>`;
    }
  }

  function renderFaqs(list) {
    faqList.innerHTML = "";
    if (!Array.isArray(list) || list.length === 0) {
      faqList.innerHTML = `<div class="empty">No FAQs available yet.</div>`;
      return;
    }
    list.forEach(faq => {
      const item = document.createElement("div");
      item.className = "faq-item";
      item.innerHTML = `
        <div class="faq-question" tabindex="0">${escapeHtml(faq.question || "Untitled")}</div>
        <div class="faq-answer">${escapeHtml(faq.answer || "")}</div>
      `;
      const q = item.querySelector(".faq-question");
      q.addEventListener("click", () => item.classList.toggle("open"));
      q.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); item.classList.toggle("open"); }
      });
      faqList.appendChild(item);
    });
  }

  // Live search (instant filter)
  searchInput.addEventListener("input", (e) => {
    const kw = e.target.value.trim().toLowerCase();
    if (!kw) return renderFaqs(faqs);
    const filtered = faqs.filter(f =>
      (f.question || "").toLowerCase().includes(kw) ||
      (f.answer || "").toLowerCase().includes(kw)
    );
    renderFaqs(filtered);
  });

  function escapeHtml(s = "") {
    return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  }

  loadFaqs();
});
