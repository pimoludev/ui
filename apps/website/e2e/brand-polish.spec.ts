import { test, expect } from '@playwright/test';

test('calendar, emblem and product image have balanced bounds at all three widths', async ({ page }) => {
  await page.goto('/');await page.locator('[data-home-discovery-ready="true"]').waitFor();
  for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
    await page.setViewportSize({width,height});
    const centered=await page.locator('.discovery-calendar').evaluate(node=>{const a=node.getBoundingClientRect(),b=node.firstElementChild!.getBoundingClientRect();return Math.abs((a.left+a.width/2)-(b.left+b.width/2));});
    expect(centered).toBeLessThan(1);
    const worlds=page.locator('#product-worlds');await worlds.getByRole('tab',{name:'Creative',exact:true}).click();
    for(const study of ['Form study','Color study']) {
      await worlds.getByRole('radio',{name:study,exact:true}).click();
      const shape=await page.locator('.discovery-creative-art').evaluate(node=>{
        const letter=node.querySelector('.discovery-emblem')!.getBoundingClientRect(),ring=node.querySelector('i')!.getBoundingClientRect();
        return {dx:Math.abs(letter.left+letter.width/2-ring.left-ring.width/2),dy:Math.abs(letter.top+letter.height/2-ring.top-ring.height/2),diagonal:Math.hypot(letter.width/2,letter.height/2),radius:ring.width/2};
      });
      expect(shape.dx).toBeLessThan(1);expect(shape.dy).toBeLessThan(1);expect(shape.diagonal).toBeLessThan(shape.radius);
    }
    await worlds.getByRole('tab',{name:'E-commerce',exact:true}).click();
    const img=worlds.getByRole('img');await img.scrollIntoViewIfNeeded();await expect(img).toHaveAttribute('data-loaded','true');
    const fill=await img.evaluate(node=>{const a=node.getBoundingClientRect(),b=node.parentElement!.getBoundingClientRect();return {difference:Math.abs(a.width-b.width),fit:getComputedStyle(node).objectFit,ratio:a.width/a.height};});
    expect(fill.difference).toBeLessThan(1);expect(fill.fit).toBe('cover');expect(fill.ratio).toBeCloseTo(1.5,1);
  }
});

test('successful image downloads before hydration still reveal their content',async({page})=>{
  let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});
  const pattern=/\/_next\/static\/.*\.js/;
  await page.route(pattern,async route=>{await gate;await route.continue();});
  try {
    await page.goto('/preview/image',{waitUntil:'commit'});
    const image=page.locator('img[src="/images/pimolu-studio.webp"]').first();await image.waitFor({state:'attached'});
    await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
    await expect(image).toHaveAttribute('data-loaded','false');
    release();await page.locator('[data-example-hydrated="true"]').waitFor();
    await expect(image).toHaveAttribute('data-loaded','true');
  } finally {release();await page.unroute(pattern);}
});

test('the password eye is centered and autofill uses the field surface',async({page,browserName})=>{
  await page.goto('/');await page.locator('[data-home-discovery-ready="true"]').waitFor();
  const form=page.locator('.discovery-signin');await form.getByRole('textbox',{name:'Email address',exact:true}).fill('preview@example.com');
  await form.getByPlaceholder('Your demo password').fill('demo-secret');
  const toggle=form.getByRole('button',{name:'Show password',exact:true});
  const centered=await toggle.evaluate(node=>{const a=node.getBoundingClientRect(),b=node.querySelector('svg')!.getBoundingClientRect(),p=node.parentElement!.getBoundingClientRect();return {dx:Math.abs(a.left+a.width/2-b.left-b.width/2),dy:Math.abs(a.top+a.height/2-b.top-b.height/2),fieldDy:Math.abs(p.top+p.height/2-b.top-b.height/2)};});
  expect(centered.dx).toBeLessThan(1);expect(centered.dy).toBeLessThan(1);expect(centered.fieldDy).toBeLessThan(1);
  await toggle.click();await expect(form.getByPlaceholder('Your demo password')).toHaveAttribute('type','text');
  if(browserName==='chromium') {
    const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument');
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.discovery-signin input[type="email"]'});
    await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:['autofill']});
    const style=await form.getByRole('textbox',{name:'Email address',exact:true}).evaluate(node=>{const computed=getComputedStyle(node);return{autofill:node.matches(':autofill'),clip:computed.backgroundClip,fill:computed.getPropertyValue('-webkit-text-fill-color'),border:computed.borderWidth};});
    // The wrapper owns the surface now: autofill paint is clipped to the text
    // instead of covering it with an opaque inset shadow.
    expect(style.autofill).toBe(true);expect(style.clip).toBe('text');expect(style.fill).not.toBe('');expect(style.border).toBe('0px');await cdp.detach();
  }
});

test('image, cropper and audio previews reference the site-owned media',async({page,request})=>{
  const assets=['/images/pimolu-studio.webp','/images/pimolu-atmosphere.webp','/images/pimolu-avatar.svg','/sounds/action-game.mp3','/sounds/pixel-art-game.mp3'];
  for(const asset of assets)expect((await request.get(asset)).ok()).toBe(true);
  for(const route of ['/preview/image','/preview/image-cropper','/preview/aspect-ratio','/preview/prose','/preview/audio-player','/preview/audio-player?example=example-2','/preview/audio-player?example=example-3','/preview/audio-player?example=example-4']){
    await page.goto(route);await page.locator('[data-example-hydrated="true"]').waitFor();
    const sources=await page.locator('.example-ready img,.example-ready audio').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('src')));
    expect(sources.length).toBeGreaterThan(0);
    for(const src of sources.filter(Boolean))expect(src).toMatch(/^\/(images|sounds)\//);
  }
});
