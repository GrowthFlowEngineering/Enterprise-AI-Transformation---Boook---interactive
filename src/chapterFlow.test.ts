import { describe, expect, it } from "vitest";
import { TOTAL_CHAPTERS } from "./chapterManifest";
import {
  createInitialChapterFlowState,
  transitionChapterFlow,
} from "./chapterFlow";

describe("chapter manifest", () => {
  it("keeps all 17 canonical chapters", () => {
    expect(TOTAL_CHAPTERS).toBe(17);
  });
});

describe("chapter flow state machine", () => {
  it("hits pacing gates and conversion states in order", () => {
    let state = createInitialChapterFlowState();

    state = transitionChapterFlow(state, "PRIMARY_ACTION");
    expect(state.stage).toBe("chapter");
    expect(state.chapterIndex).toBe(0);

    while (state.stage === "chapter" && state.chapterIndex < 3) {
      state = transitionChapterFlow(state, "PRIMARY_ACTION");
    }
    expect(state.stage).toBe("gate_disease");

    state = transitionChapterFlow(state, "PRIMARY_ACTION");
    expect(state.stage).toBe("chapter");
    expect(state.chapterIndex).toBe(3);

    while (state.stage === "chapter" && state.chapterIndex < 10) {
      state = transitionChapterFlow(state, "PRIMARY_ACTION");
    }
    expect(state.stage).toBe("gate_architecture");

    state = transitionChapterFlow(state, "PRIMARY_ACTION");
    expect(state.stage).toBe("chapter");
    expect(state.chapterIndex).toBe(10);

    while (state.stage === "chapter" && state.chapterIndex < 13) {
      state = transitionChapterFlow(state, "PRIMARY_ACTION");
    }
    expect(state.stage).toBe("gate_metrics");

    state = transitionChapterFlow(state, "PRIMARY_ACTION");
    expect(state.stage).toBe("chapter");
    expect(state.chapterIndex).toBe(13);

    while (state.stage === "chapter") {
      state = transitionChapterFlow(state, "PRIMARY_ACTION");
    }
    expect(state.stage).toBe("decision_lab");

    state = transitionChapterFlow(state, "PRIMARY_ACTION");
    expect(state.stage).toBe("offer_book");

    state = transitionChapterFlow(state, "PRIMARY_ACTION");
    expect(state.stage).toBe("offer_service");

    state = transitionChapterFlow(state, "PRIMARY_ACTION");
    expect(state.stage).toBe("complete");
  });
});
