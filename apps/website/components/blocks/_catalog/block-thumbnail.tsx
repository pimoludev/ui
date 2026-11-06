"use client";

import { Image } from "@pimolu/react";
import type { Block } from "@/content/blocks";

/** Real composition captures. Regenerate with pnpm blocks:capture after editing a block. */
export function BlockThumbnail({ slug }: { slug: Block["slug"] }) {
  return <div className={"block-thumbnail block-thumbnail--" + slug} aria-hidden="true" inert>
    <div className="block-capture-pair">
      {(["light", "dark"] as const).map((theme) => <Image
        key={theme}
        src={"/block-previews/" + slug + "-" + theme + ".webp"}
        alt=""
        width={900}
        height={675}
        loading="lazy"
        fit="contain"
        rounded="none"
        showSkeleton={false}
        containerClassName={"block-capture-" + theme}
      />)}
    </div>
  </div>;
}
