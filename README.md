# CardSense Prototype

CardSense is a rapid mobile prototype that demonstrates how to fuse TypeScript-heavy React Native feature work with native Kotlin/Swift bridges. It emulates a fintech concierge flow where travellers can spin up virtual cards, inspect realtime insights, and exercise emergency controls.

## Highlights

- **React 19 + Suspense**: Data flows are composed with `useSuspenseQuery` and custom `SuspenseBoundary` wrappers to show streaming-friendly UIs and error recovery.
- **TypeScript-first architecture**: Feature slices (`src/features/*`) own their machines, hooks, and service facades with strict types and statecharts via XState.
- **Tailwind via NativeWind**: Utility-first styling keeps iteration fast while we prepare a reusable design system library.
- **Native bridge seam**: `src/native/cardControls.ts` sketches a TurboModule access layer with ergonomic helpers (`withCardLock`) so Kotlin/Swift modules can drop in without touching UI code.
- **Mocked service mesh**: `src/services/mockApi.ts` provides deterministic latency and mutation helpers; easy to swap with real microservices later.

## Getting started

```bash
npm install
npm run ios # or npm run android / npm run web
```

Tailwind classes are powered by NativeWind, so any component can receive a `className` prop. Adjust theme tokens inside `tailwind.config.js`.

### Build a shareable web bundle

```bash
npm run build:web      # regenerates src/styles/tailwind.css and outputs dist/
# deploy dist/ to Vercel/Netlify, e.g. `vercel dist`
```

The `build:web` script compiles Tailwind via the CLI (`global.css` → `src/styles/tailwind.css`) and then runs `expo export --platform web`. `App.tsx` conditionally loads the generated CSS when running on the web so the React Native screens render with the same NativeWind styling.

## Project structure

```
apps/mobile (this app)
  App.tsx                    // Provider wiring + entry point
  src/core                   // App-level shells and shared providers
  src/features/onboarding    // Feature slice with state machine + hooks
  src/native                 // TypeScript facades for native Kotlin/Swift modules
  src/services               // Mock network/service abstractions
```

## Native module roadmap

1. **CardControls TurboModule**
   - Kotlin/Swift implementations expose secure lock/unlock, spending limit orchestration, and haptic feedback hooks.
   - Replace the JS fallback in `src/native/cardControls.ts` once native code is added.
2. **InsightCharts Fabric component**
   - SwiftUI/Jetpack Compose powered chart surface exported through Fabric for buttery animations; consumed as a simple React component.
3. **RiskEngine worker**
   - Kotlin coroutines or Swift concurrency job that performs on-device risk scoring; results flow back via the bridge and hydrate React Query cache.

## Next steps

- Add Detox smoke test covering the virtual card issuance happy path.
- Publish a `@cardsense/design-system` package and gradually swap Tailwind utility classes for themed components.
- Introduce GraphQL/tRPC client with Suspense streaming once the cloud microservices are in place.
- Flesh out CI with GitHub Actions running type checks, tests, and EAS build previews.
