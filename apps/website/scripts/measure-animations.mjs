import { chromium, firefox, webkit, expect } from "@playwright/test";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import fs from "node:fs/promises";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"../../..");
const output=path.join(root,"apps/website/.artifacts/animation-measurements");
await fs.mkdir(output,{recursive:true});
const url=process.env.PIMOLU_BENCHMARK_URL??"http://localhost:4173";
const results=[];
for(const [browserName,launcher] of Object.entries({chromium,firefox,webkit})) {
 const browser=await launcher.launch();
 try {
  for(const reduced of [false,true]) {
   const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:reduced?"reduce":"no-preference"});
   const errors=[];page.on("pageerror",error=>errors.push(error.message));
   await page.goto(url+"/#/motion-integration");
   const sample=page.getByTestId("animation-comparison");
   await expect(sample).toBeVisible();
   for(const engine of ["css","motion"]) {
    await page.getByRole("button",{name:engine==="css"?"Compare CSS":"Compare Motion",exact:true}).click();
    await expect(sample).toHaveAttribute("data-engine",engine);
    for(const target of ["Button","Dialog","Drawer","Tabs","Accordion"]) {
     await page.evaluate(()=>{
      window.__motionFrames=[];window.__motionSampling=true;
      let last=performance.now();
      const tick=time=>{if(!window.__motionSampling)return;window.__motionFrames.push(time-last);last=time;requestAnimationFrame(tick);};
      requestAnimationFrame(tick);
     });
     const start=performance.now();
     for(let repeat=0;repeat<3;repeat++) {
      if(target==="Button") {
       const button=sample.getByRole("button",{name:"Benchmark Button",exact:true});
       if(engine==="motion")await expect(button).toHaveCSS("transition-property","none");
       await button.hover();await button.click();
      } else if(target==="Dialog"||target==="Drawer") {
       const trigger=sample.getByRole("button",{name:`Benchmark ${target}`,exact:true});
       await trigger.click();
       const panel=page.getByRole("dialog",{name:target==="Dialog"?"Comparison dialog":"Comparison drawer"});
       await expect(panel).toBeVisible();
       await expect.poll(()=>panel.evaluate(node=>node.contains(document.activeElement))).toBe(true);
       await page.keyboard.press("Escape");
       await expect(page.locator(target==="Dialog"?".pimolu-dialog__content":".pimolu-drawer__content")).toHaveCount(0);
       await expect(trigger).toBeFocused();
      } else if(target==="Tabs") {
       await sample.getByRole("tab",{name:"Benchmark tab two"}).click();
       await expect(sample.getByRole("tabpanel",{name:"Benchmark tab two"})).toBeVisible();
       await sample.getByRole("tab",{name:"Benchmark tab one"}).click();
      } else {
       const trigger=sample.getByRole("button",{name:"Benchmark Accordion"});
       await trigger.click();await expect(trigger).toHaveAttribute("aria-expanded","true");
       await trigger.click();await expect(trigger).toHaveAttribute("aria-expanded","false");
      }
     }
     const elapsed=performance.now()-start;
     const frames=await page.evaluate(()=>{window.__motionSampling=false;return window.__motionFrames.filter(value=>value>0).sort((a,b)=>a-b);});
     results.push({browser:browserName,engine,reduced,target,cycles:3,elapsedMs:Math.round(elapsed),frames:frames.length,p95FrameMs:frames[Math.floor(frames.length*.95)]??null,maxFrameMs:frames.at(-1)??null,framesOver25ms:frames.filter(value=>value>25).length});
    }
    const before=await sample.getByRole("status").innerText();
    await sample.getByRole("button",{name:"Move Review up"}).click();
    await expect(sample.getByRole("status")).not.toHaveText(before);
   }
   expect(errors).toEqual([]);
   await page.screenshot({path:path.join(output,`${browserName}-${reduced?"reduced":"normal"}.png`),fullPage:true});
   await page.close();
  }
 } finally {await browser.close();}
 console.log(`${browserName}: CSS/Motion, five components, mobile, reduced motion, keyboard and focus checked`);
}
const require=createRequire(path.join(root,"registry/react/package.json"));
const {build}=require("esbuild");
const bundles={};
for(const [name,source] of Object.entries({css:'import {Button} from "@pimolu/react"; console.log(Button);',motion:'import {MotionButton} from "@pimolu/motion"; console.log(MotionButton);'})) {
 const result=await build({stdin:{contents:source,resolveDir:path.join(root,"apps/playground")},bundle:true,write:false,minify:true,format:"esm",external:["react","react/*","react-dom","react-dom/*"]});
 const bytes=result.outputFiles[0].contents;
 bundles[name]={bytes:bytes.length,gzipBytes:gzipSync(bytes).length};
}
await fs.writeFile(path.join(output,"results.json"),JSON.stringify({environment:"Headless browsers on this workstation, 390x844. RAF intervals include automation and system contention; not a production FPS benchmark. Three cycles per target; bundle fixtures exclude React equally.",results,bundles},null,2));
console.log(JSON.stringify(bundles));
