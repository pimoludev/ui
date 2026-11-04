# Pimolu platform roadmap

Status: **general sequence, not a release schedule.** Priorities are relative,
not dates. The technical dependency order remains in [ROADMAP.md](ROADMAP.md);
the product and identity direction is in
[DESIGN_DIRECTION.md](DESIGN_DIRECTION.md).

| Phase | What we build | Priority |
| --- | --- | --- |
| 1 | Design system + React + Next.js + Vite | Very high |
| 2 | Advanced components + Blocks + Electron support | High |
| 3 | React Native + Expo | Medium |
| 4 | Angular | Future |
| 5 | HTML/CSS/JS + CDN | Future |

## How to read the phases

- **Phase 1 is the active phase.** Finish the design system, React package,
  Next.js integration and Vite workflow before expanding the platform surface.
- **Phase 2, "Blocks"** means composed product recipes built from real Pimolu
  components, not a second component library. Electron is a distribution and
  integration target, not a separate registry.
- **Phase 3, React Native + Expo** consumes the same token and preset data with
  its own rendering. It does not reuse React DOM components blindly.
- **Phase 4, Angular** and **Phase 5, HTML/CSS/JS + CDN** stay future directions
  until the web CSS contract and the first platform are stable.
- A later phase does not block a small proof of concept, but it must not create a
  second source of truth or delay the quality gates of Phase 1.
