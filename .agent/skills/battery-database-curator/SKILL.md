---
name: battery-database-curator
description: Rules for creating/maintaining the battery model database used by BatteryBlueprint.
---

# Battery Database Curator

## Data rules
- All battery models live in /src/data/batteries.ts
- Each entry must include:
  - brand, model
  - nameplate_kWh
  - usable_kWh (or DoD + nameplate so usable can be computed)
  - continuous_output_kW (if known)
  - chemistry (LiFePO4 / NMC etc.)
  - warranty_years (if known)
  - price_range (optional, clearly labeled estimate)
  - source_note string (e.g., "manufacturer datasheet link recorded at time of entry")

## No hallucinations
- If exact spec isn’t known, leave it null and do not present it as fact.
- Prefer showing “fits by kWh” and keep output power warnings generic unless provided.

## Output rules
- Recommendation engine must choose battery count based on usable_kWh target and round UP.
- Always show 2-3 options (premium / mid / DIY) if available.
