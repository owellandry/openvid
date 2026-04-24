import { describe, expect, it } from "vitest";
import { buttonVariants } from "../components/ui/button";

describe("buttonVariants", () => {
  it("includes amber styles for the accent variant", () => {
    const className = buttonVariants({ variant: "accent" });
    expect(className).toContain("bg-amber-500");
  });
});
