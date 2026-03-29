# Test Infrastructure Implementation Plan

Three-phase plan to add isolated, granular game-rule tests alongside the existing scenario test. The scenario test (`src/test/scenario.test.tsx`) stays as-is. Each phase builds on the previous one.

---

## Phase 1: Shared State Builder

### File to create

`src/test/utils/state-builder.ts`

### No files to modify

The existing local `generate()` functions in `bidding.test.ts` and `playing.test.ts` are left untouched.

### Type signatures to export

```typescript
import { Ctx } from "boardgame.io";
import { Card, Rank, Suit } from "../../shared/entities/cards";
import { NumPlayers, PlayerID } from "../../shared/entities/players";
import { Phase } from "../../shared/phases/phase";
import { WizardState, WizardConfig, WizardTrickState } from "../../shared/WizardState";
import { OptionalTrickCard, TrickCard } from "../../shared/entities/trick";
import { ScoreRow } from "../../shared/entities/score";

/** Terse alias for the Card factory from cards.ts */
function c(suit: Suit, rank: Rank): Card;

/** Returns a Wizard card (Rank.Z) of the given suit */
const WIZARD: (suit: Suit) => Card;

/** Returns a Null card (Rank.N) of the given suit */
const NULL_CARD: (suit: Suit) => Card;

interface BuildTrickOptions {
  cards: OptionalTrickCard[];
  lead?: Card;
  isComplete?: boolean;
}

interface BuildRoundOptions {
  bids?: (number | null)[];
  bidsMismatch?: number;
  hands?: (Card | null)[][];
  trickCount?: number[];
  trump?: { card: Card | null | undefined; suit?: Suit | null };
  deck?: (Card | null)[];
  previousTrick?: TrickCard[];
  isComplete?: boolean;
}

interface BuildStateOptions {
  numPlayers?: NumPlayers;          // default: 4
  phase?: Phase;                    // default: Phase.Playing
  currentPlayer?: PlayerID;        // default: 0
  roundIndex?: number;             // default: 0
  rounds?: number[];               // default: [3, 4]
  dealer?: PlayerID;               // default: 0
  round?: BuildRoundOptions | null;
  trick?: BuildTrickOptions | null;
  config?: WizardConfig;
  scorePad?: ScoreRow[];
}

function buildState(options?: BuildStateOptions): { g: WizardState; ctx: Ctx };
```

### How `buildState` works (step by step)

1. Destructure `options` applying all defaults listed above.

2. Build `ctx` by calling `generateCtx` from `src/test/utils/ctx.ts`:
   ```typescript
   generateCtx({
     numPlayers,
     currentPlayer: currentPlayer.toString(),
     phase,
     playOrder: Array.from({ length: numPlayers }, (_, i) => i.toString()),
   })
   ```
   `playOrder` must be derived from `numPlayers` because `generateCtx`'s default is hardcoded to 4 players.

3. Build `round`:
   - If `options.round === null` (explicitly null) -> `round = null`.
   - Otherwise, build inline defaults (do NOT call `generateBlankRoundState` which requires `ctx.random.Shuffle`):
     ```typescript
     {
       bids: new Array(numPlayers).fill(0),
       hands: new Array(numPlayers).fill([]),
       handsMeta: new Array(numPlayers).fill(null),
       trickCount: new Array(numPlayers).fill(0),
       trump: { card: null },
       deck: [],
     }
     ```
     Spread any fields from `options.round` over these defaults.

4. Build `trick`:
   - If `options.trick` is omitted, `undefined`, or explicitly `null` -> `trick = null`.
   - If `options.trick` is an object, build `WizardTrickState` from it:
     `{ cards: options.trick.cards, lead: options.trick.lead, isComplete: options.trick.isComplete }`

5. Assemble and return `{ g: WizardState, ctx }`.

### Acceptance criteria

- [ ] `buildState()` with no arguments returns `{ g, ctx }` where `g.numPlayers === 4`, `g.phase === Phase.Playing`, `g.currentPlayer === 0`, `g.round !== null`, `g.trick === null`
- [ ] `buildState({ round: null })` -> `g.round === null`
- [ ] `buildState({ trick: { cards: [...] } })` -> `g.trick.cards` matches provided array
- [ ] `buildState({ numPlayers: 3 })` -> `ctx.playOrder === ["0","1","2"]` and `g.round.bids.length === 3`
- [ ] `buildState()` does NOT call `ctx.random.Shuffle()` at any point
- [ ] `buildState({ round: { hands: myHands } })` -> `g.round.hands` equals the provided hands
- [ ] `c(Suit.Blue, Rank.Five)` -> `{ suit: "BLUE", rank: 5 }`
- [ ] `WIZARD(Suit.Red)` -> `{ suit: "RED", rank: 26 }`
- [ ] `NULL_CARD(Suit.Green)` -> `{ suit: "GREEN", rank: 0 }`
- [ ] Compiles cleanly with `pnpm run type-check`
- [ ] Demonstrated in at least one new passing test (e.g. `src/test/utils/state-builder.test.ts`)

### Implementation hints

- Import `Card` function and `Rank`/`Suit` enums from `../../shared/entities/cards`.
- Import `generateCtx` from `./ctx` (same directory).
- Do NOT import or use `generateBlankRoundState` or `generateDefaultWizardState` from `WizardState.ts`.
- The `hands` default `new Array(numPlayers).fill([])` creates shared `[]` references. Callers providing hands should always supply explicit distinct arrays. Document this in a JSDoc comment.
- `playOrder` must be computed dynamically for non-4-player games.

---

## Phase 2: Game Runner

### File to create

`src/test/utils/game-runner.ts`

### No files to modify

### Class interface

```typescript
import { WizardState } from "../../shared/WizardState";
import { NumPlayers, PlayerID } from "../../shared/entities/players";
import { Phase } from "../../shared/phases/phase";
import { Card, Suit } from "../../shared/entities/cards";

class GameRunner {
  constructor(initialState: WizardState, numPlayers: NumPlayers);

  get state(): Readonly<WizardState>;
  get currentPlayer(): PlayerID;
  get phase(): Phase;
  get isRoundComplete(): boolean;

  /** Throws if wrong player or INVALID_MOVE */
  bid(playerID: PlayerID, amount: number): void;

  /** Finds card in hand by value, throws if not found or INVALID_MOVE */
  play(playerID: PlayerID, card: Card): void;

  /** Throws if wrong player or INVALID_MOVE */
  selectTrump(playerID: PlayerID, suit: Suit): void;
}
```

### Turn management (critical implementation detail)

Each move method:

1. Builds a fresh `ctx` via `generateCtx` with current `currentPlayer`, `numPlayers`, `phase`, and computed `playOrder`.
2. Replaces `ctx.events.endTurn` and `ctx.events.endPhase` with `jest.fn()` spies before calling the move.
3. Calls the move function: `moveFunction(this.g, ctx, ...args)`.
4. If return value is `INVALID_MOVE`, throws `new Error("Move returned INVALID_MOVE")`.
5. Inspects `endTurnSpy`:
   - Called with `{ next: "N" }` -> set `g.currentPlayer = parseInt(next) as PlayerID`.
   - Called with no arguments -> advance to `nextPlayer(g.currentPlayer, numPlayers)` using the existing utility from `src/shared/entities/players.utils.ts`.
   - Not called (e.g. `selectTrump` calls `endPhase` instead) -> do not advance currentPlayer from endTurn.
6. Inspects `endPhaseSpy`:
   - If `endPhase` was called AND `endTurn` was NOT called: get next phase from the current phase config's `next` field, set `g.phase = nextPhase`. Return early.
7. Calls `_checkPhaseTransition()`.

### Phase transition logic (`_checkPhaseTransition`)

```
const phaseMap = {
  [Phase.Bidding]: bidding,      // from src/shared/phases/bidding.ts
  [Phase.Playing]: playing,      // from src/shared/phases/playing.ts
  [Phase.SelectingTrump]: selectingTrump,
  [Phase.Setup]: setup,
};
```

Steps:
1. Get `currentPhaseConfig = phaseMap[g.phase]`.
2. Build a lifecycle ctx with current state.
3. If `currentPhaseConfig.endIf(g, ctx)` returns true:
   a. Call `currentPhaseConfig.onEnd(g, ctx)` if it exists.
   b. If current phase is `Phase.Playing` -> set `_roundComplete = true`, stop (do NOT enter Setup).
   c. Otherwise, get `nextPhase = currentPhaseConfig.next`, set `g.phase = nextPhase`.
   d. Call `phaseMap[nextPhase].onBegin(g, ctx)` if it exists.

### The `play()` card index lookup

The `play` move function receives a card index relative to the **filtered** (non-null) hand (because it calls `getClientHand` internally which filters nulls). The runner must compute the index in the filtered hand:

```typescript
const rawHand = g.round!.hands[playerID];
const filteredHand = rawHand.filter((c): c is Card => c !== null);
const filteredIndex = filteredHand.findIndex(
  (c) => c.suit === card.suit && c.rank === card.rank
);
if (filteredIndex === -1) {
  throw new Error(`Card ${card.suit}/${card.rank} not found in player ${playerID}'s hand`);
}
```

Then call `play(g, ctx, filteredIndex)`.

### Acceptance criteria

- [ ] `new GameRunner(buildState({ phase: Phase.Bidding, round: { bids: [null, null, null, null] } }).g, 4)` creates runner without errors
- [ ] After `runner.bid(0, 2)`: `runner.currentPlayer === 1` and `runner.state.round!.bids[0] === 2`
- [ ] After all 4 valid bids: `runner.phase === Phase.Playing`
- [ ] After completing a full trick: `runner.state.round!.trickCount` is updated and `runner.currentPlayer` equals the trick winner
- [ ] After all tricks in a round: `runner.isRoundComplete === true`
- [ ] `runner.bid(1, 0)` when it's player 0's turn throws error containing "player 0's turn"
- [ ] `runner.play(0, cardNotInHand)` throws error containing "not found in player 0's hand"
- [ ] `runner.play(0, invalidCard)` where move returns INVALID_MOVE throws (does NOT return silently)
- [ ] Compiles cleanly with `pnpm run type-check`
- [ ] A test using `buildState()` + `GameRunner` running a full bidding phase then a 1-trick round passes

### Implementation hints

- Use `jest.fn()` for spies — Jest globals are available since file is under `src/test/`.
- Import `INVALID_MOVE` from `boardgame.io/core` for comparison.
- Import `nextPlayer` from `../../shared/entities/players.utils` — do not compute `(n + 1) % total` inline.
- `playing.onBegin` resets `trickCount` to zeros. This runs during Bidding->Playing transition. If a test pre-sets trickCount and starts in Playing phase, it is NOT reset (the runner only calls `onBegin` during phase transitions, not on construction).
- Do NOT implement shuffle/handout — the runner always starts from state produced by `buildState()` with explicit hands.
- The runner mutates `g` in place. `get state()` returns the same reference.

---

## Phase 3: Acceptance Tests

### File to create

`src/test/acceptance/playing-rules.test.ts`

### No jest config changes needed

The existing `testPathIgnorePatterns` in `jest.config.js` excludes `src/test/scenario` and `src/test/skip` but NOT `src/test/acceptance`. The default `testMatch` glob picks up `*.test.ts` files anywhere.

### Imports

```typescript
import { INVALID_MOVE } from "boardgame.io/core";
import { buildState, c, WIZARD, NULL_CARD } from "../utils/state-builder";
import { GameRunner } from "../utils/game-runner";
import { Suit, Rank } from "../../shared/entities/cards";
import { Phase } from "../../shared/phases/phase";
import { PlayerID } from "../../shared/entities/players";
import { play } from "../../shared/phases/playing";
import { updateScorePad } from "../../shared/entities/score.utils";
```

### Group A: Trick winner determination (use GameRunner)

**A1: Highest trump wins the trick**

- 3 players, 1 card each, trump = Red
- Player 0: `c(Suit.Blue, 5)` (leads Blue)
- Player 1: `c(Suit.Blue, 3)`
- Player 2: `c(Suit.Red, 2)` (trump)
- bids: `[1, 0, 1]`, trickCount: `[0, 0, 0]`
- After all plays: `trickCount[2] === 1`, `currentPlayer === 2`

**A2: First Wizard wins**

- 3 players, 1 card each, no trump
- Player 0: `WIZARD(Suit.Blue)` (first Wizard)
- Player 1: `WIZARD(Suit.Red)` (second Wizard)
- Player 2: `c(Suit.Green, 13)`
- After all plays: `trickCount[0] === 1`, `currentPlayer === 0`

**A3: All Nulls — first player wins**

- 3 players, each holds one Null card
- After all plays: `trickCount[0] === 1`

**A4: Null leads trick — next regular card sets lead suit**

- 3 players
- Player 0: `NULL_CARD(Suit.Blue)`
- Player 1: `c(Suit.Green, 5)` (sets lead to Green)
- Player 2: `c(Suit.Green, 3)`
- After all plays: `trickCount[1] === 1` (Green 5 > Green 3)

**A5: Trick winner becomes currentPlayer (leads next)**

- Same as A1 setup. After trick: `runner.currentPlayer === 2`

### Group B: Suit-following rules (call `play()` directly, no GameRunner)

For these tests, construct state with `buildState()` including an explicit `trick` with a `lead` card and `cards` array showing player 0 already played. Test player 1's move.

**B6: Different suit when holding lead suit -> INVALID_MOVE**

- Player 1's hand: `[c(Suit.Blue, 3), c(Suit.Red, 7)]`, lead = Blue
- `play(g, ctx, 1)` (Red 7, wrong suit) -> `=== INVALID_MOVE`

**B7: Trump when holding lead suit -> INVALID_MOVE**

- Player 1's hand: `[c(Suit.Blue, 3), c(Suit.Green, 2)]`, lead = Blue, trump = Green
- `play(g, ctx, 1)` (Green = trump, but player has Blue) -> `=== INVALID_MOVE`

**B8: Any card allowed when out of lead suit**

- Player 1's hand: `[c(Suit.Red, 3), c(Suit.Yellow, 7)]`, lead = Blue
- `play(g, ctx, 1)` (Yellow, not lead) -> NOT `INVALID_MOVE`

**B9: Null always allowed regardless of hand**

- Player 1's hand: `[NULL_CARD(Suit.Blue), c(Suit.Blue, 3)]`, lead = Blue
- `play(g, ctx, 0)` (Null) -> NOT `INVALID_MOVE`

**B9b: Wizard always allowed regardless of hand**

- Player 1's hand: `[WIZARD(Suit.Blue), c(Suit.Blue, 3)]`, lead = Blue
- `play(g, ctx, 0)` (Wizard) -> NOT `INVALID_MOVE`

### Group C: Multi-trick sequence (use GameRunner)

**C10: Complete 1-trick round -> round complete, scorePad updated**

- 3 players, `rounds: [1, 2]`, `roundIndex: 0`
- Hands: `[Blue 5], [Blue 7], [Blue 2]`, bids: `[0, 1, 0]`, no trump
- After all 3 plays:
  - `runner.isRoundComplete === true`
  - `runner.state.round!.isComplete === true`
  - `trickCount[1] === 1` (Blue 7 highest)
  - `scorePad.length === 1`
  - Player 1 score: 30 (bid 1, won 1: 20 + 10)
  - Players 0, 2 score: 20 each (bid 0, won 0: 20)

### Group D: Score calculation (call `updateScorePad` directly)

No GameRunner or buildState needed.

**D11: Hit bid exactly -> 20 + bid x 10**

```typescript
const result = updateScorePad([2, 1, 0], [2, 1, 0], 3, []);
expect(result[0].playerScores[0].score).toBe(40); // 20 + 2*10
expect(result[0].playerScores[1].score).toBe(30); // 20 + 1*10
expect(result[0].playerScores[2].score).toBe(20); // 20 + 0*10
```

**D12: Bid 0, win 0 -> 20**

**D13: Bid 2, win 1 -> -10**

**D14: Bid 0, win 1 -> -10**

### Acceptance criteria

- [ ] All tests pass with `pnpm test`
- [ ] No DOM rendering — no React, no `render()`, no `@testing-library/*`
- [ ] No `boardgame.io/client` instantiation
- [ ] Each test is self-contained (own `buildState()` call, no shared mutable state)
- [ ] Total runtime under 5 seconds
- [ ] Picked up by default jest config without changes
- [ ] Group D tests call `updateScorePad` directly (no GameRunner)

### Implementation hints

- The `play` move initializes the trick internally when `!g.trick || g.trick.isComplete`. For Group B direct-call tests, provide `trick` explicitly in `buildState` so the lead card is set.
- For Group A tests, use `GameRunner` which handles trick initialization automatically.
- In test C10, `playing.onBegin` resets `trickCount` to zeros during phase transition. Since the test starts in `Phase.Playing` (no transition occurs), the provided `trickCount` is kept.
- `canPlayCard` throws if `leadCard.rank === Rank.N`. Never set `trick.lead` to a Null card in Group B tests.
- Score formula: `diff = |tricks - bid|`. If `diff > 0` -> `diff * -10`. Otherwise -> `20 + bid * 10`.

---

## Dependencies and sequencing

```
Phase 1 (state builder) -- no dependencies
    |
    v
Phase 2 (game runner) -- tests use buildState() from Phase 1
    |
    v
Phase 3 (acceptance tests) -- uses both buildState() and GameRunner
```

## Files summary

| File | Action | Description |
|------|--------|-------------|
| `src/test/utils/state-builder.ts` | Create | `buildState()`, `c()`, `WIZARD`, `NULL_CARD` |
| `src/test/utils/game-runner.ts` | Create | `GameRunner` class |
| `src/test/acceptance/playing-rules.test.ts` | Create | 14 acceptance tests |
| `jest.config.js` | No change | Already picks up `src/test/acceptance/` |
| Existing phase test files | No change | Local `generate()` functions left as-is |
