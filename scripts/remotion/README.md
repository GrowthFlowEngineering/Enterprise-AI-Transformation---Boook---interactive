# Chapter 1 Remotion Sync Hand-off

This folder provides a ready manifest for syncing generated Chapter 1 videos with generated voiceover clips.

## Inputs
- Manifest: `scripts/remotion/ch1-reel.manifest.json`
- Videos: `output/sora/ch1/*.mp4`
- Voiceover: `output/speech/ch1/*.mp3`

## Recommended pipeline
1. Generate voiceovers:
```bash
npm run speech:ch1:live
```

2. Build a Remotion composition that reads the manifest and sequences each clip by `durationSeconds`.

3. Render the final reel from Remotion.

## Notes
- Voice output is AI-generated and should be disclosed in final published content.
- Keep all clip durations aligned to the same frame rate (`fps` in manifest) for clean cuts.
