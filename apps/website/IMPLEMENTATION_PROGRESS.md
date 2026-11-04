# Pimolu Website — État et vérifications

Mis à jour le 4 novembre 2026. Résumé pour les contributeurs : les résultats
ci-dessous sont datés et ne garantissent pas qu'une modification ultérieure passe
les mêmes contrôles. Le journal détaillé est archivé dans `.artifacts/notes/`,
ignoré par Git et absent d'un clone neuf.

## Phases réalisées

| Phase | État |
| --- | --- |
| Fondations | Next.js App Router, TypeScript, intégration workspace, thème et navigation en place |
| Site vitrine | Accueil, compositions interactives, responsive et choix d'apparence en place |
| Documentation | Guides, API générées, exemples Preview/Code, recherche, articles et releases MDX en place |
| Catalogue | 135 références pour 129 familles, illustrations et personnalisation isolée en place |
| Stabilisation | Contrôles automatiques présents ; revues visuelles et technologies d'assistance encore ouvertes |

## Versions et travail courant

- Les cinq packages npm sont publiés en `0.1.0-beta.7`. Le [changelog](../../CHANGELOG.md)
  et les releases publiques distinguent le publié du workspace.
- La branche `feat/ink-and-signal` implémente la nouvelle direction sur Default :
  palette encre/papier et iris, contours fonctionnels distincts, rôles typographiques
  facultatifs et rayons contrôle/surface de 10/16 px. Aucun huitième preset.
- La bibliothèque ne télécharge pas de polices. Le site les auto-héberge avec leurs
  licences dans `public/fonts/`. Les autres palettes conservent leurs valeurs
  publiées ; rayon et densité explicites restent prioritaires.
- Les guides Theming/Colors, README EN/FR et notes Unreleased expliquent ces
  modifications non publiées. Les 135 références portent Updated ; le baseline
  de release beta.6 n'a pas été réinitialisé.
- Le Design Lab versionné utilise les vrais composants pour trois compositions.
  `/design-preview`, son adaptateur et ses tests dédiés sont regroupés dans
  `app/design-preview/`, ignoré et facultatif. La CI n'en dépend pas.
  Next.js inclut cette route dans un build local si le dossier est présent.

## Architecture et maintenance

- `app/` : routes Next.js, métadonnées, styles globaux et accueil.
- `components/` : navigation, recherche, compositions et présentation des guides.
- `content/` : guides, exemples, statuts, articles et releases MDX.
- `scripts/` : génération des contenus, API, sources copiables et illustrations.
- `e2e/` et `tests/` : parcours navigateur et vérifications de documentation.
- `content/component-status-overrides.json` : statuts éditoriaux, notamment pour
  les modifications de documentation non détectées par les fingerprints source.
- `content/component-baseline.json` : snapshot par référence avec compatibilité
  de lecture du précédent format par dossier source. L'avancer dans le workflow
  de release, jamais pour masquer un badge.

Voir le [README du site](README.md), le [guide de développement](../../docs/ai/DEVELOPMENT_GUIDE.md)
et le [design system](../../docs/ai/DESIGN_SYSTEM.md) pour les commandes et contrats.

## Vérifications enregistrées le 4 novembre 2026

| Périmètre | Résultat enregistré |
| --- | --- |
| `pnpm verify` | Réussi, dont 1 522 tests React |
| Derniers ajustements thèmes/CSS | 13 tests thèmes, 31 tests CSS ; audit strict à 0 erreur / 0 warning |
| Website | 45 tests de documentation, lint et TypeScript validés |
| Builds | Playground réussi ; Next.js réussi, 312 pages sans la revue locale |
| Revue locale sur trois moteurs | Neuf parcours Chromium/Firefox/WebKit : formulaire, données, modes, presets, densité et focus |
| Responsive Chromium | 24 captures de compositions à 320/390/768/1440 px et huit accueils, sans overflow de page |
| Contrôles Chromium | 308 captures : 22 contrôles × sept presets × clair/sombre à 390 px, sans overflow de page ni exception |
| Catalogue | 270 illustrations régénérées et contrôlées par les tests existants |

Les neuf parcours de revue locale ne font pas partie de la CI après exclusion
de `design-preview`. Les tests permanents des tokens restent versionnés.
Captures et journaux : `.artifacts/ink-and-signal/`, non versionné.
Le build sans la page a été vérifié sans l'ancien cache `.next/dev` qui la
référençait ; cache et page ont ensuite été restaurés.

## Autres vérifications historiques utiles

- Personnalisation, 27 octobre : les hooks nommés et l'entrée CSS layered ont été
  contrôlés sur les familles existantes. Le [contrat](../../docs/CUSTOMIZATION.md)
  décrit les recettes supportées ; l'[audit daté](../../docs/audits/CUSTOMIZATION_2026-10-26.md)
  conserve les constats antérieurs à leur implémentation.
- Navigation et mouvement : tests ciblés et parcours sur trois moteurs. Consulter
  les contrats [NavbarMenu](../../docs/NAVBAR_MOBILE_MENU.md), [Tabs](../../docs/TABS_ANIMATION.md)
  et [mouvement natif](../../docs/NATIVE_MOTION.md), ainsi que l'[inventaire motion](../../docs/NATIVE_MOTION_AUDIT.md).
- Les débordements Calendar/TreeTable du Playground ont été corrigés : 336 contrôles
  ciblés sur trois moteurs, sept presets, deux modes et quatre largeurs ; 258 pages
  sans overflow pour les 129 familles à 390/1440 px en Default sombre sur Chromium.

## Limites et prochaines étapes

- La revue de toutes les références, variantes et interactions reste ouverte.
  Les tests de structure ne constituent pas une certification d'accessibilité.
  Les parcours lecteur d'écran et tests utilisateurs sont distincts.
- Suivre l'[audit d'accessibilité](ACCESSIBILITY_AUDIT.md) et l'[audit qualité](../../docs/ai/QUALITY_AUDIT.md)
  pour les périmètres vérifiés et les travaux restants.
- `brandColor` ne recalcule pas automatiquement le premier plan : contrôler
  le contraste du texte, du survol et du focus.
- Le chunk principal Playground reste au-dessus du seuil Vite de 500 kB
  (environ 769 kB dans la vérification enregistrée).
- Valider le rendu d'Ink & Signal avant adoption et release. Commit, push, merge
  et publication exigent une autorisation explicite.

## Entretien de ce résumé

Conserver ici l'état, les limites, les prochaines étapes et les résultats datés
utiles aux contributeurs. Transcripts, captures, brouillons et journaux bruts
vont dans `.artifacts/notes/` ou `docs/local/`, ignorés par Git. Décisions durables,
contrats, roadmaps, audits et contenus publics restent versionnés.
Ne pas créer de lien indispensable vers une archive locale absente des clones.
