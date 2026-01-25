---
name: solar-math-validator
description: Validates battery sizing math, edge cases, and unit correctness for BatteryBlueprint.
---

# Solar Math Validator

## Unit sanity
- kW = power, kWh = energy. Never conflate.
- Battery sizing is primarily driven by kWh load and days of autonomy, not array kW.

## Core sizing formula (storage)
- DailyLoad_kWh = user input OR sum(appliance_watts * hours)/1000
- UsableStorageNeeded_kWh = DailyLoad_kWh * DaysOfAutonomy
- NameplateStorageNeeded_kWh = UsableStorageNeeded_kWh / (DoD * InverterEfficiency)

Defaults:
- DoD default: 0.80 (LiFePO4 typical)
- Inverter efficiency default: 0.90
- Reserve default: 0.15 (15%)

Buffers:
- WinterMode adds derate multiplier (default 1.20 unless overridden by temperature selection)
- Optional aging buffer 1.10 (10%) if enabled

Rounding:
- Always round UP final nameplate recommendation to nearest 0.5 kWh.

## Power / inverter warnings (separate from storage)
- If user provides peak load (kW) or we infer it from appliances:
  - Recommend inverter continuous kW >= peak continuous load
  - Recommend surge margin for motor loads (show warning, do not pretend exact without inputs)
- Do NOT derive battery kWh from solar array kW.

## Edge cases
- Prevent 0 or negative values; clamp with helpful message.
- If DailyLoad_kWh is extremely high, show “sanity warning” and suggest reviewing HVAC / resistive heating loads.

## Required tests
Include unit tests for:
- Baseline example (e.g., 10 kWh/day, 1 day, DoD 0.8, eff 0.9)
- WinterMode multiplier
- Reserve + rounding behavior
