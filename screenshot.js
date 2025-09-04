// screenshot.js
import { chromium } from 'playwright'; // npm i playwright
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const PUBLIC_DIR = path.resolve('public');
const SITES_FILE = path.resolve('sites.json');

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function readSites() {
  const buf = await fs.readFile(SITES_FILE, 'utf8');
  const sites = JSON.parse(buf);
  if (!Array.isArray(sites) || !sites.length) throw new Error('sites.json is empty');
  return sites;
}

async function ensurePublicDir() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
}

export async function runScreenshots() {
  await ensurePublicDir();
  const sites = await readSites();

  const browser = await chromium.launch();
  const results = [];
  for (const s of sites) {
    const name = s.name || new URL(s.url).hostname;
    const slug = slugify(name || s.url);
    const imgPath = path.join(PUBLIC_DIR, `${slug}.png`);
    const metaPath = path.join(PUBLIC_DIR, `${slug}.json`);

    let page;
    try {
      page = await browser.newPage({ viewport: { width: 1440, height: 2000 } });
      await page.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.screenshot({ path: imgPath, fullPage: true });
      const takenAt = new Date().toISOString();
      const meta = { name, url: s.url, image: `/${path.basename(imgPath)}`, takenAt };
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
      results.push(meta);
      console.log('✓', name);
    } catch (e) {
      console.error('✗ Failed:', name, e.message);
      // Keep a placeholder meta so it still shows up
      const meta = { name, url: s.url, image: `/${path.basename(imgPath)}`, takenAt: null, error: String(e) };
      results.push(meta);
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
    } finally {
      await page.close();
    }
  }
  await browser.close();

  const manifest = {
    updatedAt: new Date().toISOString(),
    version: crypto.randomBytes(8).toString('hex'), // bust client caches
    items: results
  };
  await fs.writeFile(path.join(PUBLIC_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

// CLI mode
if (import.meta.url === `file://${process.argv[1]}`) {
  runScreenshots().then(() => {
    console.log('Manifest written to public/manifest.json');
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
