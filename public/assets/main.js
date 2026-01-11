async function fetchProjects() {
  const res = await fetch("/data/projects.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("projects.json を取得できません");
  return await res.json();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getQueryParam(name) {
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

window.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById("projects");
  const detailEl = document.getElementById("project-detail");

  if (!listEl && !detailEl) return;

  const projects = await fetchProjects();

  if (listEl) {
    listEl.innerHTML = projects.map(p => `
      <article class="project-card">
        <img src="${escapeHtml(p.thumbnail)}" alt="" loading="lazy" />
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(p.summary)}</p>
        <div class="row">
          <a class="btn" href="/projects/detail.html?id=${encodeURIComponent(p.id)}">詳細</a>
          <a class="btn" href="${escapeHtml(p.source)}" target="_blank" rel="noopener">Source</a>
        </div>
      </article>
    `).join("");
  }

  if (detailEl) {
    const id = Number(getQueryParam("id"));
    const p = projects.find(x => Number(x.id) === id);
    if (!p) {
      detailEl.innerHTML = "<p>指定されたプロジェクトが見つかりません。</p>";
      return;
    }
    detailEl.innerHTML = `
      <h1>${escapeHtml(p.title)}</h1>
      <p class="muted">${escapeHtml(new Date(p.date).toLocaleDateString("ja-JP"))}</p>
      <img class="hero" src="${escapeHtml(p.thumbnail)}" alt="" />
      <p>${escapeHtml(p.summary)}</p>
      <pre class="content">${escapeHtml(p.content)}</pre>
      <p><a href="${escapeHtml(p.source)}" target="_blank" rel="noopener">GitHub / Source</a></p>
    `;
  }
});
