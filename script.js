// Utilities
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Set footer year */
$("#year").textContent = new Date().getFullYear();

/* Mobile menu */
const hamburger = $(".hamburger");
const mobileMenu = $(".mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });

  // Close menu on link click
  $$(".mobile-menu a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
    });
  });
}

/* Location tabs */
const tabs = $$(".tab");
const panels = $$(".panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const loc = tab.dataset.location;

    tabs.forEach(t => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });

    panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === loc));

    // Sync dropdowns with selected tab
    const selectedName = tab.textContent.trim();
    const locationSelect = $("#locationSelect");
    const modalLocationSelect = $("#modalLocationSelect");
    if (locationSelect) locationSelect.value = selectedName;
    if (modalLocationSelect) modalLocationSelect.value = selectedName;
  });
});

/* Quote modal open/close */
const modal = $("#quoteModal");
const openButtons = $$("[data-open-quote]");
const closeButtons = $$("[data-close-quote]");
const modalLocationSelect = $("#modalLocationSelect");

function openModal(prefillLocation) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Optional prefill location
  if (prefillLocation && modalLocationSelect) {
    modalLocationSelect.value = prefillLocation;
  }

  // Focus first input for accessibility
  const firstInput = $("input, select, textarea, button", modal);
  if (firstInput) firstInput.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const prefill = btn.dataset.prefillLocation || null;
    openModal(prefill);
  });
});

closeButtons.forEach(btn => btn.addEventListener("click", closeModal));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* Form submission (simple fallback) */
function handleQuoteSubmit(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    // Build a mailto fallback (replace email + optionally add SMS fallback)
    const toEmail = "info@edwardssonslawncare.com"; // change if needed
    const subject = encodeURIComponent(`Quote Request - ${payload.location}`);
    const body = encodeURIComponent(
`New quote request:

Name: ${payload.name}
Phone: ${payload.phone}
Email: ${payload.email || "(not provided)"}
Location: ${payload.location}
Address/Area: ${payload.address}

Details:
${payload.details}
`
    );

    // Prefer mailto as a simple "works anywhere" fallback:
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;

    // Optional: show a message (lightweight)
    alert("Thanks! Your quote request is ready to send. If your email app didn’t open, please call/text us.");
    form.reset();

    // Close modal if it was the modal form
    if (form.id === "modalQuoteForm") closeModal();
  });
}

const quoteForm = $("#quoteForm");
const modalQuoteForm = $("#modalQuoteForm");

if (quoteForm) handleQuoteSubmit(quoteForm);
if (modalQuoteForm) handleQuoteSubmit(modalQuoteForm);
