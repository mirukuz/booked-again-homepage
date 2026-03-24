import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');

let indexHtml: string;
let privacyHtml: string;

beforeAll(() => {
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');
  privacyHtml = readFileSync(join(DIST, 'privacy', 'index.html'), 'utf-8');
}, 60_000);

// ─── dist/index.html ─────────────────────────────────────────────────────────

describe('dist/index.html', () => {
  it('contains "BookedAgain Support" in the <title>', () => {
    expect(indexHtml).toContain('<title>BookedAgain Support</title>');
  });

  it('does NOT contain a Google Analytics script tag', () => {
    expect(indexHtml).not.toContain('googletagmanager.com/gtag/js');
    expect(indexHtml).not.toContain('G-QSMNQ8CKJG');
  });

  it('links to /privacy using an absolute path (not privacy.html)', () => {
    expect(indexHtml).toContain('href="/privacy"');
    expect(indexHtml).not.toContain('href="privacy.html"');
  });
});

// ─── dist/privacy/index.html ─────────────────────────────────────────────────

describe('dist/privacy/index.html', () => {
  it('contains the "Last updated: January 09, 2026" date', () => {
    expect(privacyHtml).toContain('Last updated: January 09, 2026');
  });

  it('contains the Google Analytics tag for G-QSMNQ8CKJG', () => {
    expect(privacyHtml).toContain('googletagmanager.com/gtag/js?id=G-QSMNQ8CKJG');
    expect(privacyHtml).toContain('G-QSMNQ8CKJG');
  });

  it('contains <meta name="robots" content="noindex">', () => {
    expect(privacyHtml).toContain('<meta name="robots" content="noindex">');
  });
});

// ─── Both files: no FPP artifacts ────────────────────────────────────────────

describe('neither dist file contains FPP artifacts', () => {
  it('dist/index.html does not contain "freeprivacypolicy-livelink"', () => {
    expect(indexHtml).not.toContain('freeprivacypolicy-livelink');
  });

  it('dist/privacy/index.html does not contain "freeprivacypolicy-livelink"', () => {
    expect(privacyHtml).not.toContain('freeprivacypolicy-livelink');
  });

  it('dist/index.html does not contain "og:site_name"', () => {
    expect(indexHtml).not.toContain('og:site_name');
  });

  it('dist/privacy/index.html does not contain "og:site_name"', () => {
    expect(privacyHtml).not.toContain('og:site_name');
  });

  it('dist/privacy/index.html does not contain "Generated using Free Privacy Policy"', () => {
    expect(privacyHtml).not.toContain('Generated using Free Privacy Policy');
  });
});
