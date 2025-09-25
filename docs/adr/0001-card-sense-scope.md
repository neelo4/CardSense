# ADR 0001: CardSense Prototype Scope

## Context

The hiring brief emphasises:
- TypeScript-heavy React Native delivery with React 19 (hooks, Suspense, concurrent rendering).
- Demonstrable collaboration with native Kotlin/Swift engineers for secure banking flows.
- Cloud-native, testable architecture that can evolve into microservices-backed production work.

## Decision

Build a rapid prototype named **CardSense** that focuses on the high-signal journey of issuing and managing a travel-ready virtual card. The prototype should:
- Showcase modern React data fetching (React Query + Suspense) and finite-state orchestration (XState).
- Provide a seam for native modules (`CardControls` TurboModule) without blocking UI progress.
- Use Tailwind via NativeWind for initial velocity, with a path to extract tokens into a design system package later.
- Stub service calls with deterministic latency helpers (`simulateNetwork`, `simulateMutation`) so UX polish and concurrency behaviour are observable without a real backend yet.

## Consequences

- **Positive**: Fast iteration while still demonstrating senior-level architecture, state modelling, and native collaboration points. Easy to expand with Detox tests and actual APIs.
- **Negative**: Tailwind utilities can drift without governance; we must formalise tokens before scaling. Mock services mask real-world auth concerns—subsequent milestones should introduce secure storage and networking.
- **Next Actions**:
  1. Implement the native `CardControls` module and replace the JS fallback.
  2. Introduce secure key management (Kotlin Jetpack Security / Swift Keychain) behind that bridge.
  3. Add observability hooks (OpenTelemetry tracing) once services exist.
