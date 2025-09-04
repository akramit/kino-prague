const grid = document.getElementById('grid');
const statusEl = document.getElementById('status');
const emptyEl = document.getElementById('empty');
const refreshBtn = document.getElementById('refreshBtn');

async function loadManifest(cacheBust = false) {
  const url = cacheBust ? `/manifest.json?ts=${Date.now()}` : 'public/manifest.json';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

function fmtTime(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString(); }
  catch { return iso; }
}

function render(manifest) {
  grid.innerHTML = '';
  if (!manifest?.items?.length) {
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  for (const item of manifest.items) {
    const imgSrc = `${item.image}?v=${manifest.version || Date.now()}`;
    const card = document.createElement('section');
    card.className = 'card';
    card.innerHTML = `
      <header>
        <strong><a href="${item.url}" target="_blank" rel="noopener">${item.name}</a></strong>
        <span class="meta">${new URL(item.url).hostname}</span>
      </header>
      <div class="imgwrap">
        <img alt="${item.name} screenshot" src="${imgSrc}" loading="lazy">
      </div>
      <div class="footer">
        <span>Last updated: ${fmtTime(item.takenAt)}</span>
        <a href="${item.url}" target="_blank" rel="noopener" style="color:#9cdcfe">Open site</a>
      </div>
    `;
    grid.appendChild(card);
  }
}

async function hydrate() {
  statusEl.textContent = 'Loading…';
  try {
    const manifest = await loadManifest();
    render(manifest);
    statusEl.textContent = manifest?.updatedAt ? `Manifest: ${fmtTime(manifest.updatedAt)}` : '';
  } catch {
    statusEl.textContent = 'Failed to load manifest.';
  }
}

async function refresh() {
  refreshBtn.disabled = true;
  statusEl.textContent = 'Refreshing…';

  try {
    // If you have an /api/refresh endpoint, this will trigger it.
    const res = await fetch('/api/refresh', { method: 'POST' });
    if (res.ok) {
      const manifest = await res.json();
      render(manifest);
      statusEl.textContent = `Updated: ${fmtTime(manifest.updatedAt)}`;
    } else {
      const m = await loadManifest(true);
      render(m);
      statusEl.textContent = 'Refreshed (cache-busted).';
    }
  } catch {
    const m = await loadManifest(true);
    render(m);
    statusEl.textContent = 'Refreshed (cache-busted).';
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener('click', refresh);
hydrate();
