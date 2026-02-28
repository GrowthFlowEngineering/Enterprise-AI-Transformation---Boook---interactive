# Chapter 1 Bespoke Asset Manifests

This folder contains production prompt manifests aligned to Chapter 1 scene IDs.

## Files
- `imagegen.jsonl`: 8 still-image jobs (one per Chapter 1 scene).
- `sora.jsonl`: 8 short-video jobs (optional, one per Chapter 1 scene).

## Style baseline
All jobs are constrained to GFE aesthetics:
- Premium minimal bas-relief look
- Cream ceramic surfaces with muted teal accents
- High whitespace, one primary subject per frame
- Soft top-left light, low contrast shadows

## Run
From repo root:

```bash
npm run assets:ch1:dry-run
npm run assets:ch1:dry-run:video
```

For live generation (requires `OPENAI_API_KEY` + Python `openai` package):

```bash
npm run assets:ch1:live
npm run assets:ch1:live:video
```
