# Angular Development Guidelines - Poker Tracker

## Architecture

Organize code by feature and keep UI, domain rules, and persistence separate. Prefer clear ownership and small APIs over generic layers that do not solve a current need.

- Components render and coordinate one UI responsibility.
- Domain models and pure calculations live outside components.
- Feature services own feature state and persistence boundaries.
- A leaderboard is derived from player identities and session results; do not persist duplicate totals that can drift from session data.
- Depend on another feature through its public barrel, not through its internal file paths.
- Use explicit `import type` for type-only dependencies.

## Feature Layout

```text
feature/
	components/
		feature-item/
			feature-item.component.ts
			feature-item.component.html
			feature-item.component.spec.ts
			feature-item.component.scss   # only when needed
	data-access/
		feature.service.ts
	models/
		feature.model.ts
		feature.model.spec.ts           # for domain calculations
	index.ts                          # public API for other features
```

Use each component's own directory and keep it atomic. For example, a player card receives a required `PlayerStatistics` input and displays it; it does not fetch players or aggregate sessions itself. Put calculations such as net profit (`totalCashOut - totalBuyIn`) in pure domain functions and test those directly.

## Components

Each component has a dedicated directory and, when it has behavior or rendering worth verifying, a colocated spec. Templates belong in HTML files. Component-specific styles belong in colocated SCSS and are Angular-encapsulated. Do not add a global stylesheet for application layout or theme; place the app shell and feature styling in their owning components. Omit an SCSS file when no custom styles are needed.

Prefer standalone components, explicit imports, typed required inputs for required data, and no business or persistence logic in templates. Keep components focused on rendering and user interaction.

## Domain Rules

- A player is an identity; lifetime totals are derived from session participation.
- A session contains player IDs, buy-ins, and cash-outs. It does not duplicate player names.
- A session is balanced when the sum of its buy-ins equals the sum of its cash-outs, within the currency rounding tolerance.
- Attendance is the number of sessions with a result for that player, not the total number of sessions.
- Keep parsers and persistence adapters at the data-access boundary; map imported data to domain models there.

## Public APIs and Barrels

Each feature exposes only its cross-feature API from `index.ts`. Model-only imports use `models/index.ts`; data-access APIs use `data-access/index.ts`. These boundaries keep domain/UI imports from pulling persistence services into the graph or creating cycles. Use the configured `@app/<feature>`, `@app/<feature>/models`, and `@app/<feature>/data-access` aliases for cross-feature imports. Internal files may use relative imports within their own feature. Keep barrel exports intentional; avoid wildcard-exporting implementation details.

`src/app/barrels.json` is a discovery catalog for feature barrels. TypeScript `index.ts` files and the `paths` mappings in `tsconfig.json` remain authoritative; update the catalog when a public feature barrel is added or removed.

## Styling

Keep styles close to the component they affect. Do not add app-wide rules to `src/styles.scss`. The app shell may own viewport-level layout rules, while feature components own their page and component styles. Avoid styling another component's internals; expose a deliberate input or host class instead.

## Testing and Validation

- Unit-test domain calculations with representative domain data, including absent attendance and unbalanced sessions.
- Test component rendering at the component boundary using required inputs.
- Run the focused spec after changing a feature, then run `npm run build` for Angular template/type validation.
- Do not add tests that assert implementation details when observable behavior can be tested instead.
