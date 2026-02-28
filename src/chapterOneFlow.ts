export type ChapterOneSceneId =
  | "alexandria_library"
  | "roman_soldier_problem"
  | "wrong_layer_conversation"
  | "semantic_drift_customer"
  | "wework_collapse"
  | "three_layers"
  | "roi_formula"
  | "fulcrum_offer";

export type ChapterOneSceneTheme =
  | "library-night"
  | "soldier-contrast"
  | "tool-chaos"
  | "semantic-split"
  | "valuation-fall"
  | "architecture-stack"
  | "formula-focus"
  | "fulcrum-close";

export type ChapterOneScene = {
  id: ChapterOneSceneId;
  theme: ChapterOneSceneTheme;
  title: string;
  narrativeLine: string;
  fallbackActionLabel: string;
  contextSummary: string;
  commercialSignal: string;
};

export type ChapterOneEvent = "PRIMARY_ACTION" | "REPLAY";

export type ChapterOneState = {
  sceneIndex: number;
};

export const CHAPTER_ONE_SCENES: ChapterOneScene[] = [
  {
    id: "alexandria_library",
    theme: "library-night",
    title: "The Library of Alexandria",
    narrativeLine: "A civilization can store all knowledge and still unlock none of it.",
    fallbackActionLabel: "Open the First Scroll",
    contextSummary:
      "Knowledge concentration means nothing when language access is broken. The leverage is zero.",
    commercialSignal:
      "Enterprise signal: semantic coherence is prerequisite infrastructure for AI ROI.",
  },
  {
    id: "roman_soldier_problem",
    theme: "soldier-contrast",
    title: "The Roman Soldier Problem",
    narrativeLine: "Ownership without readable language produces zero leverage.",
    fallbackActionLabel: "Hand Over the Scroll",
    contextSummary:
      "Holding the archive is not the same as reading it. Access without shared vocabulary creates no value.",
    commercialSignal:
      "CEO signal: data inventory is not an operating advantage without translation discipline.",
  },
  {
    id: "wrong_layer_conversation",
    theme: "tool-chaos",
    title: "The Conversation Is at the Wrong Layer",
    narrativeLine: "Tool anxiety rises while the semantic foundation remains unmanaged.",
    fallbackActionLabel: "Stabilize the Signal",
    contextSummary:
      "Model and vendor debates dominate attention while language infrastructure remains ungoverned.",
    commercialSignal:
      "Board signal: tool churn is noise when semantic substrate is unstable.",
  },
  {
    id: "semantic_drift_customer",
    theme: "semantic-split",
    title: "One Word, Five Meanings",
    narrativeLine: "Each function says customer and computes a different reality.",
    fallbackActionLabel: "Resolve Customer Definition",
    contextSummary:
      "Marketing, Sales, Finance, CS, and the Board each operate with a different definition of customer.",
    commercialSignal:
      "Execution signal: semantic drift creates reconciliation tax and strategic drag.",
  },
  {
    id: "wework_collapse",
    theme: "valuation-fall",
    title: "Invented Vocabulary Destroys Valuation",
    narrativeLine: "Markets punish language that cannot resolve to operational truth.",
    fallbackActionLabel: "Run Schema Check",
    contextSummary:
      "WeWork's invented metric looked investable until the market validated semantics and rejected the model.",
    commercialSignal:
      "Investor signal: ungrounded language expands risk premium and compresses value rapidly.",
  },
  {
    id: "three_layers",
    theme: "architecture-stack",
    title: "Three Stable Layers",
    narrativeLine: "Semantic layer first. Coordination second. Tools last.",
    fallbackActionLabel: "Anchor the Semantic Layer",
    contextSummary:
      "Semantic layer, coordination layer, and tool layer move at different speeds. Architecture must start at the base.",
    commercialSignal:
      "Operating signal: layer discipline converts AI projects into compounding systems.",
  },
  {
    id: "roi_formula",
    theme: "formula-focus",
    title: "ROI AI Is M x SC",
    narrativeLine: "When semantic coherence goes to zero, model gains collapse to zero.",
    fallbackActionLabel: "Increase Semantic Coherence",
    contextSummary:
      "Model capability and semantic coherence multiply. At SC=0, ROI collapses regardless of model quality.",
    commercialSignal:
      "Capital signal: coherence investment is the highest-leverage durable moat as models commoditize.",
  },
  {
    id: "fulcrum_offer",
    theme: "fulcrum-close",
    title: "Choose the Fulcrum",
    narrativeLine: "Language governance is the lever; valuation compounding is the outcome.",
    fallbackActionLabel: "Reveal Strategic Options",
    contextSummary:
      "The chapter ends with one decision: continue ad hoc language or install a governed enterprise vocabulary.",
    commercialSignal:
      "Commercial signal: education-led trust opens both book demand and strategic advisory demand.",
  },
];

const FALLBACK_SCENE: ChapterOneScene = {
  id: "alexandria_library",
  theme: "library-night",
  title: "The Library of Alexandria",
  narrativeLine: "Scene narrative unavailable.",
  fallbackActionLabel: "Open the First Scroll",
  contextSummary: "Scene source unavailable.",
  commercialSignal: "Commercial signal unavailable.",
};

export const createChapterOneState = (): ChapterOneState => ({
  sceneIndex: 0,
});

export const isFinalScene = (sceneIndex: number) =>
  sceneIndex >= CHAPTER_ONE_SCENES.length - 1;

export const transitionChapterOne = (
  state: ChapterOneState,
  event: ChapterOneEvent
): ChapterOneState => {
  if (event === "REPLAY") {
    return createChapterOneState();
  }

  if (isFinalScene(state.sceneIndex)) {
    return state;
  }

  return {
    sceneIndex: state.sceneIndex + 1,
  };
};

export const getChapterOneScene = (sceneIndex: number): ChapterOneScene =>
  CHAPTER_ONE_SCENES[sceneIndex] ?? CHAPTER_ONE_SCENES[0] ?? FALLBACK_SCENE;
