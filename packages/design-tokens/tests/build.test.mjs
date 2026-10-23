import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
test('builds shared tokens and light/dark themes', async () => {
  execFileSync(process.execPath, ['packages/design-tokens/scripts/build.mjs'], { cwd: root });
  const tokens = JSON.parse(await readFile(resolve(root, 'packages/design-tokens/dist/tokens.json'), 'utf8'));
  const themes = JSON.parse(await readFile(resolve(root, 'packages/themes/dist/themes.json'), 'utf8'));
  const css = await readFile(resolve(root, 'packages/themes/dist/styles.css'), 'utf8');
  assert.equal(tokens.spacing['4'], 16);
  assert.equal(tokens.radius.md, 10);
  const { pimoluMotionTokens } = await import('../dist/motion.js');
  assert.deepEqual(pimoluMotionTokens, tokens.motion);
  assert.match(css, /--pimolu-motion-duration-control: 150ms/);
  assert.match(css, /--pimolu-motion-easing-standard: cubic-bezier\(0.2, 0, 0, 1\)/);
  assert.equal(themes.light.primary, '#4F46E5');
  assert.equal(themes.dark.primary, '#818CF8');
  assert.match(css, /\[data-pimolu-theme="dark"\]/);
  assert.match(css, /--pimolu-primary: var\(--pimolu-color-indigo-600\)/);
});
