# Poker Tracker – Data Architecture & Session Management

## 1. Core Concept

The application tracks poker games (sessions), the players who attend them, and their financial results.

Each session should be treated as an independent record. Player statistics should be calculated or aggregated from their session history.

The session data is the source of truth. Player totals are derived from historical session records.

This document describes both the current data model and the intended direction of the application. The current app displays seeded sessions, persists player and session data in browser local storage, and derives player statistics. Adding and tracking sessions is a core future capability, not out of scope. The session service has a basic balance check, but session entry and discrepancy review are not implemented. Robust handling of malformed stored data remains a future requirement.

## 2. Player Data

Each player should have a unique ID and a name.

Example:

```typescript
interface Player {
    id: string;
    name: string;
}
```

Players should persist between sessions, even if they do not attend for several months.

When importing a new session:

- Check whether each player already exists.
- Match existing players rather than creating duplicates.
- If no existing player matches, create a new player.
- Do not assume that someone is new simply because they haven't attended recently.
- Names should be used for initial matching, with IDs used for permanent identification.
- If multiple players have the same name, allow manual identification rather than automatically merging them.

## 3. Session Data

Each poker game is an independent session.

A session should contain:

- Unique session ID.
- Session date.
- List of participating players.
- Each player's total buy-in.
- Each player's final cash-out.

Example structure:

```typescript
interface PokerSession {
    id: string;
    date: string; // ISO date, e.g. "2026-11-01"
    note?: string;
    players: SessionPlayerResult[];
}

interface SessionPlayerResult {
    playerId: string;
    buyIn: number;
    cashOut: number;
}
```

This reflects the current model shape. Profit is derived as `cashOut - buyIn`; it is not stored separately on each session result.

A player should only appear in a session if they participated.

A player who goes bust should have a cash-out of `0`.

## 4. Buy-in and Cash-out Rules

Each player has two important financial values:

- **Buy-in:** Total money invested into the game, including rebuys.
- **Cash-out:** Total money received when leaving the game.

Profit is calculated as:

`Profit = Cash-out - Buy-in`

Examples:

| Buy-in (NZD) | Cash-out (NZD) | Profit (NZD) |
| -----------: | -------------: | -----------: |
|       NZ$100 |         NZ$150 |       +NZ$50 |
|       NZ$100 |         NZ$100 |         NZ$0 |
|       NZ$100 |          NZ$40 |       -NZ$60 |
|       NZ$100 |           NZ$0 |      -NZ$100 |

Negative profit represents a loss.

Players do not necessarily cash out. A player who loses everything has a cash-out of zero.

All monetary values are in NZD. The current implementation stores amounts as numeric dollar values; moving to integer cents should be considered when implementing session entry and persistence to avoid floating-point rounding issues.

## 5. Session Input and Parsing

Session results will initially be entered as raw text.

The application should parse this text into structured player records.

Example input:

### Rebuy

```text
Alex - 100
Eric - 50
Aum - 100
```

### Ending

```text
Aum - 143.75
Rene - 236.25
Eric - 120
```

### Additional buy-in data

```text
Rene - 50
Aum - 150
Eric - 100
Alex - 150
Dominic - 50
```

The application must combine all buy-in entries for each player, including rebuys.

The resulting structured data should look something like:

```typescript
{
  playerId: "player-id",
  playerName: "Alex",
  buyIn: 250,
  cashOut: 0
}
```

The player ID should reference the existing player record, or a newly created player if no match exists.

### Parsing Rules

1. Parse the buy-in and ending sections independently.
2. Aggregate multiple buy-in entries for the same player.
3. Match players across both sections.
4. Include players who only appear in the buy-in section.
5. Include players who only appear in the ending section, but flag them for review because their buy-in may be missing.
6. A missing cash-out should be treated as zero only when the player is confirmed to have participated and gone bust.
7. Calculate each player's profit.
8. Validate the overall session totals before saving.

## 6. Session Financial Validation

The total buy-in across all players should equal the total cash-out across all players.

This is a fundamental validation rule.

For the example data:

**Total buy-in (NZD)**

- Alex: NZ$250
- Eric: NZ$150
- Aum: NZ$250
- Rene: NZ$50
- Dominic: NZ$50

Total: NZ$750

**Total cash-out (NZD)**

- Aum: NZ$143.75
- Rene: NZ$236.25
- Eric: NZ$120

Total: NZ$500

<Important>These example figures do not balance. There is a NZ$250 discrepancy.</Important>

When session entry is implemented, the application should flag this discrepancy and prevent the session from being confirmed until it is resolved. Session validation is a required future capability; the current app does not yet provide a session-entry or discrepancy-review flow.

Possible reasons include:

- Missing cash-out entries.
- Incorrect buy-in amounts.
- Incorrect cash-out amounts.
- Missing player records.

Do not automatically adjust player results to force the totals to balance.

## 7. Player Statistics

Player statistics should be aggregated from their historical session records.

For each player, calculate:

- Total buy-in across all sessions.
- Total cash-out across all sessions.
- Total profit/loss.
- Number of sessions attended.
- Optional future statistics: win rate, average profit per session, biggest win and biggest loss.

A player who does not attend a session should have no impact on their statistics.

Player statistics should never be manually incremented independently of the session records, as this can cause inconsistencies.

## 8. General Architecture Rules

- Sessions are the source of truth for historical financial results.
- Players are persistent entities referenced by unique IDs.
- Session results reference players rather than duplicating player records.
- Multiple buy-ins must be aggregated into one session result per player.
- Players can attend any number of sessions, with no requirement for regular attendance.
- Never automatically merge players when identity is ambiguous.
- Validate financial totals before confirming a session.
- Do not silently discard or modify imported financial data.
- Keep raw input available during the parsing and validation process so errors can be corrected.

The overall objective is to maintain accurate historical session records and derive player statistics from those records.
