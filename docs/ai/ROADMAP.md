# Proposed roadmap

This document orders the work by technical dependency. It promises neither a
date nor a feature that is already delivered.

1. **Stabilise what exists.** Address the gaps found by the audit, review the
   rendering and the interactions of the 83 families in light/dark and the seven
   presets, then complete the risky accessibility cases (menus, focus, forms,
   forced colors, RTL).
2. **Fix the design system contracts.** Document the public tokens, check
   contrast and states, establish visual references for Default and the other
   presets, then reduce the remaining isolated CSS values.
3. **Make the distribution reliable.** Define the compiled packaging, the
   exports and peer dependencies, a React/Next.js matrix, installation examples
   outside the monorepo and the SemVer policy. Publish only after those
   contracts are validated.
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
