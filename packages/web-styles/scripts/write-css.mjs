import { readFile, writeFile, rename, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

/** Preserve the previous complete file while Windows readers release their locks. */
export async function writeCss(destination, contents, overrides = {}) {
  const io = { readFile, writeFile, rename, rm, delay, ...overrides };
  try {
    if (Buffer.from(await io.readFile(destination)).equals(Buffer.from(contents))) return;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const temporary = `${destination}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await io.writeFile(temporary, contents, { flag: "wx" });
    for (let attempt = 0; ; attempt++) {
      try {
        await io.rename(temporary, destination);
        break;
      } catch (error) {
        if (!["EPERM", "EACCES", "EBUSY"].includes(error.code) || attempt >= 7) {
          error.message += `\nCould not replace ${destination}. The previous stylesheet is preserved. Close processes locking this file and retry pnpm build:web-styles.`;
          throw error;
        }
        await io.delay(Math.min(50 * 2 ** attempt, 800));
      }
    }
  } finally {
    await io.rm(temporary, { force: true, maxRetries: 5, retryDelay: 100 });
  }
}
