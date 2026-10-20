import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QRCode, encodeQrMatrix } from "./qr-code";

/*
 * Reference matrix produced by the Python `qrcode` library for
 * "HELLO WORLD" in byte mode, level L, mask 3. Keeping one complete
 * vector locks placement, Reed-Solomon, masks and format bits.
 */
const HELLO_WORLD_L3 = [
  "111111101011101111111",
  "100000100011001000001",
  "101110101101001011101",
  "101110101100101011101",
  "101110101001001011101",
  "100000100111101000001",
  "111111101010101111111",
  "000000000001100000000",
  "111100101111110011101",
  "010111010011111101100",
  "111100101001010100011",
  "111111010001000101010",
  "111000110100110000101",
  "000000001101001100101",
  "111111100011111110000",
  "100000100000010101111",
  "101110100010101001000",
  "101110101010001001110",
  "101110101110100100100",
  "100000101101011110001",
  "111111101001010100000",
];

function rowsOf(matrix: boolean[][]) {
  return matrix.map((row) =>
    row.map((value) => (value ? "1" : "0")).join("")
  );
}

describe("QR encoder", () => {
  it("matches a reference matrix", () => {
    const matrix = encodeQrMatrix(
      "HELLO WORLD",
      "L",
      3
    );

    expect(matrix.version).toBe(1);
    expect(matrix.size).toBe(21);
    expect(matrix.mask).toBe(3);
    expect(rowsOf(matrix.modules)).toEqual(
      HELLO_WORLD_L3
    );
  });

  it("is deterministic for the same input", () => {
    const first = encodeQrMatrix("Hello, Pimolu!");
    const second = encodeQrMatrix(
      "Hello, Pimolu!"
    );

    expect(second).toEqual(first);
    expect(first.version).toBe(1);
    expect(first.mask).toBeGreaterThanOrEqual(0);
    expect(first.mask).toBeLessThanOrEqual(7);
  });

  it("draws the finders, timing patterns and dark module", () => {
    const matrix = encodeQrMatrix("Hello, Pimolu!");
    const { modules, size } = matrix;

    /* Top-left finder: 7×7 ring with a 3×3 core. */
    for (let index = 0; index < 7; index += 1) {
      expect(modules[0][index]).toBe(true);
      expect(modules[index][0]).toBe(true);
      expect(modules[6][index]).toBe(true);
      expect(modules[index][6]).toBe(true);
    }

    expect(modules[1][1]).toBe(false);
    expect(modules[2][2]).toBe(true);

    /* Timing patterns alternate at row/column 6. */
    for (let index = 8; index < size - 8; index += 1) {
      expect(modules[6][index]).toBe(
        index % 2 === 0
      );
      expect(modules[index][6]).toBe(
        index % 2 === 0
      );
    }

    /* The dark module is always at (row size-8, column 8). */
    expect(modules[size - 8][8]).toBe(true);
  });

  it("selects versions from the payload length", () => {
    const small = encodeQrMatrix(
      "Hello, Pimolu!"
    );

    expect(small.version).toBe(1);

    const medium = encodeQrMatrix(
      "a".repeat(50),
      "H"
    );

    expect(medium.version).toBe(6);
    expect(medium.size).toBe(41);

    const maximum = encodeQrMatrix(
      "z".repeat(119),
      "H"
    );

    expect(maximum.version).toBe(10);
    expect(maximum.size).toBe(57);
  });

  it("encodes non-ASCII text in UTF-8", () => {
    const matrix = encodeQrMatrix(
      "Café — 日本語 — 🎨",
      "M",
      1
    );

    expect(matrix.version).toBe(3);
    expect(matrix.size).toBe(29);
  });

  it("rejects empty, oversized and invalid inputs", () => {
    expect(() => encodeQrMatrix("")).toThrow(
      /cannot be empty/
    );

    expect(() =>
      encodeQrMatrix("a".repeat(120), "H")
    ).toThrow(/too long/);

    expect(() =>
      encodeQrMatrix("a".repeat(272), "L")
    ).toThrow(/too long/);

    expect(() =>
      encodeQrMatrix("hello", "M", 8)
    ).toThrow(/mask/);

    expect(() =>
      encodeQrMatrix("hello", "M", -1)
    ).toThrow(/mask/);
  });

  it("honors an explicit mask", () => {
    for (let mask = 0; mask < 8; mask += 1) {
      expect(
        encodeQrMatrix("Hello", "Q", mask).mask
      ).toBe(mask);
    }
  });
});

describe("Pimolu QRCode", () => {
  it("renders an accessible SVG with a quiet zone", () => {
    render(<QRCode value="Hello, Pimolu!" />);

    const svg = screen.getByRole("img", {
      name: "QR code",
    });

    expect(svg).toHaveAttribute("width", "160");
    expect(svg).toHaveAttribute("height", "160");

    /* Version 1 is 21 modules; the default quiet zone is 4. */
    expect(svg).toHaveAttribute(
      "viewBox",
      "0 0 29 29"
    );

    expect(svg).toHaveAttribute("data-version", "1");
    expect(svg).toHaveAttribute("data-level", "M");
    expect(svg).toHaveClass("pimolu-qr-code");

    const background = svg.querySelector(
      ".pimolu-qr-code__background"
    );

    expect(background).toHaveAttribute(
      "fill",
      "#ffffff"
    );

    const path = svg.querySelector(
      ".pimolu-qr-code__modules"
    );

    expect(path).toHaveAttribute(
      "fill",
      "#000000"
    );

    expect(path).toHaveAttribute(
      "shape-rendering",
      "crispEdges"
    );
  });

  it("writes one path command per dark module", () => {
    const matrix = encodeQrMatrix("Pimolu");

    const darkCount = matrix.modules.reduce(
      (total, row) =>
        total +
        row.filter((value) => value).length,
      0
    );

    render(<QRCode value="Pimolu" />);

    const path = screen
      .getByRole("img")
      .querySelector(
        ".pimolu-qr-code__modules"
      )!;

    const commands = path
      .getAttribute("d")!
      .match(/M/g);

    expect(commands).toHaveLength(darkCount);
  });

  it("is deterministic between renders", () => {
    const { unmount } = render(
      <QRCode value="Hello, Pimolu!" />
    );

    const first = screen
      .getByRole("img")
      .querySelector(
        ".pimolu-qr-code__modules"
      )!
      .getAttribute("d");

    unmount();

    render(<QRCode value="Hello, Pimolu!" />);

    const second = screen
      .getByRole("img")
      .querySelector(
        ".pimolu-qr-code__modules"
      )!
      .getAttribute("d");

    expect(second).toBe(first);
  });

  it("applies size, level, margin and colors", () => {
    render(
      <QRCode
        value="Hello, Pimolu!"
        size={220}
        level="H"
        margin={2}
        darkColor="#1e1b4b"
        lightColor="#f8fafc"
        aria-label="Scan this code"
      />
    );

    const svg = screen.getByRole("img", {
      name: "Scan this code",
    });

    expect(svg).toHaveAttribute("width", "220");
    expect(svg).toHaveAttribute("height", "220");
    expect(svg).toHaveAttribute("data-level", "H");

    const version = Number(
      svg.getAttribute("data-version")
    );

    const modules = 17 + 4 * version;

    expect(svg).toHaveAttribute(
      "viewBox",
      `0 0 ${modules + 4} ${modules + 4}`
    );

    expect(
      svg.querySelector(
        ".pimolu-qr-code__background"
      )
    ).toHaveAttribute("fill", "#f8fafc");

    expect(
      svg.querySelector(
        ".pimolu-qr-code__modules"
      )
    ).toHaveAttribute("fill", "#1e1b4b");
  });

  it("uses title as a tooltip and accessible name", () => {
    render(
      <QRCode
        value="https://pimolu.dev"
        title="Pimolu website"
      />
    );

    const svg = screen.getByRole("img", {
      name: "Pimolu website",
    });

    expect(svg.querySelector("title")).toHaveTextContent(
      "Pimolu website"
    );
  });

  it("accepts a forced mask and a class", () => {
    render(
      <QRCode
        value="Hello"
        mask={6}
        className="custom-qr"
      />
    );

    const svg = screen.getByRole("img");

    expect(svg).toHaveAttribute("data-mask", "6");
    expect(svg).toHaveClass(
      "pimolu-qr-code",
      "custom-qr"
    );
  });
});
