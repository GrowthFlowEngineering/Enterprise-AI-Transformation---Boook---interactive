import { useMemo, useRef, useState } from "react";
import type { ChapterSystemProps } from "../types";

type ScaffoldScene = {
  title: string;
  narrativeLine: string;
  actionLabel: string;
  contextSummary: string;
};

const BASE_SCENES: ScaffoldScene[] = [
  {
    title: "Executive Signal Setup",
    narrativeLine: "Frame the core operational tension before introducing mechanism.",
    actionLabel: "Reveal Operating Tension",
    contextSummary: "Scene 1 sets the business stakes and the narrative trigger.",
  },
  {
    title: "Mechanism Exposure",
    narrativeLine: "Show the single system mechanism that causes the chapter outcome.",
    actionLabel: "Run Mechanism Check",
    contextSummary: "Scene 2 isolates one cause-effect chain for executive clarity.",
  },
  {
    title: "Commercial Bridge",
    narrativeLine: "Connect chapter insight to decision quality, value, and risk posture.",
    actionLabel: "Close Chapter Loop",
    contextSummary: "Scene 3 ties learning to boardroom action and monetizable next step.",
  },
];
const FALLBACK_SCENE: ScaffoldScene = {
  title: "Chapter Scaffold",
  narrativeLine: "Scaffold scene unavailable.",
  actionLabel: "Continue",
  contextSummary: "Scaffold context unavailable.",
};

export default function ScaffoldChapterSystem({ chapter, onBackToHub }: ChapterSystemProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [interactionDone, setInteractionDone] = useState(false);
  const advanceLockRef = useRef(false);

  const done = sceneIndex >= BASE_SCENES.length - 1;
  const scene = useMemo(() => BASE_SCENES[sceneIndex] ?? BASE_SCENES[0] ?? FALLBACK_SCENE, [sceneIndex]);

  const advance = () => {
    if (done) {
      setInteractionDone(true);
      return;
    }

    if (advanceLockRef.current) return;
    advanceLockRef.current = true;
    setInteractionDone(true);

    window.setTimeout(() => {
      setSceneIndex((current) => current + 1);
      setInteractionDone(false);
      advanceLockRef.current = false;
    }, 360);
  };

  const reset = () => {
    setSceneIndex(0);
    setInteractionDone(false);
    advanceLockRef.current = false;
  };

  return (
    <main className="app-shell chapter-scaffold-shell">
      <section className="chapter-stage">
        <section className="chapter-scaffold-canvas-shell" aria-label={`${chapter.title} scaffold scene`}>
          <div className="chapter-scaffold-world">
            <p className="chapter-scaffold-kicker">{chapter.partLabel}</p>
            <h2 className="chapter-scaffold-title">{scene.title}</h2>
            <p className="chapter-scaffold-line">{scene.narrativeLine}</p>
            <button
              type="button"
              className="chapter-scaffold-node"
              onClick={advance}
              aria-label={scene.actionLabel}
            >
              <span className="chapter-scaffold-node-core" />
              <span className="chapter-scaffold-node-text">{scene.actionLabel}</span>
            </button>
          </div>
          <p className="scene-narrative-overlay">{chapter.title}</p>
        </section>

        <aside className="fallback-panel" aria-label="Chapter scaffold fallback controls">
          <div className="identity-strip">
            <a href="#book-link-placeholder">Book: The Language of Enterprise AI Transformation</a>
            <a href="#author-link-placeholder">Author: Moses Sam Paul J.</a>
            <a href="#partner-link-placeholder">Partner: GFE - L4 - Growth Flow Engineering</a>
          </div>

          <button type="button" className="scene-action-fallback" onClick={onBackToHub}>
            Back to Chapter Hub
          </button>

          <p className="scene-kicker">Chapter {chapter.index} · Scene {sceneIndex + 1}</p>
          <h1 className="panel-title">{chapter.title}</h1>
          <p className="scene-progress">Scene {sceneIndex + 1}/{BASE_SCENES.length}</p>

          <button
            type="button"
            className="scene-action-fallback"
            onClick={() => {
              if (!done) {
                advance();
                return;
              }

              if (!interactionDone) {
                setInteractionDone(true);
                return;
              }

              reset();
            }}
          >
            {done ? (interactionDone ? `Replay ${chapter.title}` : scene.actionLabel) : scene.actionLabel}
          </button>

          <details className="scene-context" open>
            <summary>Scaffold context</summary>
            <p className="scene-body">{scene.contextSummary}</p>
            <p className="scene-signal">Chapter source: {chapter.sourcePath}</p>
            <p className="scene-signal">Status: scaffolded chapter system (ready for bespoke scene build).</p>
          </details>

          <div className="chapter-chip">
            <span>Isolated chapter module active</span>
            <span>Single-action flow + anti-skip lock + fallback panel.</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
