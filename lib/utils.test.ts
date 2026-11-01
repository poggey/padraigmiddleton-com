import { describe, expect, it } from "vitest";
import { readingMinutes } from "./readingTime";
import { keepRangesTogether } from "./typography";

describe("readingMinutes", () => {
  it("counts body words at 230 a minute, ignoring frontmatter and components", () => {
    const words = Array.from({ length: 460 }, () => "word").join(" ");
    expect(readingMinutes(`---\ntitle: x\n---\n${words}\n<Chart id="a" />`)).toBe(2);
  });

  it("never returns less than one minute", () => {
    expect(readingMinutes("Short.")).toBe(1);
  });
});

describe("keepRangesTogether", () => {
  it("joins both sides of an en dash between numbers", () => {
    expect(keepRangesTogether("2027–28")).toBe("2027⁠–⁠28");
  });

  it("leaves dashes between words alone", () => {
    expect(keepRangesTogether("Ledoit–Wolf")).toBe("Ledoit–Wolf");
  });
});
