import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readText = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("DonationCard", () => {
  it("uses subtle styling with amber accent", () => {
    const src = readText("app/components/ui/DonationCard.tsx");
    expect(src).toContain("text-amber-300");
    expect(src).not.toContain("bg-blue-500/15");
  });
});
