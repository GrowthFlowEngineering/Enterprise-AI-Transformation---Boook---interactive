import { describe, expect, it } from "vitest";
import {
  CHAPTER_ONE_SCENES,
  createChapterOneState,
  getChapterOneScene,
  isFinalScene,
  transitionChapterOne,
} from "./chapterOneFlow";

describe("chapter one scene contract", () => {
  it("covers the full chapter narrative arc", () => {
    expect(CHAPTER_ONE_SCENES).toHaveLength(8);
    expect(getChapterOneScene(0).id).toBe("alexandria_library");
    expect(getChapterOneScene(7).id).toBe("fulcrum_offer");
  });

  it("advances deterministically and supports replay", () => {
    let state = createChapterOneState();

    expect(isFinalScene(state.sceneIndex)).toBe(false);
    for (let index = 0; index < CHAPTER_ONE_SCENES.length - 1; index += 1) {
      state = transitionChapterOne(state, "PRIMARY_ACTION");
      expect(state.sceneIndex).toBe(index + 1);
    }

    expect(isFinalScene(state.sceneIndex)).toBe(true);
    state = transitionChapterOne(state, "PRIMARY_ACTION");
    expect(state.sceneIndex).toBe(CHAPTER_ONE_SCENES.length - 1);

    state = transitionChapterOne(state, "REPLAY");
    expect(state.sceneIndex).toBe(0);
  });
});
