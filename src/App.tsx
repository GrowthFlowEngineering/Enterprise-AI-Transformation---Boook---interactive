import { useCallback, useEffect, useMemo, useState } from "react";
import ChapterHub from "./components/ChapterHub";
import { CHAPTER_SYSTEMS, getChapterSystemById } from "./chapters/chapterSystems";

const CHAPTER_HASH_PREFIX = "chapter/";

const readChapterFromHash = () => {
  const hashValue = window.location.hash.replace(/^#/, "").trim();
  if (!hashValue.startsWith(CHAPTER_HASH_PREFIX)) return null;

  const chapterId = hashValue.slice(CHAPTER_HASH_PREFIX.length);
  return chapterId.length ? chapterId : null;
};

const App = () => {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(() => readChapterFromHash());

  useEffect(() => {
    const onHashChange = () => {
      setActiveChapterId(readChapterFromHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const openChapter = useCallback((chapterId: string) => {
    window.location.hash = `${CHAPTER_HASH_PREFIX}${chapterId}`;
  }, []);

  const backToHub = useCallback(() => {
    const nextUrl = `${window.location.pathname}${window.location.search}`;
    window.history.pushState({}, "", nextUrl);
    setActiveChapterId(null);
  }, []);

  const activeChapter = useMemo(() => {
    if (!activeChapterId) return null;
    return getChapterSystemById(activeChapterId);
  }, [activeChapterId]);

  if (!activeChapter) {
    return <ChapterHub chapters={CHAPTER_SYSTEMS} onOpenChapter={openChapter} />;
  }

  const ActiveChapterComponent = activeChapter.Component;
  return <ActiveChapterComponent chapter={activeChapter} onBackToHub={backToHub} />;
};

export default App;
