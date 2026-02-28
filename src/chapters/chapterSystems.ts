import { CHAPTER_MANIFEST } from "../chapterManifest";
import type { ChapterSystemEntry, ChapterSystemModule } from "./types";
import chapter01Module from "./ch01";
import chapter02Module from "./ch02";
import chapter03Module from "./ch03";
import chapter04Module from "./ch04";
import chapter05Module from "./ch05";
import chapter06Module from "./ch06";
import chapter07Module from "./ch07";
import chapter08Module from "./ch08";
import chapter09Module from "./ch09";
import chapter10Module from "./ch10";
import chapter11Module from "./ch11";
import chapter12Module from "./ch12";
import chapter13Module from "./ch13";
import chapter14Module from "./ch14";
import chapter15Module from "./ch15";
import chapter16Module from "./ch16";
import chapter17Module from "./ch17";

const CHAPTER_MODULES_BY_INDEX: Record<number, ChapterSystemModule> = {
  1: chapter01Module,
  2: chapter02Module,
  3: chapter03Module,
  4: chapter04Module,
  5: chapter05Module,
  6: chapter06Module,
  7: chapter07Module,
  8: chapter08Module,
  9: chapter09Module,
  10: chapter10Module,
  11: chapter11Module,
  12: chapter12Module,
  13: chapter13Module,
  14: chapter14Module,
  15: chapter15Module,
  16: chapter16Module,
  17: chapter17Module,
};

export const CHAPTER_SYSTEMS: ChapterSystemEntry[] = CHAPTER_MANIFEST.map((chapter) => {
  const chapterModule = CHAPTER_MODULES_BY_INDEX[chapter.index];

  if (!chapterModule) {
    throw new Error(`Missing chapter module registration for chapter ${chapter.index}`);
  }

  return {
    ...chapter,
    status: chapterModule.status,
    Component: chapterModule.Component,
  };
});

export const getChapterSystemById = (chapterId: string): ChapterSystemEntry | null =>
  CHAPTER_SYSTEMS.find((chapter) => chapter.id === chapterId) ?? null;
