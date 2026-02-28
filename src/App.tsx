import { useEffect, useMemo, useState } from "react";
import ChapterOneScene from "./components/ChapterOneScene";
import {
  CHAPTER_ONE_SCENES,
  createChapterOneState,
  getChapterOneScene,
  isFinalScene,
  transitionChapterOne,
  type ChapterOneState,
} from "./chapterOneFlow";

const App = () => {
  const [state, setState] = useState<ChapterOneState>(createChapterOneState);
  const [interactionDone, setInteractionDone] = useState(false);

  const scene = useMemo(() => getChapterOneScene(state.sceneIndex), [state.sceneIndex]);
  const done = isFinalScene(state.sceneIndex);

  useEffect(() => {
    setInteractionDone(false);
  }, [state.sceneIndex]);

  return (
    <main className={`app-shell scene-theme-${scene.theme}`}>
      <section className="chapter-stage">
        <ChapterOneScene
          sceneIndex={state.sceneIndex}
          title={scene.title}
          narrativeLine={scene.narrativeLine}
          requiresInteraction={!interactionDone}
          onPrimaryNodeActivated={() => {
            setInteractionDone((previous) => {
              if (previous) return previous;
              if (!done) {
                window.setTimeout(() => {
                  setState((current) => transitionChapterOne(current, "PRIMARY_ACTION"));
                }, 420);
              }
              return true;
            });
          }}
        />

        <aside className="fallback-panel" aria-label="Fallback controls">
          <div className="identity-strip">
            <a href="#book-link-placeholder">Book: The Language of Enterprise AI Transformation</a>
            <a href="#author-link-placeholder">Author: Moses Sam Paul J.</a>
            <a href="#partner-link-placeholder">
              Partner: GFE - L4 - Growth Flow Engineering
            </a>
          </div>

          <p className="scene-kicker">Chapter 1 · Scene {state.sceneIndex + 1}</p>
          <h1 className="panel-title">{scene.title}</h1>
          <p className="scene-progress">
            Scene {state.sceneIndex + 1}/{CHAPTER_ONE_SCENES.length}
          </p>

          {done && interactionDone && (
            <div className="offer-row">
              <a href="#book-link-placeholder" className="offer-link">
                Get First 3 Chapters
              </a>
              <a href="#diagnostic-link-placeholder" className="offer-link">
                Book Strategic Diagnostic
              </a>
            </div>
          )}

          <button
            type="button"
            className="scene-action-fallback"
            onClick={() => {
              if (!done) {
                setState((current) => transitionChapterOne(current, "PRIMARY_ACTION"));
                return;
              }

              if (!interactionDone) {
                setInteractionDone(true);
                return;
              }

              setState((current) => transitionChapterOne(current, "REPLAY"));
            }}
          >
            {done
              ? interactionDone
                ? "Replay Chapter 1"
                : scene.fallbackActionLabel
              : scene.fallbackActionLabel}
          </button>

          <details className="scene-context">
            <summary>Story context</summary>
            <p className="scene-body">{scene.contextSummary}</p>
            <p className="scene-signal">{scene.commercialSignal}</p>
          </details>

          <div className="chapter-chip">
            <span>Chapter 1 complete scene arc</span>
            <span>Story-first flow · visual cues only · fallback panel secondary</span>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default App;
