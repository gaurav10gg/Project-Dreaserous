// js/script.js
(() => {
  // Change this if your backend uses another port/URL
  const BASE_API = "";
  document.addEventListener("DOMContentLoaded", () => {
    wireNav();
    wireContactForm();
  });

  function wireNav() {
    document.querySelectorAll(".nav-link").forEach(btn => {
      const target = btn.dataset.target;
      btn.addEventListener("click", () => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function wireContactForm() {
    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.textContent = "";
      const data = Object.fromEntries(new FormData(form).entries());

      // Basic client-side validation
      if (!data.name || !data.email || !data.message) {
        statusEl.textContent = "Please fill all fields.";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      try {
  // backend expects /api/contact
  const res = await fetch(`${BASE_API}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          const err = json.error || json.message || `Server error (${res.status})`;
          throw new Error(err);
        }

        statusEl.textContent = json.message || "Message sent. Thanks!";
        form.reset();
      } catch (err) {
        console.error("Contact submit error:", err);
        statusEl.textContent = "Error sending message: " + (err.message || "unknown");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  }
})();

