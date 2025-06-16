# Civet + Svelte 5 🚀 Proof-of-Concept

Welcome to **sv-civet-proof-of-concept** – a tiny application that shows how the
 **[Civet](https://github.com/DanielXMoore/Civet)** language pairs perfectly with the
 **Svelte 5**.

---

## ✨ Key language features on display

| Civet feature | Where to look | What it does |
| ------------- | ------------ | ------------ |
| Pipe operator `|>` | `src/routes/+layout.civet` | Streams async fetch → transformation steps with zero nesting. |
| Object globs `.{foo,bar}` | `+layout.civet` | Extract only the props you need. |
| Pattern-matching `switch` | `src/lib/LiveDemo.svelte` | Declaratively describe UI states without `if/else` ladders. |
| Implicit returns `->` | `LiveDemo.svelte`, `UserCard.svelte` | Goodbye `return`; the last expression is enough. |
| `$derived do` multi-line reactivity | `LiveDemo.svelte` | Compute reactive values with full block scope clarity. |
| Math-style comparisons (`0 < x < 2`) | `LiveDemo.svelte` | Readably express numeric ranges. |
| `@` alias for `this` | `src/routes/class.svelte.civet` | Remove the `this.` noise inside classes. |

---

## 📂 Project tour

```
src/
├── lib/
│   ├── LiveDemo.svelte      ← Interactive user list (Civet)
│   ├── ShowcaseCard.svelte  ← Civet vs TypeScript code diff viewer
│   ├── UserCard.svelte      ← Small, expressive card component
│   ├── showcase-data.civet  ← Data that powers the comparison cards
│   └── types.civet          ← Shared `User` type
├── routes/
│   ├── +layout.civet        ← Loads data using Civet features
│   ├── +layout.svelte       ← Passes data to children
│   ├── +page.svelte         ← Home page wiring everything together
│   └── class.svelte.civet   ← Reactive `UserManager` class
└── …
```

---

## ⚡ Getting started

1. Install dependencies (*PNPM is recommended but not required*):

```bash
pnpm install    # or `npm install`, `bun install`
```

2. Start the development server:

```bash
pnpm dev        # default: http://localhost:5173
```

3. Build and preview a production bundle:

```bash
pnpm build
pnpm preview    # serves the ./build output
```

