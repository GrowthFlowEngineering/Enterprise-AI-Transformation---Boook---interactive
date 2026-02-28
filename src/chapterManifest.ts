export type PartId =
  | "part_1_disease"
  | "part_2_cure"
  | "part_3_architecture"
  | "part_4_metrics"
  | "part_5_bank";

export type PartManifest = {
  id: PartId;
  label: string;
  theme: string;
};

export type ChapterManifestItem = {
  index: number;
  id: string;
  partId: PartId;
  partLabel: string;
  title: string;
  subtitle: string;
  sourcePath: string;
  commercialLens: string;
};

export const PART_MANIFEST: PartManifest[] = [
  {
    id: "part_1_disease",
    label: "Part I: The Disease",
    theme: "Diagnosing the semantic collapse",
  },
  {
    id: "part_2_cure",
    label: "Part II: The Cure",
    theme: "Engineering the Context Operating System",
  },
  {
    id: "part_3_architecture",
    label: "Part III: The Architecture",
    theme: "The Internal Value Chain",
  },
  {
    id: "part_4_metrics",
    label: "Part IV: The Metrics",
    theme: "Measuring truth",
  },
  {
    id: "part_5_bank",
    label: "Part V: The Bank",
    theme: "Converting truth to enterprise value",
  },
];

export const CHAPTER_MANIFEST: ChapterManifestItem[] = [
  {
    index: 1,
    id: "ch-01-the-vocabulary-advantage",
    partId: "part_1_disease",
    partLabel: "Part I: The Disease",
    title: "Chapter 1: The Vocabulary Advantage",
    subtitle:
      "Why Organizational Language - Not AI Tools - Determines Who Wins the Next Decade",
    sourcePath:
      "docs/book/part-1-the-disease/ch-01-the-vocabulary-advantage.md",
    commercialLens: "Position language discipline as the first leverage asset.",
  },
  {
    index: 2,
    id: "ch-02-the-babel-qbr",
    partId: "part_1_disease",
    partLabel: "Part I: The Disease",
    title: "Chapter 2: The Babel QBR",
    subtitle: "The Cost of Ghost Value at the Executive Level",
    sourcePath: "docs/book/part-1-the-disease/ch-02-the-babel-qbr.md",
    commercialLens: "Quantify EBITDA leakage caused by coordination drag.",
  },
  {
    index: 3,
    id: "ch-03-the-leadership-clock",
    partId: "part_1_disease",
    partLabel: "Part I: The Disease",
    title: "Chapter 3: The Leadership Clock",
    subtitle:
      "Why Management Operates on a Biological Clock While AI Operates on a Compute Clock",
    sourcePath: "docs/book/part-1-the-disease/ch-03-the-leadership-clock.md",
    commercialLens: "Expose latency mismatch as a board-level risk.",
  },
  {
    index: 4,
    id: "ch-04-context-os-for-growth",
    partId: "part_2_cure",
    partLabel: "Part II: The Cure",
    title: "Chapter 4: Context OS for Growth",
    subtitle: "The Architectural Alternative to the Alignment Meeting",
    sourcePath: "docs/book/part-2-the-cure/ch-04-context-os-for-growth.md",
    commercialLens: "Reframe alignment from meetings into operating systems.",
  },
  {
    index: 5,
    id: "ch-05-truth-distillation",
    partId: "part_2_cure",
    partLabel: "Part II: The Cure",
    title: "Chapter 5: Truth Distillation",
    subtitle: "The Violent Act of Converting Strategy into System Syntax",
    sourcePath: "docs/book/part-2-the-cure/ch-05-truth-distillation.md",
    commercialLens: "Move strategy into enforceable operational syntax.",
  },
  {
    index: 6,
    id: "ch-06-the-least-common-vocabulary",
    partId: "part_2_cure",
    partLabel: "Part II: The Cure",
    title: "Chapter 6: The Least Common Vocabulary (LCV)",
    subtitle: "You Don't Need to Distill Everything. Only the Handoffs.",
    sourcePath:
      "docs/book/part-2-the-cure/ch-06-the-least-common-vocabulary.md",
    commercialLens: "Standardize handoffs where value can leak or compound.",
  },
  {
    index: 7,
    id: "ch-07-the-9-node-ivc",
    partId: "part_3_architecture",
    partLabel: "Part III: The Architecture",
    title: "Chapter 7: The 9-Node Graph of Meaning",
    subtitle: "Where Every Keystroke Has a Zip Code in the Valuation Model",
    sourcePath: "docs/book/part-3-the-architecture/ch-07-the-9-node-ivc.md",
    commercialLens: "Give every workflow an attributable value coordinate.",
  },
  {
    index: 8,
    id: "ch-08-spec-integrity-and-task-hydration",
    partId: "part_3_architecture",
    partLabel: "Part III: The Architecture",
    title: "Chapter 8: Spec Integrity & Task Hydration",
    subtitle: "Adding Muscle to the Skeleton of Work",
    sourcePath:
      "docs/book/part-3-the-architecture/ch-08-spec-integrity-and-task-hydration.md",
    commercialLens: "Translate abstract roles into execution-grade specs.",
  },
  {
    index: 9,
    id: "ch-09-process-orchestration-revenueops",
    partId: "part_3_architecture",
    partLabel: "Part III: The Architecture",
    title: "Chapter 9: Process Orchestration & RevenueOps Coverage",
    subtitle:
      "Growth is Composable. Most Companies Just Don't Know Their Building Blocks.",
    sourcePath:
      "docs/book/part-3-the-architecture/ch-09-process-orchestration-revenueops.md",
    commercialLens: "Compose reliable growth engines from reusable contracts.",
  },
  {
    index: 10,
    id: "ch-10-dual-repository-architecture",
    partId: "part_3_architecture",
    partLabel: "Part III: The Architecture",
    title: "Chapter 10: Dual-Repository Architecture",
    subtitle: "Separating the Church from the State - By Design",
    sourcePath:
      "docs/book/part-3-the-architecture/ch-10-dual-repository-architecture.md",
    commercialLens: "Protect canonical truth from operational drift.",
  },
  {
    index: 11,
    id: "ch-11-kpi-architecture",
    partId: "part_4_metrics",
    partLabel: "Part IV: The Metrics",
    title: "Chapter 11: KPI Architecture",
    subtitle: "The Scoreboard Defines the Game - Do Not Confuse the Two",
    sourcePath: "docs/book/part-4-the-metrics/ch-11-kpi-architecture.md",
    commercialLens: "Align measurement to true enterprise position.",
  },
  {
    index: 12,
    id: "ch-12-okr-architecture",
    partId: "part_4_metrics",
    partLabel: "Part IV: The Metrics",
    title: "Chapter 12: OKR Architecture",
    subtitle: "Ghost OKRs and the Geometry of Strategic Accountability",
    sourcePath: "docs/book/part-4-the-metrics/ch-12-okr-architecture.md",
    commercialLens: "Force objective accountability through parent-child links.",
  },
  {
    index: 13,
    id: "ch-13-human-ai-readiness-index",
    partId: "part_4_metrics",
    partLabel: "Part IV: The Metrics",
    title: "Chapter 13: The Human-AI Readiness Index (HARI)",
    subtitle:
      "Your AI Is Only as Ready as Your Humans - And Your Humans Are Not as Ready as You Think",
    sourcePath:
      "docs/book/part-4-the-metrics/ch-13-human-ai-readiness-index.md",
    commercialLens: "Expose readiness gaps before capital is misallocated.",
  },
  {
    index: 14,
    id: "ch-14-the-cryptography-of-work",
    partId: "part_5_bank",
    partLabel: "Part V: The Bank",
    title: "Chapter 14: The Cryptography of Work",
    subtitle:
      "If It Isn't Logged, It Didn't Happen. And If It Didn't Happen, It Cannot Be Valued.",
    sourcePath:
      "docs/book/part-5-the-bank/ch-14-the-cryptography-of-work.md",
    commercialLens: "Require audit-grade evidence for value attribution.",
  },
  {
    index: 15,
    id: "ch-15-valuationops",
    partId: "part_5_bank",
    partLabel: "Part V: The Bank",
    title: "Chapter 15: ValuationOps",
    subtitle: "The Six-Layer Stack That Converts Operational Work Into Enterprise Value",
    sourcePath: "docs/book/part-5-the-bank/ch-15-valuationops.md",
    commercialLens: "Tie operational signals to cash-flow mechanics.",
  },
  {
    index: 16,
    id: "ch-16-internal-risk-index",
    partId: "part_5_bank",
    partLabel: "Part V: The Bank",
    title: "Chapter 16: The Internal Risk Index (IRI)",
    subtitle:
      "Corporate Cholesterol - You Can Ignore It Until the Heart Attack. Then It's Too Late.",
    sourcePath: "docs/book/part-5-the-bank/ch-16-internal-risk-index.md",
    commercialLens: "Model risk premium pressure before diligence does.",
  },
  {
    index: 17,
    id: "ch-17-enterprise-value",
    partId: "part_5_bank",
    partLabel: "Part V: The Bank",
    title: "Chapter 17: Enterprise Value",
    subtitle: "The Final Equation - And the Question You Cannot Avoid After Reading It",
    sourcePath: "docs/book/part-5-the-bank/ch-17-enterprise-value.md",
    commercialLens: "Convert narrative clarity into valuation confidence.",
  },
];

export const TOTAL_CHAPTERS = CHAPTER_MANIFEST.length;

export const getChapterByIndex = (index: number) => CHAPTER_MANIFEST[index] ?? null;
