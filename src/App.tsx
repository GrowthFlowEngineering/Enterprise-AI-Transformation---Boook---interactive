import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChapterOneScene from "./components/ChapterOneScene";
import ChapterOneAssetReview from "./components/ChapterOneAssetReview";
import {
  CHAPTER_ONE_SCENES,
  createChapterOneState,
  getChapterOneScene,
  isFinalScene,
  transitionChapterOne,
  type ChapterOneState,
} from "./chapterOneFlow";

type AppViewMode = "story" | "assets";

const App = () => {
  const [state, setState] = useState<ChapterOneState>(createChapterOneState);
  const [interactionDone, setInteractionDone] = useState(false);
  const [viewMode, setViewMode] = useState<AppViewMode>("story");
  const advanceLockRef = useRef(false);

  const scene = useMemo(() => getChapterOneScene(state.sceneIndex), [state.sceneIndex]);
  const done = isFinalScene(state.sceneIndex);

  useEffect(() => {
    setInteractionDone(false);
    advanceLockRef.current = false;
  }, [state.sceneIndex]);

  const triggerPrimaryAdvance = useCallback(() => {
    if (viewMode !== "story") return;

    if (done) {
      setInteractionDone(true);
      return;
    }

    if (advanceLockRef.current) return;
    advanceLockRef.current = true;
    setInteractionDone(true);

    window.setTimeout(() => {
      setState((current) => transitionChapterOne(current, "PRIMARY_ACTION"));
    }, 420);
  }, [done, viewMode]);

  return (
    <main className={`app-shell scene-theme-${scene.theme}`}>
      <section className="chapter-stage">
        {viewMode === "story" ? (
          <ChapterOneScene
            sceneIndex={state.sceneIndex}
            title={scene.title}
            narrativeLine={scene.narrativeLine}
            requiresInteraction={!interactionDone}
            onPrimaryNodeActivated={triggerPrimaryAdvance}
          />
        ) : (
          <ChapterOneAssetReview />
        )}

        <aside className="fallback-panel" aria-label="Fallback controls">
          <div className="identity-strip">
            <a href="#book-link-placeholder">Book: The Language of Enterprise AI Transformation</a>
            <a href="#author-link-placeholder">Author: Moses Sam Paul J.</a>
            <a href="#partner-link-placeholder">
              Partner: GFE - L4 - Growth Flow Engineering
            </a>
          </div>

          {viewMode === "story" ? (
            <>
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
                    triggerPrimaryAdvance();
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

              <button
                type="button"
                className="scene-action-fallback"
                onClick={() => setViewMode("assets")}
              >
                Open Asset Review Scene
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
            </>
          ) : (
            <>
              <p className="scene-kicker">Chapter 1 · Asset Review Scene</p>
              <h1 className="panel-title">Generated Slideshow + Video Reel</h1>
              <p className="scene-progress">
                Use this to verify generated visuals before integrating into story scenes.
              </p>

              <button
                type="button"
                className="scene-action-fallback"
                onClick={() => setViewMode("story")}
              >
                Back to Story Scene
              </button>

              <div className="chapter-chip">
                <span>Asset review mode</span>
                <span>Bottom controls on left scene switch Slideshow and Video.</span>
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
};

export default App;
