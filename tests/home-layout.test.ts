import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readText = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("home layout", () => {
  it("uses FeaturesStrip instead of HeroScrollMask", () => {
    const page = readText("app/[locale]/(home)/page.tsx");
    expect(page).toContain("FeaturesStrip");
    expect(page).not.toContain("HeroScrollMask");
  });
});
