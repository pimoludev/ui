# Proposed roadmap

This document orders the work by technical dependency. It promises neither a
date nor a feature that is already delivered.

1. **Stabilise what exists.** Track the verified work and the remaining
   page-by-page review in [QUALITY_AUDIT.md](QUALITY_AUDIT.md). Check the 131
   Playground pages in light/dark and the seven presets, then complete the
   complex-component accessibility cases, forced colors, reduced motion and RTL.
2. **Fix the design system contracts.** Document the public tokens, check
   contrast and states, establish visual references for Default and the other
   presets, then reduce the remaining isolated CSS values.
3. **Stabilise the published distribution.** Five compiled library packages are
   available on npm at `0.1.0-beta.1`. Keep exports, peer dependencies and the
   SemVer policy aligned; expand the React/Next.js compatibility matrix and
   validate installation outside the monorepo before subsequent releases.
4. **Complete the developer experience.** Bilingual component documentation,
   production examples, better navigation and possibly visual/E2E tests once a
   tool is chosen.
5. **Extend the platforms.** Reuse palettes and visual tokens as data on React
   Native, then define suitable native components. Evaluate Angular, Electron
   and CDN separately with a capability matrix; never share React code blindly.
6. **Extend the ecosystem.** Public website, AI/MCP tooling and other products
   after the library and its distribution are stable.

The GitHub CI stays deliberately disabled while the existing work is being
polished. Re-enabling it and branch protection require an explicit maintainer
decision.
