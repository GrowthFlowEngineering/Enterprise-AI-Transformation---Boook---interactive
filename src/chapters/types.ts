import type { ComponentType } from "react";
import type { ChapterManifestItem } from "../chapterManifest";

export type ChapterSystemStatus = "ready" | "scaffolded";

export type ChapterSystemProps = {
  chapter: ChapterManifestItem;
  onBackToHub: () => void;
};

export type ChapterSystemModule = {
  status: ChapterSystemStatus;
  Component: ComponentType<ChapterSystemProps>;
};

export type ChapterSystemEntry = ChapterManifestItem & ChapterSystemModule;
