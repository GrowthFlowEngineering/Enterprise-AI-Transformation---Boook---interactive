import {
  TOTAL_CHAPTERS,
  getChapterByIndex,
  type ChapterManifestItem,
} from "./chapterManifest";

const DISEASE_GATE_CHAPTER = 2;
const ARCHITECTURE_GATE_CHAPTER = 9;
const METRICS_GATE_CHAPTER = 12;
const FINAL_CHAPTER = TOTAL_CHAPTERS - 1;

export type FlowStage =
  | "intro"
  | "chapter"
  | "gate_disease"
  | "gate_architecture"
  | "gate_metrics"
  | "decision_lab"
  | "offer_book"
  | "offer_service"
  | "complete";

export type FlowEvent = "PRIMARY_ACTION";

export type ChapterFlowState = {
  stage: FlowStage;
  chapterIndex: number;
  completedChapters: number;
};

export type SceneContract = {
  kicker: string;
  title: string;
  body: string;
  actionLabel: string;
  progressLabel: string;
  chapter: ChapterManifestItem | null;
  commercialSignal: string;
};

export const createInitialChapterFlowState = (): ChapterFlowState => ({
  stage: "intro",
  chapterIndex: 0,
  completedChapters: 0,
});

export const canAdvance = (state: ChapterFlowState): boolean => {
  if (state.stage === "gate_disease") {
    return state.completedChapters >= DISEASE_GATE_CHAPTER + 1;
  }
  if (state.stage === "gate_architecture") {
    return state.completedChapters >= ARCHITECTURE_GATE_CHAPTER + 1;
  }
  if (state.stage === "gate_metrics") {
    return state.completedChapters >= METRICS_GATE_CHAPTER + 1;
  }
  return true;
};

export const transitionChapterFlow = (
  state: ChapterFlowState,
  event: FlowEvent
): ChapterFlowState => {
  if (event !== "PRIMARY_ACTION") return state;
  if (!canAdvance(state)) return state;

  if (state.stage === "intro") {
    return { ...state, stage: "chapter", chapterIndex: 0 };
  }

  if (state.stage === "chapter") {
    const completedChapters = Math.max(
      state.completedChapters,
      state.chapterIndex + 1
    );

    if (state.chapterIndex === DISEASE_GATE_CHAPTER) {
      return { ...state, stage: "gate_disease", completedChapters };
    }
    if (state.chapterIndex === ARCHITECTURE_GATE_CHAPTER) {
      return { ...state, stage: "gate_architecture", completedChapters };
    }
    if (state.chapterIndex === METRICS_GATE_CHAPTER) {
      return { ...state, stage: "gate_metrics", completedChapters };
    }
    if (state.chapterIndex === FINAL_CHAPTER) {
      return { ...state, stage: "decision_lab", completedChapters };
    }

    return {
      ...state,
      stage: "chapter",
      chapterIndex: state.chapterIndex + 1,
      completedChapters,
    };
  }

  if (state.stage === "gate_disease") {
    return { ...state, stage: "chapter", chapterIndex: DISEASE_GATE_CHAPTER + 1 };
  }
  if (state.stage === "gate_architecture") {
    return {
      ...state,
      stage: "chapter",
      chapterIndex: ARCHITECTURE_GATE_CHAPTER + 1,
    };
  }
  if (state.stage === "gate_metrics") {
    return { ...state, stage: "chapter", chapterIndex: METRICS_GATE_CHAPTER + 1 };
  }
  if (state.stage === "decision_lab") {
    return { ...state, stage: "offer_book" };
  }
  if (state.stage === "offer_book") {
    return { ...state, stage: "offer_service" };
  }
  if (state.stage === "offer_service") {
    return { ...state, stage: "complete" };
  }

  return createInitialChapterFlowState();
};

const sceneForChapter = (state: ChapterFlowState): SceneContract => {
  const chapter = getChapterByIndex(state.chapterIndex);
  if (!chapter) {
    return {
      kicker: "Chapter Missing",
      title: "Chapter map is out of range.",
      body: "Reset and reload manifest integrity.",
      actionLabel: "Reset Journey",
      progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal: "Integrity warning: source chapter not found.",
    };
  }

  return {
    kicker: `${chapter.partLabel} · Chapter ${chapter.index}`,
    title: chapter.title,
    body: chapter.subtitle,
    actionLabel: "Continue to Next Node",
    progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
    chapter,
    commercialSignal: chapter.commercialLens,
  };
};

export const getSceneContract = (state: ChapterFlowState): SceneContract => {
  if (state.stage === "intro") {
    return {
      kicker: "Executive Simulation",
      title: "17-Chapter Decision Journey",
      body: "This flow mirrors the full manuscript and translates each chapter into boardroom-grade value signals.",
      actionLabel: "Start with Chapter 1",
      progressLabel: `0/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal:
        "Target outcomes: book demand, qualified advisory leads, measurable trust.",
    };
  }

  if (state.stage === "chapter") {
    return sceneForChapter(state);
  }

  if (state.stage === "gate_disease") {
    return {
      kicker: "Pacing Gate · Part I Complete",
      title: "Confirm the Cost of Inaction",
      body: "Acknowledge that semantic drift is creating EBITDA leakage, execution variance, and governance drag.",
      actionLabel: "Acknowledge Risk Exposure",
      progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal: "Commercial trigger: the buyer accepts there is a priced problem.",
    };
  }

  if (state.stage === "gate_architecture") {
    return {
      kicker: "Pacing Gate · Part III Complete",
      title: "Confirm Architecture Fit",
      body: "Validate that the Internal Value Chain and dual-repository model match your operating reality.",
      actionLabel: "Commit to Architecture Fit",
      progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal:
        "Commercial trigger: move from theory to implementation intent.",
    };
  }

  if (state.stage === "gate_metrics") {
    return {
      kicker: "Pacing Gate · Part IV Complete",
      title: "Confirm Readiness Gap",
      body: "Accept that readiness must be measured before scaling AI budget, tooling, and hiring commitments.",
      actionLabel: "Validate Readiness Gap",
      progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal:
        "Commercial trigger: buyer sees need for structured diagnostic support.",
    };
  }

  if (state.stage === "decision_lab") {
    return {
      kicker: "Decision Lab",
      title: "IRI -> WACC -> Enterprise Value",
      body: "Model output: lower execution variance supports risk compression, which supports stronger valuation confidence.",
      actionLabel: "Get the Book Playbook",
      progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal:
        "Value statement: higher cash-flow quality and multiple support.",
    };
  }

  if (state.stage === "offer_book") {
    return {
      kicker: "Offer A · Book Conversion",
      title: "Unlock the Full 17-Chapter System",
      body: "Use the book as the operating blueprint for language governance, valuation mechanics, and AI coordination.",
      actionLabel: "Continue to Services Option",
      progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal:
        "Primary conversion: immediate book purchase or chapter unlock.",
    };
  }

  if (state.stage === "offer_service") {
    return {
      kicker: "Offer B · Services Conversion",
      title: "Book a Strategic Diagnostic",
      body: "Translate your chapter insights into an engagement focused on risk reduction, KPI clarity, and valuation lift.",
      actionLabel: "Complete Commercial Path",
      progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
      chapter: null,
      commercialSignal:
        "Secondary conversion: qualified advisory conversation, value-first.",
    };
  }

  return {
    kicker: "Journey Complete",
    title: "Chapter-Faithful Revenue Flow Ready",
    body: "The scaffold is prepared for video capture, chapter overlays, and live offer links.",
    actionLabel: "Restart Journey",
    progressLabel: `${state.completedChapters}/${TOTAL_CHAPTERS} chapters completed`,
    chapter: null,
    commercialSignal:
      "Both conversion paths are staged without aggressive sales behavior.",
  };
};
