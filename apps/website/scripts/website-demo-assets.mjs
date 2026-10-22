/** Site-owned artwork and music; keep the Playground's fixtures independent. */
export function normalizeDemoAssets(source) {
  return source
    .replaceAll('"/product.svg"', '"/images/pimolu-studio.webp"')
    .replaceAll('"/demos/product.svg"', '"/images/pimolu-studio.webp"')
    .replaceAll('"/demos/avatars/jean.svg"', '"/images/pimolu-avatar.svg"')
    .replaceAll('"/avatars/jean.svg"', '"/images/pimolu-avatar.svg"')
    .replace(/"\/(?:demos\/)?media\/design-notes-(?:12|10)\.wav"/g, '"/sounds/action-game.mp3"')
    .replace(/"\/(?:demos\/)?media\/design-notes-11\.wav"/g, '"/sounds/pixel-art-game.mp3"')
    .replace(/const gradientImage\s*=[\s\S]*?;\r?\n/, 'const gradientImage = "/images/pimolu-atmosphere.webp";\n')
    .replace(/const LOGO_TILE\s*=[\s\S]*?;\r?\n/, 'const LOGO_TILE = "/images/pimolu-avatar.svg";\n')
    .replace('const TOUR_POSTER = "/images/pimolu-studio.webp";', 'const TOUR_POSTER = "/images/pimolu-atmosphere.webp";')
    .replace(/Design notes [^"\n]*episode 12/g, 'Action game')
    .replace(/Token pipelines without surprises[^"\n]*16 sec sample/g, 'Pimolu / Play | local soundtrack')
    .replaceAll('Quick note', 'Action game')
    .replaceAll('Portrait of Jean Dupont', 'Pimolu p emblem on an indigo avatar')
    .replaceAll('Pimolu Runner sneaker', 'Pimolu Studio headphones with the p emblem')
    .replaceAll('Pimolu Runner', 'Pimolu Studio')
    .replaceAll('A gradient illustration used to demonstrate prose images.', 'An original Pimolu emblem study in a lavender architectural studio.')
    .replaceAll('A short narrated update', 'Action game · local soundtrack')
    .replaceAll('A local audio note with explicit volume and time controls.', 'A local soundtrack with explicit volume and time controls.');
}
