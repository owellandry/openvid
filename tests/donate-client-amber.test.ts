import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readText = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("DonateClient", () => {
  it("uses amber styling for selected method", () => {
    const src = readText("app/[locale]/(home)/donate/DonateClient.tsx");
    expect(src).toContain("border-amber-500/40");
  });
});
