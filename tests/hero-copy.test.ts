import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readJson = (file: string) => JSON.parse(readFileSync(join(process.cwd(), file), "utf8"));

describe("hero copy", () => {
  it("uses the premium clean headline", () => {
    const es = readJson("messages/es.json");
    const en = readJson("messages/en.json");

    expect(es.hero?.title).toBe("Crea demos profesionales");
    expect(es.hero?.titleHighlight).toBe("en 4K, directo en tu navegador");
    expect(en.hero?.title).toBe("Create professional demos");
    expect(en.hero?.titleHighlight).toBe("in 4K, right in your browser");
  });
});
