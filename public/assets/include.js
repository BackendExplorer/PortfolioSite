async function inject(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url, { cache: "no-cache" });
  el.innerHTML = await res.text();
}

window.addEventListener("DOMContentLoaded", async () => {
  await inject("#app-header", "/components/header.html");
  await inject("#app-footer", "/components/footer.html");
});
