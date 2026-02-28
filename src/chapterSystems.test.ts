import { describe, expect, it } from "vitest";
import { CHAPTER_SYSTEMS } from "./chapters/chapterSystems";

describe("chapter system registry", () => {
  it("registers all 17 chapter systems", () => {
    expect(CHAPTER_SYSTEMS).toHaveLength(17);

    const ids = CHAPTER_SYSTEMS.map((chapter) => chapter.id);
    expect(new Set(ids).size).toBe(17);
  });

  it("keeps chapter one live and all others at least scaffolded", () => {
    expect(CHAPTER_SYSTEMS[0]?.status).toBe("ready");

    for (let index = 1; index < CHAPTER_SYSTEMS.length; index += 1) {
      expect(CHAPTER_SYSTEMS[index]?.status).toBe("scaffolded");
    }
  });
});
