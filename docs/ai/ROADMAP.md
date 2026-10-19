# Roadmap proposée

Ce document ordonne le travail selon les dépendances techniques. Il ne promet pas de date ni de fonctionnalité déjà livrée.

1. **Stabiliser l'existant.** Traiter les écarts trouvés par l'audit, vérifier le rendu et les interactions des 20 familles en light/dark et six presets, puis compléter les cas d'accessibilité à risque (menus, focus, formulaires, forced colors, RTL).
2. **Fixer les contrats du design system.** Documenter les tokens publics, contrôler contraste et états, établir des références visuelles pour Default et les autres presets, puis réduire les valeurs CSS isolées encore présentes.
3. **Fiabiliser la distribution.** Définir le packaging compilé, les exports et peer dependencies, une matrice React/Next.js, des exemples d'installation hors monorepo et la politique SemVer. Ne publier qu'après validation de ces contrats.
4. **Compléter l'expérience développeur.** Documentation bilingue des composants, exemples de production, meilleure navigation et éventuellement tests visuels/E2E après choix d'outil.
5. **Étendre les plateformes.** Réutiliser palettes et tokens visuels comme données sur React Native, puis définir des composants natifs adaptés. Évaluer Angular, Electron et CDN séparément avec une matrice de capacités ; ne pas partager aveuglément le code React.
6. **Étendre l'écosystème.** Site public, outils IA/MCP et autres produits après stabilisation de la bibliothèque et de sa distribution.

La CI GitHub reste volontairement désactivée pendant le polissage de l'existant. Sa réactivation et la protection de branche demandent une décision explicite du mainteneur.
