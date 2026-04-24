import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readText = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("login page", () => {
  it("uses amber premium background accents", () => {
    const src = readText("app/[locale]/(auth)/login/page.tsx");
    expect(src).toContain("bg-amber-500/10");
  });
});
