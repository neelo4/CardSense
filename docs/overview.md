# CardSense Prototype Overview

CardSense is a rapid React Native prototype that demonstrates how a lead UI/mobile engineer can orchestrate a resilient fintech journey end-to-end. It simulates the issuance and control of a travel-ready virtual card while showcasing React 19 features, advanced TypeScript patterns, and seams for native Kotlin/Swift integrations.

---

## Experience Summary

| Surface | Description |
| --- | --- |
| **Mobile (iOS/Android)** | React Native app built with TypeScript, Tailwind/NativeWind styling, Suspense-driven data flows, and state machines. Native Kotlin/Swift bridges are stubbed in TypeScript and can be swapped to real TurboModules. |
| **Web demo (Vercel)** | The same React component tree compiled for the web via Expo + React Native Web. A Tailwind CLI build emits `src/styles/tailwind.css`; `App.tsx` conditionally loads it in browsers so the web bundle shows the styled journey. |
| **Native bridge seam** | `src/native/cardControls.ts` exposes the TurboModule contract for locking/unlocking the card. A Kotlin/Swift implementation can replace the JS fallback without changing React code. |

---

## Key Technologies

- **React Native 0.81 / Expo 54** with React 19 concurrency.
- **TypeScript strict mode** with feature-sliced structure under `src/`.
- **NativeWind + Tailwind CSS** for utility-first styling (generated CSS for the web bundle, runtime classes for native).
- **@tanstack/react-query** Suspense mode and **XState** finite-state machine for deterministic onboarding flows.
- **Mock service layer** (`src/services/`) using deterministic latency helpers to simulate cloud microservices.
- **Native module abstraction** (`src/native/`) showcasing TurboModule contracts and helper utilities.
- **Testing hooks**: TypeScript type checks via `npx tsc --noEmit`; ready for Jest/Detox integration.

---

## Repo Structure

```
App.tsx                      # Entry point, provider wiring, platform-specific CSS injection
src/
  core/                      # App shell, Suspense boundary, React Query provider
  features/onboarding/       # Domain slice with state machine, hooks, and UI
  native/                    # TypeScript facades for native TurboModules
  services/                  # Simulated microservice facades
  styles/tailwind.css        # Generated Tailwind bundle for web builds
  design-system/             # (placeholder for future tokenized system)

docs/
  overview.md                # This document
  adr/0001-card-sense-scope.md
```

---

## Local Development

```bash
npm install
npm run ios        # or npm run android / npm run web
```

Tailwind classes work out-of-the-box via NativeWind on native. Metro caches aggressively, so if styling looks stale when developing for the web run `npx expo start --web --clear`.

### Static Web Bundle

```bash
npm run build:web
```

This script runs `tailwindcss -i global.css -o src/styles/tailwind.css --minify` and `expo export --platform web --output-dir dist`. Deploy the contents of `dist/` to any static host.

- **Vercel deployment**
  ```bash
  npm install -g vercel
  vercel dist
  ```
  Use `dist` (or `dist/web`) as the project root, no build command, output directory `.`. Vercel provides an instant URL suitable for resumes/portfolio pages.

### Native Preview (Expo Go / Devices)

1. `npx expo login`
2. `npx expo publish --release-channel demo`

Expo will host the bundle at `https://expo.dev/@<username>/cardsense?release-channel=demo`. Share the link so recruiters can open the prototype in Expo Go on iOS/Android.

---

## Highlighted Implementation Details

- **Suspense + React Query**: `useCardProfileQuery` streams the virtual card profile into `CardOnboardingScreen` with skeleton fallbacks and shared error boundaries.
- **XState machine**: `cardIssuanceMachine` models the risk-check workflow, allowing deterministic transitions and future integration with server events.
- **Native bridge fallback**: `withCardLock` wraps `cardControlsModule.lockCard` and `unlockCard`, guaranteeing cleanup even when using the JS mock. This is where Kotlin/Swift code (e.g. secure storage, WorkManager tasks) would plug in.
- **Tailwind on web**: `App.tsx` requires `src/styles/tailwind.css` only when `Platform.OS === 'web'`, avoiding runtime issues on native and giving the web bundle the full dark theme.
- **Documentation-first**: ADR recorded in `docs/adr/0001-card-sense-scope.md`; this overview provides the architecture story for portfolio/recruiter sharing.

---

## Next Steps (Roadmap)

1. **Native modules**: Implement the TurboModule in Kotlin/Swift to call secure keystore APIs, biometric locking, and haptic feedback.
2. **Backend integration**: Replace mock services with live GraphQL/tRPC endpoints, streaming into React Query Suspense.
3. **Testing**: Add Jest unit tests for hooks and state machines, Detox for end-to-end flows, and CI via GitHub Actions.
4. **Design system**: Extract recurring Tailwind tokens into a reusable component library (`packages/design-system`) once the UI stabilizes.
5. **Observability**: Instrument OpenTelemetry traces across the network layer and surface metrics via a cloud dashboard.

---

## Portfolio Usage Tips

- Link the GitHub repo (with this documentation) and the Vercel demo in your resume/portfolio.
- Include a short Loom/ScreenFlow walkthrough demonstrating the Suspense skeleton, risk-check state transitions, and native lock mock.
- For native emphasis, mention that the `CardControls` TurboModule is ready for Kotlin/Swift implementations and describe the future secure-storage flow in interviews.

