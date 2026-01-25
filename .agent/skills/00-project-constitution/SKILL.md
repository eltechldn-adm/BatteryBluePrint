---
name: 00-project-constitution
description: Non-negotiable rules for BatteryBlueprint. Must be followed in all tasks.
---

# BatteryBlueprint — Project Constitution

## Product goal
Build a premium, trustworthy Solar Battery Sizing tool that users trust more than installers.

## Stack rules
- Use Next.js App Router + TypeScript.
- Use Tailwind + shadcn/ui components for consistent UI.
- Keep math in pure functions under /src/lib/calc (no UI coupling).
- Always add basic unit tests for math functions.

## Accuracy rules
- Never invent solar/battery specs. If specs are needed, place them in /src/data as explicit constants with a clear source note.
- Separate power (kW) from energy (kWh). Never treat them as interchangeable.
- Always display assumptions in the UI (DoD, efficiency, reserve, winter derate).

## UX rules
- Mobile-first.
- No “marketing fluff.” Tone is “No-BS engineer.”
- Results must show ranges, warnings, and “what to do next.”

## Output format rules
When implementing:
- Provide a plan first (1-2 paragraphs).
- Then implement.
- Then run checks (lint/test/build if configured).
- Summarize what changed + where.
