import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readText = (file: string) => readFileSync(join(process.cwd(), file), "utf8");

describe("RecordingSteps", () => {
  it("uses accent CTA and amber gradient headline", () => {
    const src = readText("app/components/ui/RecordingSteps.tsx");
    expect(src).toContain('variant="accent"');
    expect(src).toContain("to-amber-300");
  });
});
