import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readText = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("not found page", () => {
  it("uses amber radial background", () => {
    const src = readText("app/[locale]/not-found.tsx");
    expect(src).toContain("rgba(245,158,11,0.10)");
  });
});
