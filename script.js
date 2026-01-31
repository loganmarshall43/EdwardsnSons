const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

$("#year").textContent = new Date().getFullYear();

/* Tabs */
const tabs = $$(".tab");
const panels = $$(".panel");
const countySelect = $("#countySelect");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const area = tab.dataset.area;

    tabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === area));

    // Sync dropdown to selected tab
    const label = tab.textContent.trim();
    if (countySelect) countySelect.value = label;
  });
});

/* Prefill county when clicking "Get a Quote" in a panel */
$$("[data-prefill-area]").forEach(btn => {
  btn.addEventListener("click", () => {
    const area = btn.dataset.prefillArea;
    if (countySelect) countySelect.value = area;
  });
});
