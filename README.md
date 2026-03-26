# Vue 3.5.31 Teleport + Suspense Regression

Minimal reproduction for a regression in Vue 3.5.31 where navigating between Nuxt pages (SSR) that use `<teleport to="body">` with component children inside `<Transition>` crashes.

## Steps to reproduce

```bash
npm install
npm run dev
```

1. Open http://localhost:3000
2. Click **"Go"**
3. Check the browser console

## Expected

Navigation completes without errors.

## Actual (Vue 3.5.31)

**Dev mode** (`npm run dev`):

```
RangeError: Maximum call stack size exceeded
    at queuePostFlushCb
    at queueEffectWithSuspense
    at Object.process
    at flushPostFlushCbs
    at flushJobs
    (infinite recursion)
```

**Production mode** — observed in a real-world Nuxt web app:

```
TypeError: Cannot destructure property 'bum' of 'y' as it is null.
    at unmountComponent
    at unmount
    at Object.remove (Teleport.remove)
```

The page freezes — URL updates but the UI does not re-render.

## With Vue 3.5.30 — no error

Changing `vue` to `3.5.30` in `package.json` and `overrides`, then running `rm -rf node_modules .nuxt && npm install && npm run dev` — the same steps produce **no errors**.

## Scenario

- Nuxt 4 app with SSR enabled
- Page A (`index.vue`):
  - `await useFetch()` in setup (triggers Suspense wrapping by `<NuxtPage>`)
  - Two `<teleport to="body">` with `<Transition>` wrapping `v-if` content containing nested components
  - Reactive state changes after `navigateTo()` (clear items array + reset flag in `finally`)
- Page B (`page-b.vue`): has async setup (`await useFetch(...)`) and its own `<teleport to="body">`
- The crash occurs during the Suspense branch swap — deferred Teleport post-flush callbacks create an infinite loop in the scheduler (`queueEffectWithSuspense` → `flushJobs` cycle)

## Candidate PRs (merged between 3.5.30 and 3.5.31)

All merged on the same day and interact with Suspense/Teleport/unmount:

| PR | Description | Suspicion |
|----|-------------|-----------|
| [#9392](https://github.com/vuejs/core/pull/9392) | `fix(suspense): avoid unmount activeBranch twice if wrapped in transition` | High |
| [#8619](https://github.com/vuejs/core/pull/8619) | `fix(runtime-dom): defer teleport mount/update until suspense resolves` | High |
| [#12922](https://github.com/vuejs/core/pull/12922) | `fix(suspense): update suspense vnode's el during branch self-update` | Medium |

## Environment

- **Works**: Vue 3.5.30
- **Broken**: Vue 3.5.31+
- **Framework**: Nuxt 4 (`^4.1.1`, SSR mode)

```
