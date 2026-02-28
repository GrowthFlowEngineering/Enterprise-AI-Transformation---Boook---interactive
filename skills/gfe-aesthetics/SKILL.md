---
name: gfe-aesthetics
description: Apply the Growth Flow Engineering premium minimal neumorphism design language for interactive chapters, with executive-grade visual hierarchy and conversion-safe UI.
---

# GFE Aesthetics

## Purpose
Create polished interactive chapter experiences that feel premium, strategic, and conversion-ready without visual clutter.

## Design System
1. Style
- Premium minimal neumorphism.
- Soft bas-relief emboss.
- Cream-white surfaces with subtle topographic wave treatment.
- Gentle teal/mint accents and low-contrast shadows.
- Prefer cinematic dark stage framing (`near-black`) around cream surfaces for contrast when storytelling needs higher drama.

2. Color tokens
- Background: `#FBFBFB`
- Surface 2: `#F4F4F2`
- Shadow Light: `#FFFFFF`
- Shadow Dark: `#EAEAE6`
- Text Primary: `#384F51`
- Text Secondary: `#658C90`
- Accent 1: `#ADEFE7`
- Accent 2: `#A1DCD5`
- Accent 3: `#A1BEBB`
- Accent 4: `#427277`

3. Typography
- Primary font family: `Outfit`, `Inter`, sans-serif fallback.
- Headline text uses heavier weights and compact line-height.
- Body text stays concise and readable with strategic contrast.

## Bespoke Asset Prompt Clauses
When generating custom assets (image/video), always include these constraints in prompts:
1. **Form language**
- Bas-relief / low-relief sculpted elements (not flat iconography).
- Rounded edges, soft carved detail, premium minimal structure.

2. **Material language**
- Cream-white ceramic / porcelain surfaces with tactile depth.
- Teal accents used as trims, highlights, and semantic emphasis.

3. **Composition language**
- One primary subject per frame.
- High whitespace and low clutter.
- Readable silhouette at first glance.

4. **Lighting language**
- Soft top-left key, subtle rim fill.
- No harsh contrast, no cinematic over-bloom, no saturated neon.

5. **Negative guardrails**
- Avoid stock-photo vibe, glossy plastic look, comic exaggeration, visual noise.
- Avoid dense text inside assets unless explicitly requested.

## Interaction Rules
1. Scene-first and one primary action at a time.
2. Prefer in-scene interaction hotspots before next-step buttons.
3. Desktop progression should support `double-click` on in-scene nodes.
4. Mobile progression should support `single tap` on the same in-scene nodes.
5. If controls are needed, keep them secondary fallback, not primary progression.
6. Keep critical controls reachable on mobile without opening hidden panels.
7. Soft conversion framing only after value delivery.

## Brand Footer Rule
Always include subtle persistent links for:
- Book: `The Language of Enterprise AI Transformation`
- Author: `Moses Sam Paul J.`
- Partner: `GFE - L4 - Growth Flow Engineering`

Use placeholder links when final URLs are not available.

## Mobile Baseline
- Minimum tap target: `44px`.
- Scene canvas remains usable at phone widths.
- No text clipping or hidden primary actions on narrow screens.
- Interaction parity: all chapter-critical actions must be completable without keyboard or hover.
