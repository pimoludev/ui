"use client";

import { useMemo } from "react";

import type {
  PimoluQRCodeLevel,
  PimoluQRCodeMatrix,
  PimoluQRCodeProps,
} from "./qr-code.types";

/* =========================================
   TABLES
========================================= */

interface BlockSpec {
  ecCodewords: number;
  groups: Array<[count: number, dataCodewords: number]>;
}

/**
 * Reed-Solomon block structure for versions 1–10. Data rows are ordered by
 * version; `groups` are [block count, data codewords per block].
 */
const BLOCKS: Record<PimoluQRCodeLevel, BlockSpec[]> = {
  L: [
    { ecCodewords: 7, groups: [[1, 19]] },
    { ecCodewords: 10, groups: [[1, 34]] },
    { ecCodewords: 15, groups: [[1, 55]] },
    { ecCodewords: 20, groups: [[1, 80]] },
    { ecCodewords: 26, groups: [[1, 108]] },
    { ecCodewords: 18, groups: [[2, 68]] },
    { ecCodewords: 20, groups: [[2, 78]] },
    { ecCodewords: 24, groups: [[2, 97]] },
    { ecCodewords: 30, groups: [[2, 116]] },
    {
      ecCodewords: 18,
      groups: [
        [2, 68],
        [2, 69],
      ],
    },
  ],
  M: [
    { ecCodewords: 10, groups: [[1, 16]] },
    { ecCodewords: 16, groups: [[1, 28]] },
    { ecCodewords: 26, groups: [[1, 44]] },
    { ecCodewords: 18, groups: [[2, 32]] },
    { ecCodewords: 24, groups: [[2, 43]] },
    { ecCodewords: 16, groups: [[4, 27]] },
    { ecCodewords: 18, groups: [[4, 31]] },
    {
      ecCodewords: 22,
      groups: [
        [2, 38],
        [2, 39],
      ],
    },
    {
      ecCodewords: 22,
      groups: [
        [3, 36],
        [2, 37],
      ],
    },
    {
      ecCodewords: 26,
      groups: [
        [4, 43],
        [1, 44],
      ],
    },
  ],
  Q: [
    { ecCodewords: 13, groups: [[1, 13]] },
    { ecCodewords: 22, groups: [[1, 22]] },
    { ecCodewords: 18, groups: [[2, 17]] },
    { ecCodewords: 26, groups: [[2, 24]] },
    {
      ecCodewords: 18,
      groups: [
        [2, 15],
        [2, 16],
      ],
    },
    { ecCodewords: 24, groups: [[4, 19]] },
    {
      ecCodewords: 18,
      groups: [
        [2, 14],
        [4, 15],
      ],
    },
    {
      ecCodewords: 22,
      groups: [
        [4, 18],
        [2, 19],
      ],
    },
    {
      ecCodewords: 20,
      groups: [
        [4, 16],
        [4, 17],
      ],
    },
    {
      ecCodewords: 24,
      groups: [
        [6, 19],
        [2, 20],
      ],
    },
  ],
  H: [
    { ecCodewords: 17, groups: [[1, 9]] },
    { ecCodewords: 28, groups: [[1, 16]] },
    { ecCodewords: 22, groups: [[2, 13]] },
    { ecCodewords: 16, groups: [[4, 9]] },
    {
      ecCodewords: 22,
      groups: [
        [2, 11],
        [2, 12],
      ],
    },
    { ecCodewords: 28, groups: [[4, 15]] },
    {
      ecCodewords: 26,
      groups: [
        [4, 13],
        [1, 14],
      ],
    },
    {
      ecCodewords: 26,
      groups: [
        [4, 14],
        [2, 15],
      ],
    },
    {
      ecCodewords: 24,
      groups: [
        [4, 12],
        [4, 13],
      ],
    },
    {
      ecCodewords: 28,
      groups: [
        [6, 15],
        [2, 16],
      ],
    },
  ],
};

const ALIGNMENT_POSITIONS: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const EC_LEVEL_BITS: Record<
  PimoluQRCodeLevel,
  number
> = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
};

const MAX_VERSION = 10;

/* =========================================
   GALOIS FIELD
========================================= */

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

{
  let value = 1;

  for (let index = 0; index < 255; index += 1) {
    GF_EXP[index] = value;
    GF_LOG[value] = index;

    value <<= 1;

    if (value & 0x100) {
      value ^= 0x11d;
    }
  }

  for (let index = 255; index < 512; index += 1) {
    GF_EXP[index] = GF_EXP[index - 255];
  }
}

function gfMultiply(left: number, right: number) {
  if (left === 0 || right === 0) {
    return 0;
  }

  return GF_EXP[GF_LOG[left] + GF_LOG[right]];
}

function generatorPolynomial(degree: number) {
  let polynomial = [1];

  for (let index = 0; index < degree; index += 1) {
    const factor = GF_EXP[index];
    const next = new Array(
      polynomial.length + 1
    ).fill(0) as number[];

    for (
      let term = 0;
      term < polynomial.length;
      term += 1
    ) {
      next[term] ^= polynomial[term];

      next[term + 1] ^= gfMultiply(
        polynomial[term],
        factor
      );
    }

    polynomial = next;
  }

  return polynomial;
}

function reedSolomon(
  data: number[],
  ecCodewords: number
) {
  const generator = generatorPolynomial(ecCodewords);

  const message = [
    ...data,
    ...new Array(ecCodewords).fill(0),
  ] as number[];

  for (let index = 0; index < data.length; index += 1) {
    const factor = message[index];

    if (factor === 0) continue;

    for (
      let term = 0;
      term < generator.length;
      term += 1
    ) {
      message[index + term] ^= gfMultiply(
        generator[term],
        factor
      );
    }
  }

  return message.slice(data.length);
}

/* =========================================
   BYTES AND BITS
========================================= */

function utf8Bytes(value: string) {
  const bytes: number[] = [];

  for (const character of value) {
    const code = character.codePointAt(0)!;

    if (code <= 0x7f) {
      bytes.push(code);
    } else if (code <= 0x7ff) {
      bytes.push(
        0xc0 | (code >> 6),
        0x80 | (code & 0x3f)
      );
    } else if (code <= 0xffff) {
      bytes.push(
        0xe0 | (code >> 12),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }

  return bytes;
}

function dataCodewordCount(spec: BlockSpec) {
  return spec.groups.reduce(
    (total, [count, size]) =>
      total + count * size,
    0
  );
}

function pickVersion(
  byteLength: number,
  level: PimoluQRCodeLevel
) {
  for (let version = 1; version <= MAX_VERSION; version += 1) {
    const spec = BLOCKS[level][version - 1];

    const countBits = version < 10 ? 8 : 16;

    const required =
      4 + countBits + byteLength * 8;

    if (
      required <=
      dataCodewordCount(spec) * 8
    ) {
      return { version, spec };
    }
  }

  const max = Math.floor(
    (dataCodewordCount(
      BLOCKS[level][MAX_VERSION - 1]
    ) *
      8 -
      20) /
      8
  );

  throw new Error(
    `QRCode value is too long for versions 1-${MAX_VERSION}: ` +
      `${byteLength} UTF-8 bytes at level ${level}, maximum ${max}.`
  );
}

function makeDataCodewords(
  bytes: number[],
  version: number,
  spec: BlockSpec
) {
  const total = dataCodewordCount(spec);
  const capacity = total * 8;

  const bits: number[] = [];

  function append(value: number, length: number) {
    for (let index = length - 1; index >= 0; index -= 1) {
      bits.push((value >>> index) & 1);
    }
  }

  append(0b0100, 4);
  append(bytes.length, version < 10 ? 8 : 16);

  for (const byte of bytes) {
    append(byte, 8);
  }

  append(0, Math.min(4, capacity - bits.length));

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const codewords: number[] = [];

  for (let index = 0; index < bits.length; index += 8) {
    let byte = 0;

    for (let offset = 0; offset < 8; offset += 1) {
      byte = (byte << 1) | bits[index + offset];
    }

    codewords.push(byte);
  }

  let pad = 0;

  while (codewords.length < total) {
    codewords.push(pad % 2 === 0 ? 0xec : 0x11);
    pad += 1;
  }

  return codewords;
}

function interleave(
  data: number[],
  spec: BlockSpec
) {
  const dataBlocks: number[][] = [];

  let offset = 0;

  for (const [count, size] of spec.groups) {
    for (let block = 0; block < count; block += 1) {
      dataBlocks.push(data.slice(offset, offset + size));
      offset += size;
    }
  }

  const ecBlocks = dataBlocks.map((block) =>
    reedSolomon(block, spec.ecCodewords)
  );

  const result: number[] = [];

  const maxData = Math.max(
    ...dataBlocks.map((block) => block.length)
  );

  for (let index = 0; index < maxData; index += 1) {
    for (const block of dataBlocks) {
      if (index < block.length) {
        result.push(block[index]);
      }
    }
  }

  for (
    let index = 0;
    index < spec.ecCodewords;
    index += 1
  ) {
    for (const block of ecBlocks) {
      result.push(block[index]);
    }
  }

  return result;
}

/* =========================================
   MATRIX
========================================= */

function maskCondition(
  mask: number,
  x: number,
  y: number
) {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (
        (Math.floor(y / 2) +
          Math.floor(x / 3)) %
          2 ===
        0
      );
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (
        (((x * y) % 2) + ((x * y) % 3)) % 2 ===
        0
      );
    case 7:
      return (
        (((x + y) % 2) + ((x * y) % 3)) % 2 ===
        0
      );
    default:
      return false;
  }
}

function formatBits(
  level: PimoluQRCodeLevel,
  mask: number
) {
  const data = (EC_LEVEL_BITS[level] << 3) | mask;

  let remainder = data << 10;

  for (let bit = 14; bit >= 10; bit -= 1) {
    if (((remainder >>> bit) & 1) !== 0) {
      remainder ^= 0x537 << (bit - 10);
    }
  }

  return ((data << 10) | (remainder & 0x3ff)) ^ 0x5412;
}

function versionBits(version: number) {
  let remainder = version << 12;

  for (let bit = 17; bit >= 12; bit -= 1) {
    if (((remainder >>> bit) & 1) !== 0) {
      remainder ^= 0x1f25 << (bit - 12);
    }
  }

  return (version << 12) | (remainder & 0xfff);
}

const FINDER_PATTERN = [
  true,
  false,
  true,
  true,
  true,
  false,
  true,
  false,
  false,
  false,
  false,
];

const REVERSED_FINDER_PATTERN = [
  ...FINDER_PATTERN,
].reverse();

function penaltyScore(
  modules: boolean[][],
  size: number
) {
  let penalty = 0;

  /* Rule 1: five or more same-colored modules in a row or column. */

  for (let axis = 0; axis < 2; axis += 1) {
    for (let line = 0; line < size; line += 1) {
      let runLength = 1;

      for (let index = 1; index < size; index += 1) {
        const previous =
          axis === 0
            ? modules[line][index - 1]
            : modules[index - 1][line];

        const current =
          axis === 0
            ? modules[line][index]
            : modules[index][line];

        if (current === previous) {
          runLength += 1;
        } else {
          if (runLength >= 5) {
            penalty += 3 + runLength - 5;
          }

          runLength = 1;
        }
      }

      if (runLength >= 5) {
        penalty += 3 + runLength - 5;
      }
    }
  }

  /* Rule 2: 2×2 blocks of one color. */

  for (let row = 0; row < size - 1; row += 1) {
    for (
      let column = 0;
      column < size - 1;
      column += 1
    ) {
      const value = modules[row][column];

      if (
        modules[row][column + 1] === value &&
        modules[row + 1][column] === value &&
        modules[row + 1][column + 1] === value
      ) {
        penalty += 3;
      }
    }
  }

  /* Rule 3: finder-like 1:1:3:1:1 patterns with four light modules. */

  function matches(
    getter: (index: number) => boolean,
    start: number,
    pattern: boolean[]
  ) {
    for (
      let offset = 0;
      offset < pattern.length;
      offset += 1
    ) {
      if (getter(start + offset) !== pattern[offset]) {
        return false;
      }
    }

    return true;
  }

  for (const pattern of [
    FINDER_PATTERN,
    REVERSED_FINDER_PATTERN,
  ]) {
    for (let row = 0; row < size; row += 1) {
      for (
        let column = 0;
        column <= size - pattern.length;
        column += 1
      ) {
        if (
          matches(
            (index) => modules[row][index],
            column,
            pattern
          )
        ) {
          penalty += 40;
        }
      }
    }

    for (let column = 0; column < size; column += 1) {
      for (
        let row = 0;
        row <= size - pattern.length;
        row += 1
      ) {
        if (
          matches(
            (index) => modules[index][column],
            row,
            pattern
          )
        ) {
          penalty += 40;
        }
      }
    }
  }

  /* Rule 4: proportion of dark modules. */

  let dark = 0;

  for (let row = 0; row < size; row += 1) {
    for (
      let column = 0;
      column < size;
      column += 1
    ) {
      if (modules[row][column]) {
        dark += 1;
      }
    }
  }

  const total = size * size;

  penalty +=
    Math.floor(
      Math.abs(dark * 20 - total * 10) / total
    ) * 10;

  return penalty;
}

function buildMatrix(
  version: number,
  level: PimoluQRCodeLevel,
  codewords: number[],
  requestedMask?: number
) {
  const size = 17 + version * 4;

  const modules: boolean[][] = Array.from(
    { length: size },
    () => new Array(size).fill(false)
  );

  const isFunction: boolean[][] = Array.from(
    { length: size },
    () => new Array(size).fill(false)
  );

  function set(
    x: number,
    y: number,
    dark: boolean
  ) {
    if (
      x < 0 ||
      y < 0 ||
      x >= size ||
      y >= size
    ) {
      return;
    }

    modules[y][x] = dark;
    isFunction[y][x] = true;
  }

  /* Finder patterns and separators. */

  for (const [centerX, centerY] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ] as const) {
    for (let deltaY = -4; deltaY <= 4; deltaY += 1) {
      for (
        let deltaX = -4;
        deltaX <= 4;
        deltaX += 1
      ) {
        const distance = Math.max(
          Math.abs(deltaX),
          Math.abs(deltaY)
        );

        set(
          centerX + deltaX,
          centerY + deltaY,
          distance !== 2 && distance !== 4
        );
      }
    }
  }

  /* Timing patterns. */

  for (let index = 8; index < size - 8; index += 1) {
    set(6, index, index % 2 === 0);
    set(index, 6, index % 2 === 0);
  }

  /* Alignment patterns. */

  const positions =
    ALIGNMENT_POSITIONS[version - 1] ?? [];

  for (const centerRow of positions) {
    for (const centerColumn of positions) {
      if (
        (centerRow <= 7 && centerColumn <= 7) ||
        (centerRow <= 7 &&
          centerColumn >= size - 8) ||
        (centerRow >= size - 8 &&
          centerColumn <= 7)
      ) {
        continue;
      }

      for (let deltaY = -2; deltaY <= 2; deltaY += 1) {
        for (
          let deltaX = -2;
          deltaX <= 2;
          deltaX += 1
        ) {
          set(
            centerColumn + deltaX,
            centerRow + deltaY,
            Math.max(
              Math.abs(deltaX),
              Math.abs(deltaY)
            ) !== 1
          );
        }
      }
    }
  }

  /* Reserved format areas and the fixed dark module. */

  for (let index = 0; index <= 5; index += 1) {
    set(8, index, false);
  }

  set(8, 7, false);
  set(8, 8, false);
  set(7, 8, false);

  for (let index = 9; index < 15; index += 1) {
    set(14 - index, 8, false);
  }

  for (let index = 0; index < 8; index += 1) {
    set(size - 1 - index, 8, false);
  }

  for (let index = 8; index < 15; index += 1) {
    set(8, size - 15 + index, false);
  }

  set(8, size - 8, true);

  /* Version information for versions 7 and above. */

  if (version >= 7) {
    const bits = versionBits(version);

    for (let index = 0; index < 18; index += 1) {
      const dark = ((bits >>> index) & 1) !== 0;

      const first = size - 11 + (index % 3);
      const second = Math.floor(index / 3);

      set(first, second, dark);
      set(second, first, dark);
    }
  }

  /* Data modules, in the two-column zigzag from the bottom right. */

  const dataBits: boolean[] = [];

  for (const codeword of codewords) {
    for (let bit = 7; bit >= 0; bit -= 1) {
      dataBits.push(
        ((codeword >>> bit) & 1) !== 0
      );
    }
  }

  let dataIndex = 0;

  for (
    let right = size - 1;
    right >= 1;
    right -= 2
  ) {
    if (right === 6) {
      right = 5;
    }

    const upward = ((right + 1) & 2) === 0;

    for (let vertical = 0; vertical < size; vertical += 1) {
      for (let offset = 0; offset < 2; offset += 1) {
        const x = right - offset;
        const y = upward
          ? size - 1 - vertical
          : vertical;

        if (
          !isFunction[y][x] &&
          dataIndex < dataBits.length
        ) {
          modules[y][x] = dataBits[dataIndex];
          dataIndex += 1;
        }
      }
    }
  }

  function applyMask(mask: number) {
    for (let row = 0; row < size; row += 1) {
      for (
        let column = 0;
        column < size;
        column += 1
      ) {
        if (
          !isFunction[row][column] &&
          maskCondition(mask, column, row)
        ) {
          modules[row][column] =
            !modules[row][column];
        }
      }
    }
  }

  function placeFormat(mask: number) {
    const bits = formatBits(level, mask);

    const dark = (index: number) =>
      ((bits >>> index) & 1) !== 0;

    for (let index = 0; index <= 5; index += 1) {
      set(8, index, dark(index));
    }

    set(8, 7, dark(6));
    set(8, 8, dark(7));
    set(7, 8, dark(8));

    for (let index = 9; index < 15; index += 1) {
      set(14 - index, 8, dark(index));
    }

    for (let index = 0; index < 8; index += 1) {
      set(size - 1 - index, 8, dark(index));
    }

    for (let index = 8; index < 15; index += 1) {
      set(8, size - 15 + index, dark(index));
    }

    set(8, size - 8, true);
  }

  let selectedMask = requestedMask ?? 0;

  if (requestedMask === undefined) {
    let best = Number.POSITIVE_INFINITY;

    for (let mask = 0; mask < 8; mask += 1) {
      applyMask(mask);
      placeFormat(mask);

      const score = penaltyScore(modules, size);

      if (score < best) {
        best = score;
        selectedMask = mask;
      }

      applyMask(mask);
    }
  }

  applyMask(selectedMask);
  placeFormat(selectedMask);

  return {
    size,
    mask: selectedMask,
    modules,
  };
}

/* =========================================
   PUBLIC ENCODER
========================================= */

/**
 * Offline byte-mode QR encoder for versions 1–10. Strings are encoded as
 * UTF-8; the matrix contains no quiet zone. Throws for an empty value or a
 * payload that does not fit version 10 at the requested level.
 */
export function encodeQrMatrix(
  value: string,
  level: PimoluQRCodeLevel = "M",
  requestedMask?: number
): PimoluQRCodeMatrix {
  if (value.length === 0) {
    throw new Error("QRCode value cannot be empty.");
  }

  const safeLevel: PimoluQRCodeLevel =
    level === "L" ||
    level === "M" ||
    level === "Q" ||
    level === "H"
      ? level
      : "M";

  if (requestedMask !== undefined) {
    if (
      !Number.isInteger(requestedMask) ||
      requestedMask < 0 ||
      requestedMask > 7
    ) {
      throw new Error(
        "QRCode mask must be an integer from 0 to 7."
      );
    }
  }

  const bytes = utf8Bytes(value);

  const { version, spec } = pickVersion(
    bytes.length,
    safeLevel
  );

  const data = makeDataCodewords(
    bytes,
    version,
    spec
  );

  const codewords = interleave(data, spec);

  const matrix = buildMatrix(
    version,
    safeLevel,
    codewords,
    requestedMask
  );

  return {
    size: matrix.size,
    version,
    mask: matrix.mask,
    level: safeLevel,
    modules: matrix.modules,
  };
}

/* =========================================
   COMPONENT
========================================= */

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function QRCode({
  value,
  size = 160,
  level = "M",
  darkColor = "#000000",
  lightColor = "#ffffff",
  margin = 4,
  mask,
  title,
  className,
  style,
  "aria-label": ariaLabel,
}: PimoluQRCodeProps) {
  const quietZone = Number.isFinite(margin)
    ? clamp(Math.trunc(margin), 0, 16)
    : 4;

  const { matrix, dimension, path } = useMemo(() => {
    const encoded = encodeQrMatrix(value, level, mask);

    const total = encoded.size + quietZone * 2;

    const parts: string[] = [];

    for (let row = 0; row < encoded.size; row += 1) {
      for (
        let column = 0;
        column < encoded.size;
        column += 1
      ) {
        if (encoded.modules[row][column]) {
          parts.push(
            `M${column + quietZone} ${row + quietZone}h1v1h-1z`
          );
        }
      }
    }

    return {
      matrix: encoded,
      dimension: total,
      path: parts.join(""),
    };
  }, [value, level, mask, quietZone]);

  const label = ariaLabel ?? title ?? "QR code";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={[
        "pimolu-qr-code",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      width={size}
      height={size}
      viewBox={`0 0 ${dimension} ${dimension}`}
      role="img"
      aria-label={label}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      data-version={matrix.version}
      data-mask={matrix.mask}
      data-level={matrix.level}
      style={{
        width: size,
        height: "auto",
        maxWidth: "100%",
        ...style,
      }}
    >
      {title ? <title>{title}</title> : null}

      <rect
        className="pimolu-qr-code__background"
        width={dimension}
        height={dimension}
        fill={lightColor}
      />

      <path
        className="pimolu-qr-code__modules"
        d={path}
        fill={darkColor}
        shapeRendering="crispEdges"
      />
    </svg>
  );
}

QRCode.displayName = "PimoluQRCode";
