import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const readJson = (file: string) => JSON.parse(readFileSync(join(process.cwd(), file), "utf8"));

describe("i18n", () => {
  it("has header.upload key in es/en messages", () => {
    const es = readJson("messages/es.json");
    const en = readJson("messages/en.json");

    expect(es.header?.upload).toBeTruthy();
    expect(en.header?.upload).toBeTruthy();
  });
});
