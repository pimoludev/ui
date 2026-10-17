import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const tokensSrc = JSON.parse(await readFile(resolve(root, 'packages/design-tokens/src/tokens.json'), 'utf8'));
const themeSrc = JSON.parse(await readFile(resolve(root, 'packages/themes/src/themes.json'), 'utf8'));

function walkTokens(group, prefix = [], result = {}) {
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    const path = [...prefix, key];
    if (value && typeof value === 'object' && '$value' in value) {
      const val = value.$value;
      // Native-friendly values: hex for colors, numbers for dimensions, arrays for font families.
      result[path.join('.')] = val && typeof val === 'object' && 'hex' in val
        ? val.hex
        : val && typeof val === 'object' && 'value' in val && 'unit' in val
          ? val.value
          : val;
    } else {
      walkTokens(value, path, result);
    }
  }
  return result;
}

const flatTokens = walkTokens(tokensSrc);
const getAlias = (text) => {
  const match = /^\{([a-zA-Z0-9.\-]+)\}$/.exec(text);
  if (!match) throw new Error(`Invalid theme reference: ${text}`);
  const value = flatTokens[match[1]];
  if (value === undefined) throw new Error(`Unknown token: ${match[1]}`);
  return { key: match[1], value };
};

const primitives = {};
for (const [key, value] of Object.entries(flatTokens)) {
  const [group, ...name] = key.split('.');
  const groupObj = (primitives[group] ??= {});
  let cursor = groupObj;
  for (const section of name.slice(0, -1)) cursor = (cursor[section] ??= {});
  cursor[name.at(-1)] = value;
}

const cssValue = (key, value) => {
  if (key.startsWith('spacing.') || key.startsWith('radius.') || key.startsWith('fontSize.')) return `${value}px`;
  if (key.startsWith('fontFamily.')) return Array.isArray(value) ? value.join(', ') : value;
  return value;
};
const toVariable = (key) => `--pimolu-${key.replaceAll('.', '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
const primitivesCss = ':root {\n' + Object.entries(flatTokens)
 .map(([key,value]) => `  ${toVariable(key)}: ${cssValue(key,value)};`).join('\n') + '\n}\n';

const resolvedThemes = {};
const themeCss = [];
for (const [name, vars] of Object.entries(themeSrc)) {
  resolvedThemes[name] = {};
  const declarations = [];
  for (const [semantic, ref] of Object.entries(vars)) {
    const { key, value } = getAlias(ref);
    if (!key.startsWith('color.')) throw new Error(`Expected color token in theme ${name}: ${ref}`);
    resolvedThemes[name][semantic] = value;
    declarations.push(`  --pimolu-${semantic}: var(${toVariable(key)});`);
  }
  const selector = name === 'light' ? ':root, [data-pimolu-theme="light"]' : `[data-pimolu-theme="${name}"]`;
  themeCss.push(`${selector} {\n${declarations.join('\n')}\n}`);
}
if (Object.keys(resolvedThemes.light).sort().join('|') !== Object.keys(resolvedThemes.dark).sort().join('|')) {
  throw new Error('Light and dark themes need identical semantic token keys.');
}

const tokensDist = resolve(root, 'packages/design-tokens/dist');
const themesDist = resolve(root, 'packages/themes/dist');
await mkdir(tokensDist, { recursive: true });
await mkdir(themesDist, { recursive: true });
await Promise.all([
  writeFile(resolve(tokensDist, 'tokens.json'), JSON.stringify(primitives, null, 2) + '\n'),
  writeFile(resolve(tokensDist, 'tokens.css'), primitivesCss),
  writeFile(resolve(themesDist, 'themes.json'), JSON.stringify(resolvedThemes, null, 2) + '\n'),
  writeFile(resolve(themesDist, 'styles.css'), `${primitivesCss}\n${themeCss.join('\n\n')}\n`),
]);
console.log('Pimolu tokens and themes built successfully.');
