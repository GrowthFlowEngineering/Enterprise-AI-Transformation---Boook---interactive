import { useEffect, useMemo, useRef, useState } from "react";

type ShowcaseMode = "slideshow" | "video";

const toAssetUrl = (relativePath: string) =>
  `${import.meta.env.BASE_URL}${relativePath.replace(/^\/+/, "")}`;

const SLIDESHOW_ASSETS = [
  toAssetUrl("output/imagegen/ch1/ch1-s01-alexandria-library.png"),
  toAssetUrl("output/imagegen/ch1/ch1-s02-roman-soldier-handover.png"),
  toAssetUrl("output/imagegen/ch1/ch1-s03-wrong-layer-stack.png"),
  toAssetUrl("output/imagegen/ch1/ch1-s04-semantic-drift-split.png"),
  toAssetUrl("output/imagegen/ch1/ch1-s05-valuation-collapse.png"),
  toAssetUrl("output/imagegen/ch1/ch1-s06-three-layers-architecture.png"),
  toAssetUrl("output/imagegen/ch1/ch1-s07-roi-mxsc.png"),
  toAssetUrl("output/imagegen/ch1/ch1-s08-fulcrum-decision.png"),
];

const VIDEO_REEL_ASSETS = [
  toAssetUrl("output/sora/ch1/ch1-s01-library-reveal.mp4"),
  toAssetUrl("output/sora/ch1/ch1-s02-soldier-handover.mp4"),
  toAssetUrl("output/sora/ch1/ch1-s03-layer-instability.mp4"),
  toAssetUrl("output/sora/ch1/ch1-s04-semantic-drift.mp4"),
  toAssetUrl("output/sora/ch1/ch1-s05-valuation-fall.mp4"),
  toAssetUrl("output/sora/ch1/ch1-s06-layer-discipline.mp4"),
  toAssetUrl("output/sora/ch1/ch1-s07-roi-mechanism.mp4"),
  toAssetUrl("output/sora/ch1/ch1-s08-fulcrum-choice.mp4"),
];

export default function ChapterOneAssetReview() {
  const [mode, setMode] = useState<ShowcaseMode>("slideshow");
  const [slideIndex, setSlideIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeSlide = useMemo(
    () => SLIDESHOW_ASSETS[slideIndex] ?? SLIDESHOW_ASSETS[0],
    [slideIndex]
  );

  const activeVideo = useMemo(
    () => VIDEO_REEL_ASSETS[videoIndex] ?? VIDEO_REEL_ASSETS[0],
    [videoIndex]
  );

  useEffect(() => {
    if (mode !== "slideshow") return;

    const timer = window.setInterval(() => {
      setSlideIndex((previous) => (previous + 1) % SLIDESHOW_ASSETS.length);
    }, 2800);

    return () => {
      window.clearInterval(timer);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "video") return;
    const player = videoRef.current;
    if (!player) return;
    player.currentTime = 0;
    void player.play().catch(() => {
      // Browser autoplay policy may block playback; controls remain visible.
    });
  }, [mode, videoIndex]);

  const onVideoEnded = () => {
    setVideoIndex((previous) => (previous + 1) % VIDEO_REEL_ASSETS.length);
  };

  return (
    <section className="asset-review-shell" aria-label="Chapter 1 generated media review">
      <header className="asset-review-header">
        <h2 className="asset-review-title">Chapter 1 Generated Asset Review</h2>
        <p className="asset-review-subtitle">
          {mode === "slideshow"
            ? `Slideshow ${slideIndex + 1}/${SLIDESHOW_ASSETS.length}`
            : `Video reel ${videoIndex + 1}/${VIDEO_REEL_ASSETS.length}`}
        </p>
      </header>

      <div className="asset-review-frame">
        {mode === "slideshow" ? (
          <img
            className="asset-review-media"
            src={activeSlide}
            alt={`Chapter 1 generated slide ${slideIndex + 1}`}
          />
        ) : (
          <video
            key={activeVideo}
            ref={videoRef}
            className="asset-review-media"
            src={activeVideo}
            controls
            autoPlay
            muted
            playsInline
            onEnded={onVideoEnded}
          />
        )}
      </div>

      <footer className="asset-review-controls" role="group" aria-label="Asset mode switch">
        <button
          type="button"
          className={`asset-review-mode-button ${mode === "slideshow" ? "active" : ""}`}
          onClick={() => setMode("slideshow")}
        >
          Slideshow
        </button>
        <button
          type="button"
          className={`asset-review-mode-button ${mode === "video" ? "active" : ""}`}
          onClick={() => setMode("video")}
        >
          Video
        </button>
      </footer>
    </section>
  );
}
