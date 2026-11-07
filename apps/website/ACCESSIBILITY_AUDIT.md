# Audit technique d’accessibilité — 21 octobre 2026

## Complément montage tardif et styles partagés — 7 novembre 2026

Le positionnement récupère une ancre dont la ref arrive après l'ouverture, sans
exiger de re-render, puis révèle le panneau à sa taille mesurée. Fermer ou démonter
annule l'attente. Les parcours de focus partagent les styles des ancêtres pendant
un appel seulement ; l'interaction suivante relit la visibilité courante.

Validation : 1 544 tests React, 50 tests de documentation, 24 scénarios sur le site
dans Chromium/Firefox/WebKit et 12 cas navigateur supplémentaires avec les vrais
composants et mesures DOM. Dans le harnais de mise à jour de contenu, les mesures
d'ancre restent à trois avant/après le re-render ; cela ne constitue pas un
benchmark global de DataGrid ou Command. La matrice visuelle Chromium de 84 cas
est également relancée. Aucune validation par lecteur d'écran ajoutée dans ce lot.

## Complément focus conditionnel et contraintes latérales — 7 novembre 2026

Les éléments masqués par CSS ou par un ancêtre hidden/inert ne participent plus
au focus initial ou aux cycles clavier. Les fieldsets désactivés et le contenu
de details fermés sont exclus. ContextMenu conserve sa navigation par flèches
entre éléments à tabIndex négatif. La régression Dialog avec une première action
masquée est couverte par les tests et par un exemple réel.

Select suit le redimensionnement local de son déclencheur. Les Popover gauche et
droite limitent leur hauteur, permettent de défiler jusqu'au dernier contrôle et
respectent la largeur disponible sur mobile. La mesure initiale avant affichage
et le retour de focus au déclencheur sont conservés.

La suite React complète passe (1 539 tests). Les scénarios navigateur dédiés
couvrent mobile/desktop et Chromium/Firefox/WebKit ; la matrice visuelle utilise
sept presets, clair/sombre et deux largeurs. Les résultats finaux sont enregistrés
dans le suivi d'implémentation et les preuves `.artifacts/bugfix-*`. Ce périmètre
n'est pas un audit par lecteur d'écran ni un test sur appareils tactiles physiques.
Correctifs dans les sources après beta.7, non publiés sur npm.

Résultat final : 24 régressions placement/focus et 51 scénarios Blocks réussis
dans Chromium, Firefox et WebKit. La matrice visuelle de 84 cas est passée ; les
captures de chaque preset/mode ont été examinées aux largeurs 390 et 1440px.
Les tests latéraux vérifient les quatre limites du viewport, le défilement et
l'accès au dernier contrôle ; les tests Dialog vérifient Tab, Maj+Tab et Escape.

## Complément surfaces flottantes — 7 novembre 2026

Le positionnement partagé masque les panneaux pendant leur mesure initiale.
Les menus, popovers et calendriers prennent le focus seulement après affichage ;
Escape conserve le retour au déclencheur. Popover reprend correctement le focus
si on le rouvre pendant sa fermeture. La correction est dans les sources après
beta.7, pas encore dans les paquets npm publiés.

Contrôles ciblés : 266 tests React réussis et 114 cas navigateur sur le playground
compilé. Les 84 cas Select couvrent sept presets, clair/sombre et deux largeurs
dans Chromium, Firefox et WebKit ; les 30 autres couvrent le focus de cinq
surfaces dans les trois moteurs et aux deux largeurs. Ce contrôle ne remplace
pas un audit de lecteur d'écran ou un test tactile sur appareil physique. La
génération complète du site reste bloquée par une corruption distincte du fichier
de catégories Blocks ; voir IMPLEMENTATION_PROGRESS.md pour les limites exactes.

## Complément ciblé Blocks — 6 novembre 2026

Les trois constats de la revue finale du catalogue sont corrigés : couleurs des
textes lisibles sur les surfaces choisies, barre du catalogue dans une région
nommée avec un main de premier niveau et un seul lien de saut, titre h2 pour
le formulaire de `/blocks/sign-in`. La découverte du lien de saut par Tab a été
confirmée aussi dans WebKit grâce à un tabIndex explicite.

Les contrôles axe-core 4.14.0 couvrent sept presets, clair/sombre, catalogue,
catégorie Commerce, Drawer mobile et fiche sign-in dans Chromium, Firefox et
WebKit : **168 analyses, zéro violation détectée dans ce périmètre**. La suite
`e2e/blocks-accessibility.spec.ts` conserve ces régressions en CI. Les 21 cas
par preset et les six cas clavier/sign-in ont été validés, ainsi que le build,
le lint, TypeScript et les 50 tests site. Les vignettes sign-in sont régénérées.

Il s'agit d'une vérification automatisée ciblée, distincte des preuves historiques
ci-dessous : elle ne remplace pas une validation avec lecteur d'écran ni un audit
WCAG complet des 141 blocks. Les résultats détaillés restent dans
`.artifacts/blocks-a11y-*.log` ; aucune palette ni API de bibliothèque n'a changé.

## Périmètre réellement vérifié

- 129 références : montage interactif, un h1 et une région main, conseils présents, aucune exception JavaScript, absence de débordement de page à 390 × 844 après ouverture à 1440 × 900. Vérification sur Chromium, Firefox et WebKit.
- Parcours clavier ciblés : Menubar, DataGrid, Scheduler, Gantt, Kanban, Tour, FileManager, Tabs, recherche et navigation mobile.
- Scan structurel distinct des 129 exemples autonomes initiaux sur Chromium, **Default clair, 1440 × 900** : noms accessibles des contrôles sélectionnés, ids uniques, références ARIA existantes et région main unique. **129 inspectés, zéro constat final**. Résultat détaillé : `.artifacts/accessibility-structure.json`.
- L’audit initial ne modifiait pas la bibliothèque. L’itération suivante corrige Kanban/Scheduler et ajoute les apparences Navbar/Footer ; tokens, presets et Provider sont conservés, CI toujours désactivée.

## Corrections locales du site

| Constat observé | Correction |
| --- | --- |
| System sombre affichait les miniatures claires | Sélection prenant en compte prefers-color-scheme pour System ; test dans les trois moteurs |
| Archive, onglet désactivé dans la démo Tabs, référençait un panneau absent | Ajout du TabsContent et test des références/du saut des onglets désactivés |
| La garde de liens du Playground bloquait les fragments | Garde retirée des modules extraits ; exemples Anchor et TableOfContents avec de vraies destinations |
| Risque de main imbriqués et de collisions d’ids | Documents séparés pour DashboardLayout, AppShell, DocsLayout, Anchor et TableOfContents |
| Quelques compositions héritées utilisaient un bouton natif ou des actions sans résultat visible | Exemples locaux Spinner, ContextMenu, VisuallyHidden et Hero avec composants Pimolu et retours locaux explicites |
| Certaines premières actions WebKit arrivaient avant l’hydratation | Marqueur après montage des modules dynamiques ; attente des vrais gestionnaires, sans délai arbitraire |

Les premiers échecs Menubar/Kanban provenaient aussi de sélecteurs de tests inexacts et d’une destination volontairement pleine. Les sélecteurs ont été corrigés d’après le DOM, en conservant les vérifications du comportement attendu.

## Constats de bibliothèque — corrigés dans cette itération

### P1 — Kanban : état désactivé hérité d’une colonne pleine — corrigé

**Fichier :** `registry/react/kanban/kanban.tsx`, liste de colonne avec `aria-disabled={full ? true : undefined}`.

**Preuve navigateur :** la colonne To do de la composition Sprint board est à 3/3. La carte « Polish the chat composer » hérite de `aria-disabled=true`, alors que son bouton natif a `disabled=false`. Control+ArrowRight la déplace effectivement vers In progress. L’arbre accessible présente donc un état désactivé alors que l’action reste opérable.

La spécification [WAI-ARIA sur aria-disabled](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled) étend cet état aux descendants focusables.

**Correction appliquée :** `data-full` décrit la capacité de la liste sans transmettre un état désactivé aux cartes. Ajout et destinations pleines restent bloqués. Tests React et navigateur : une carte quitte une colonne pleine, conserve le focus et annonce sa destination. Les paragraphes de preuve ci-dessus décrivent l’état initial.

### P2 — Scheduler : contrat clavier du rôle grid incomplet — corrigé

**Fichier :** `registry/react/scheduler/scheduler.tsx`, grille horaire.

**Preuve navigateur :** la semaine de démonstration expose 78 boutons dans le rôle grid. Le premier créneau garde le focus après ArrowRight : aucun déplacement fléché entre cellules n’est implémenté. Les créneaux et événements restent activables par Tab/Entrée, vérifié sur les trois moteurs.

Le [modèle Grid de WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) décrit un seul arrêt dans la séquence Tab et une gestion explicite du déplacement interne.

**Correction appliquée :** une cellule possède `tabIndex=0`, les autres `-1`. Flèches, Home/End, Control+Home/End, activation Entrée/Espace, F2 pour entrer dans les actions et Échap pour revenir à la cellule. Shift+Tab vers la cellule restaure également la navigation. Les boutons d’événements horaires restent accessibles séparément. Instructions reliées par `aria-describedby`, noms des cellules et focus visible/forced-colors ajoutés. Tests jour/semaine, bornes, activation et RTL. Les preuves précédentes décrivent l’état initial.

## Parcours réellement exercés

| Famille | Vérification |
| --- | --- |
| Menubar | ArrowDown, focus du premier élément, End sautant Print désactivé, panneau ancré, Échap et retour au déclencheur |
| DataGrid | Tri par Entrée avec aria-sort, sélection des lignes, redimensionnement par ArrowRight avec aria-valuenow actualisé |
| Scheduler | Créneau et événement activés par Entrée avec retour local |
| Gantt | Activation d’une tâche, zoom et valeur affichée actualisée |
| Kanban | Destination pleine refusée ; déplacement autorisé vers Done, focus conservé, annonce de destination |
| Tour | Dialogue nommé, focus initial, changement d’étape par flèche, Échap et restauration |
| FileManager | ArrowDown/Home, sélection par Espace, dossier par Entrée, breadcrumb actualisé |
| Tabs | Références aria-controls existantes, flèches sautant l’onglet désactivé |
| Site | Recherche différée et retour au vrai ouvreur, Drawer mobile, navigation, redirections 308, illustrations Light/Dark/System |

## Limites

- Aucun lecteur d’écran NVDA, JAWS, VoiceOver ou TalkBack exécuté. Les annonces nécessitent encore une revue humaine.
- Pas de certification WCAG, de passage axe, de mesure exhaustive des contrastes ni de revue visuelle de chaque preset/état.
- Le scan structurel couvre l’état initial en Default clair, pas tous les overlays ouverts ni les erreurs. Les parcours ciblés le complètent sans être exhaustifs.
- WebKit Playwright sous Windows ne prouve pas la compatibilité complète Safari macOS/iOS. Mobile émulé, aucun appareil physique.
- Montage des composants médias vérifié, sans prétendre tester tous les codecs, transcriptions ou l’accessibilité du PDF.
- Aucune conclusion de performance sur de gros jeux de données ou de conformité de toute personnalisation de marque.

## Reproduction

```sh
pnpm --filter @pimolu/website build
pnpm --filter @pimolu/website test:e2e
# Avec le site sur le port 3001 :
pnpm --filter @pimolu/website audit:a11y
```

Rapports : `playwright-report/` ; traces d’échecs : `test-results/`. Sorties ignorées par Git. CI GitHub toujours désactivée.


## Exemples supplémentaires — contrôle structurel

Le script accepte maintenant `--all-examples` : **516 états initiaux** inspectés sous Chromium,
Default clair à 1440 × 900, **zéro constat structurel** dans le rapport
`.artifacts/accessibility-all-examples.json`. Les tests de montage des trois compositions supplémentaires
par famille font partie de la suite Chromium/Firefox/WebKit. Une composition sur trois est ouverte à
390 × 844, les autres à 1440 × 900 ; les 129 pages principales sont également contrôlées sur mobile.

Les exemples sont des documents indépendants pour éviter les collisions d’ids, main imbriqués et
interférences d’overlays. Ce contrôle ne couvre pas automatiquement les états ouverts, interactions,
contrastes ou annonces de lecteur d’écran de chacun des 516 exemples. Un champ de la composition
FocusScope a également reçu un véritable Input Pimolu avec label associé après inspection de la source.
