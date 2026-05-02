# CORE RULES (Always Loaded - ≤1000 chars)

## Rule 1: Configuration-Driven
Decouple logic from data. Components/layers are "dumb" shells.
- If element or logic repeats >1×, define in typed CONFIG (array or object).
- Use mapping to render/execute. Config controls "what", layer controls "how".
- New feature = add to config, never duplicate code.

## Rule 2: Single Source of Truth
Data lives in exactly ONE canonical place.
- Store minimal IDs/references, never full objects.
- Derive everything possible during render/calculation.
- No shadow states or manual syncing.
- All changes go through controlled pipeline.

## Rule 3: Execution Pipeline
Every interaction follows: Config → State → Intent → Execute
- Define static config first.
- Keep state minimal.
- UI/events express intent only (never mutate directly).
- Execute layer handles all logic and updates.
This keeps changes traceable and predictable.

## Rule 4: Resource Protocol
Before ANY code change:
1. Search D:\Liberary\skills\ for best-practice file (it overrides general knowledge).
2. Index current project structure.
3. Announce full Config → State → Intent → Execute plan.
4. No guessing — retrieve reference from library if pattern unclear.
5. Write code only after all steps complete.