import { useMemo } from "react";
import type { ChapterSystemEntry } from "../chapters/types";

type ChapterHubProps = {
  chapters: ChapterSystemEntry[];
  onOpenChapter: (chapterId: string) => void;
};

export default function ChapterHub({ chapters, onOpenChapter }: ChapterHubProps) {
  const grouped = useMemo(() => {
    return chapters.reduce<Record<string, ChapterSystemEntry[]>>((acc, chapter) => {
      const key = chapter.partLabel;
      if (!acc[key]) acc[key] = [];
      acc[key].push(chapter);
      return acc;
    }, {});
  }, [chapters]);

  const partLabels = Object.keys(grouped);

  return (
    <main className="app-shell chapter-hub-shell">
      <section className="chapter-hub-stage" aria-label="Book chapter index">
        <header className="chapter-hub-header">
          <div className="identity-strip chapter-hub-identity">
            <a href="#book-link-placeholder">Book: The Language of Enterprise AI Transformation</a>
            <a href="#author-link-placeholder">Author: Moses Sam Paul J.</a>
            <a href="#partner-link-placeholder">Partner: GFE - L4 - Growth Flow Engineering</a>
          </div>

          <p className="scene-kicker">Interactive Chapter Hub</p>
          <h1 className="chapter-hub-title">17 Chapter Systems</h1>
          <p className="chapter-hub-subtitle">
            Each chapter is isolated as its own interactive module. Chapter 1 is live; Chapters 2-17 are scaffolded
            for bespoke build-out.
          </p>
        </header>

        <div className="chapter-hub-parts">
          {partLabels.map((partLabel) => {
            const partChapters = grouped[partLabel] ?? [];

            return (
              <section key={partLabel} className="chapter-hub-part">
                <h2 className="chapter-hub-part-title">{partLabel}</h2>
                <div className="chapter-hub-grid">
                  {partChapters.map((chapter) => (
                    <article key={chapter.id} className="chapter-card">
                      <p className="chapter-card-index">Chapter {chapter.index}</p>
                      <h3 className="chapter-card-title">{chapter.title}</h3>
                      <p className="chapter-card-subtitle">{chapter.subtitle}</p>
                      <p className="chapter-card-source">{chapter.sourcePath}</p>
                      <div className="chapter-card-footer">
                        <span className={`chapter-status chapter-status-${chapter.status}`}>
                          {chapter.status === "ready" ? "Live" : "Scaffolded"}
                        </span>
                        <button
                          type="button"
                          className="scene-action-fallback chapter-open-button"
                          onClick={() => onOpenChapter(chapter.id)}
                        >
                          Open Interactive
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
