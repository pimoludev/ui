# Pimolu UI — Spécification d’identité visuelle v0.1

> **Statut :** PROPOSITION À TESTER — ni décision définitive, ni autorisation de publication stable.  
> **Thèse provisoire :** *Calm precision. Warm character.* (« Précision calme. Caractère chaleureux. »)  
> **Default candidat :** Ink & Signal  
> **Typographies candidates :** DM Sans / Newsreader / IBM Plex Mono  
> **Périmètre :** pilote visuel React/Next.js ; tokens conçus pour rester partageables entre plateformes.

## 0. Contrats déjà décidés — ne pas rouvrir

**État au 4 novembre 2026 :** le prototype visuel fourni par le mainteneur sert
de référence. La branche `feat/ink-and-signal` traduit maintenant cette direction
dans les vrais tokens et composants. Design Lab (versionné) et `/design-preview`
(revue locale facultative ignorée par Git) proposent
les trois compositions fonctionnelles et la comparaison avec beta.6. La version
npm reste inchangée ; la validation globale et l'adoption stable restent ouvertes.
Le neutre atténué clair est ajusté à `#F4F0EC`, et le contour fonctionnel sombre
à `#857D90`, pour conserver les seuils de contraste sur les surfaces atténuées.

Ce pilote **ne modifie pas** l’architecture existante :

- Tokens, thèmes et presets sont **des données**.
- Les presets **ne contiennent pas de sélecteurs de composants**.
- Le pilotage existant des thèmes reste la référence : `data-pimolu-theme`, `data-pimolu-style`, rayon, densité et couleur de marque.
- Le web consomme du **CSS pur** à variables `--pimolu-*`.
- Compatibilité Tailwind et personnalisation par parties typées restent obligatoires.
- Les **sept presets existants** restent `default`, `monochrome`, `cartoon`, `glass`, `luxury`, `neo-brutalism`, `adaptive`.
- Accessibilité, `prefers-reduced-motion` et `forced-colors` font partie du contrat.
- La stable reste bloquée jusqu’à la fin de l’audit qualité déjà prévu.

**Hors périmètre :** nouveau preset, nouvelle API de thème, réalisation native, export Figma ou décision sur le nombre de composants. Tester le **Default visuel** dans une branche de travail, sans créer un huitième preset. Les noms de rôles ci-dessous sont des **alias sémantiques proposés** à raccorder au schéma de tokens existant ; ne pas renommer automatiquement l’API publique.

## 1. Thèse de design

**Calm precision. Warm character.**

- **Calme :** espace, peu de bruit visuel, surfaces essentiellement neutres.
- **Précision :** alignements, hiérarchie lisible, états interactifs cohérents, focus net.
- **Chaleur :** fond papier légèrement chaud, courbes accueillantes, identité de marque discrète.
- **Clarté éditoriale :** titres composés avec soin, police à empattements réservée à certains contextes de communication.
- **Retenue tactile :** feedback perceptible et rapide, sans animation spectaculaire permanente.

### Ce que Pimolu Default ne doit pas devenir

- Ni enfantin ni cartoon, même si la mascotte Pimo peut avoir une personnalité ludique.
- Ni rempli de gradients, de halos, de flous et d’animations d’entrée sur le contenu à lire.
- Ni figé dans une seule identité violette : une application cliente doit pouvoir utiliser sa propre couleur et sa propre typographie.
- Ni élégant au détriment de l’accessibilité ou de la densité d’information.

**Séparation de principe :** le site marketing Pimolu peut être plus éditorial et faire apparaître Pimo ; les composants Default doivent rester suffisamment neutres pour représenter la marque de leurs utilisateurs.

## 2. Palette candidate — Ink & Signal

Les valeurs hexadécimales sRGB suivantes sont des **points de départ à vérifier**, pas les tokens générés finaux.

| Rôle sémantique | Clair | Sombre | Usage prévu |
|---|---|---|---|
| Canvas / fond de page | `#FAF8F5` | `#18161D` | Arrière-plan |
| Surface élevée | `#FFFFFF` | `#24212A` | Cartes, dialogs, popovers |
| Encre / texte principal | `#26232D` | `#F6F2EF` | Titres, corps de texte |
| Texte secondaire | `#706B73` | `#B8B0BD` | Informations secondaires |
| Signal / accent iris | `#6746C7` | `#B9A5FA` | Actions prioritaires, liens, focus |
| Signal doux | `#F0EBF9` | `#30283E` | Sélections, badges secondaires |
| Texte sur accent | `#FFFFFF` | `#21172D` | Boutons de couleur iris |
| Séparateur décoratif | `#E7E0D9` | `#39343E` | Lignes de séparation **non essentielles** |
| Contour fonctionnel | `#8E8490` | `#837B8E` | Champs, limites de contrôles nécessaires |

### Premiers contrastes calculés (WCAG, arrondis)

| Paire | Ratio | Prévalidation |
|---|---:|---|
| Texte principal clair sur surface blanche | **15,43:1** | Conforme pour le texte courant |
| Texte secondaire clair sur surface blanche | **5,20:1** | Conforme pour le texte courant |
| Texte secondaire clair sur fond papier | **4,90:1** | Conforme pour le texte courant |
| Signal clair sur blanc | **6,41:1** | Conforme pour le texte courant |
| Blanc sur signal clair | **6,41:1** | Conforme pour le texte courant |
| Texte principal sombre sur surface sombre | **14,23:1** | Conforme pour le texte courant |
| Texte secondaire sombre sur surface sombre | **7,53:1** | Conforme pour le texte courant |
| Signal sombre sur surface sombre | **7,41:1** | Conforme pour le texte courant |
| Texte sombre sur accent sombre | **8,02:1** | Conforme pour le texte courant |
| Séparateur clair sur blanc | **1,31:1** | Insuffisant comme **unique contour fonctionnel** |
| Séparateur sombre sur surface sombre | **1,31:1** | Insuffisant comme **unique contour fonctionnel** |
| Contour fonctionnel clair sur fond papier | **3,38:1** | Conforme pour la limite non textuelle d’un contrôle |
| Contour fonctionnel sombre sur surface sombre | **3,91:1** | Conforme pour la limite non textuelle d’un contrôle |

Calculs réalisés sur les couleurs opaques exactes. **Ne pas extrapoler** à une superposition transparente, à un état hover, aux couleurs danger/success/warning ou à une brand color arbitraire : ces combinaisons exigent leurs propres tests.

### Discipline colorimétrique

- Réserver le signal aux actions importantes, aux liens, au focus et à quelques accents.
- Ne pas communiquer un état **uniquement** par sa couleur.
- Conserver des rôles dédiés à danger, succès et avertissement ; les auditer séparément.
- Lors d’un changement de brand color, garantir un premier plan accessible (ou appliquer une stratégie de correction/fallback).

## 3. Typographies et usages

| Usage | Police | Graisses envisagées | Échelle initiale |
|---|---|---|---|
| Texte, formulaires, navigation, tableaux | **DM Sans** | 400, 500, 600, 700 | 14/20 ou 16/24 px |
| Titres éditoriaux / accueil de la marque | **Newsreader** | 400, 500 ; italique avec retenue | 40–64 px, interligne ~1,08–1,15 |
| Code, clés, identifiants techniques, certaines données | **IBM Plex Mono** | 400, 500 | 12/18 ou 13/20 px |

**Échelle de départ (taille/interligne) :** légende `12/16`, petit texte `14/20`, corps `16/24`, sous-titre `18/28`, titre de section `24/32`, titre de page `32/40`, hero `clamp(40px, 5vw, 64px)` avec interligne d’environ `1,1`.

- Newsreader ne devient **pas** la police des labels, tableaux et formulaires.
- Employer des chiffres tabulaires pour les tableaux de bord. Utiliser Mono lorsque cela facilite le balayage de données structurées, pas systématiquement pour tous les KPI.
- Prévoir des polices de secours robustes, y compris si le téléchargement des fonts échoue.
- Vérifier zoom 200 %, longues chaînes françaises/anglaises et textes dynamiques.

## 4. Formes, densité et mouvement — hypothèses de pilote

**Ces valeurs servent à comparer, elles ne tranchent pas les décisions encore ouvertes.**

| Paramètre | Valeur candidate | Objectif du test |
|---|---:|---|
| Rayon des contrôles | `10px` | Douceur sans effet « bulle » |
| Rayon des surfaces | `16px` | Hiérarchie claire des formes |
| Rayon pill | `9999px` | Pastilles et badges uniquement |
| Hauteur d’un contrôle standard | `40px` | Équilibre desktop |
| Hauteur d’un contrôle compact | `32px` | Densité élevée, à vérifier |
| Cible tactile de design | `44px` | Test ergonomique touch (distinct du minimum WCAG) |
| Rythme d’espacement | `4, 8, 12, 16, 24, 32, 48px` | Règles cohérentes |
| Largeur de contenu marketing | `1120px` max | Composition lisible |
| Feedback hover/press | `120ms` | Réactivité immédiate |
| Transition de surface | `220ms` | Ouverture/fermeture discrète |
| Famille easing | `cubic-bezier(.2,0,0,1)` | Cohérence des mouvements |

Respecter `prefers-reduced-motion: reduce`. Aucun contenu essentiel ne doit dépendre d’une animation ; éviter les animations d’entrée sur les longues zones de lecture.

## 5. Trois surfaces de référence — même contenu pour chaque direction

Comparer **Slate + Indigo actuel** et **Ink & Signal candidat** avec des contenus identiques, sans modifier le périmètre. Mineral peut rester une référence visuelle, sans devenir un preset.

1. **Marketing :** navigation, hero, deux CTA, trois cartes de fonctionnalités. Vérifie la personnalité éditoriale et la hiérarchie.
2. **Formulaire de connexion / paramètres :** labels, champs, checkbox, mot de passe, aide, validation, états disabled/loading/error et bouton principal. Vérifie lisibilité et limites de contrôles.
3. **Dashboard :** navigation, trois indicateurs, tableau de **8 lignes minimum**, filtres, données denses, action secondaire. Vérifie la précision à forte densité.

**Viewports :** `360px`, `768px`, `1440px` (+ vérification de débordement à `320px`). **Modes :** clair/sombre, densité standard/compacte, clavier seul, zoom 200 %, réduction des mouvements, forced colors. **États :** défaut, hover, press, focus-visible, disabled, loading, selected, error, success selon le composant.

## 6. Critères de validation

### A. Technique / accessibilité

- [ ] Contraste des textes courants **≥ 4,5:1** ; grands textes **≥ 3:1** quand le critère WCAG s’applique.
- [ ] Contraste des éléments graphiques de contrôle et indicateurs concernés **≥ 3:1**, selon le critère WCAG applicable.
- [ ] Parcours clavier complet, focus visuellement perceptible, pas de piège clavier, noms et rôles accessibles.
- [ ] Aucun problème critique/sérieux dans les contrôles axe-core sur les trois surfaces ; compléter par une revue manuelle.
- [ ] Pas de défilement horizontal de page à 320/360px, sauf région de données volontaire et accessible.
- [ ] Zoom 200 % : labels non coupés, actions essentielles accessibles.
- [ ] `prefers-reduced-motion` et `forced-colors` conservent toutes les informations et affordances.
- [ ] Changement de brand color, rayon et densité via les **mécanismes existants** sans casser le contraste ni les comportements.
- [ ] Police de secours satisfaisante si les webfonts ne chargent pas.
- [ ] Passage clair/sombre sans flash illisible ni perte d’état/focus.

### B. Revue de design

Faire évaluer les mêmes surfaces à **5–8 personnes**, dont des développeurs ne connaissant pas encore Pimolu. Montrer l’ancien Default et Ink & Signal dans un ordre alterné. Leur faire noter sur **1 à 5** : *calme, précision, chaleur, professionnalisme, lisibilité, distinction*. Demander trois adjectifs spontanés et les éléments confus, **sans donner les adjectifs attendus avant le test**.

**Hypothèse de succès indicative** (non statistiquement concluante) : médiane ≥ 4/5 sur calme, précision, chaleur, professionnalisme et lisibilité ; aucun problème récurrent dans les tableaux denses ; pas plus d’une personne ne juge le Default enfantin ou distrayant. Préférer les remarques qualitatives à une petite majorité arithmétique.

### C. Non-régression

- [ ] Correspondance avec les tokens `--pimolu-*` actuels, sans nouvelle API publique de thème.
- [ ] Presets toujours définis par des données, sans sélecteurs de composants.
- [ ] Les sept presets rendent toujours correctement et passent les comparaisons visuelles.
- [ ] Compatibilité Tailwind et personnalisation par parties typées intactes.
- [ ] Aucun changement imposé aux implémentations Native/Angular/HTML ni aux kits commerciaux.
- [ ] Aucun contournement de l’audit qualité ni du blocage de la stable.

## 7. Registre de décisions à compléter après les essais

| Sujet | Statut aujourd’hui | Preuves attendues |
|---|---|---|
| Thèse calme, précise, chaleureuse | **Candidate** | Avis structurés + états réels |
| Default Ink & Signal | **Candidat** | Trois écrans, contrastes et non-régression |
| DM Sans / Newsreader / IBM Plex Mono | **Candidat** | Marketing et dashboard dense, bilingue, fallback |
| Valeurs des rayons | **Hypothèse de pilote** | Formulaires, cartes, dialog |
| Valeurs du mouvement | **Hypothèse de pilote** | Feedback, reduced motion |
| Adoption définitive du Default | **Non décidée** | Critères A, B et C satisfaits |

**Règle de décision :** accepter seulement si les critères techniques passent et si les essais utilisateurs confirment la direction. Sinon, modifier les valeurs/roles ayant échoué et retester, sans remettre à plat toute l’architecture.

## 8. Ordre d’exécution pour l’équipe ou l’agent IA

1. Figer les contenus de comparaison et capturer le Default actuel.
2. Implémenter la correspondance des tokens Ink & Signal derrière une branche/activation **expérimentale**, et **non un huitième preset**.
3. Créer les trois surfaces avec les **vrais composants Pimolu existants**.
4. Exécuter les tests de contraste, d’accessibilité, de régression visuelle et de responsive.
5. Organiser la revue comparative, consigner les résultats.
6. Corriger uniquement les valeurs qui échouent, puis retester.
7. Rédiger une ADR courte : **retenu / itération / rejeté**, avec justificatifs et décisions reportées.

**Signature de communication candidate :** *Beautiful by default. Yours by design.* — slogan provisoire, pas une décision de marque définitive.
