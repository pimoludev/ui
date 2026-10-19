# Inventaire des composants React

Les chemins ci-dessous sont relatifs à la racine. Chaque famille citée est exportée dans `registry/react/index.ts`, possède un CSS dans `packages/web-styles/src/`, des tests sous son dossier React et une page dans `apps/playground/src/pages/`. « Présent » atteste l'implémentation et les tests, pas une certification exhaustive d'accessibilité ou une API figée.

| Famille | Source React | Rôle | État |
| --- | --- | --- | --- |
| Button | `registry/react/button/` | Actions, apparences et états | Présent et testé |
| Input | `registry/react/input/` | Saisie texte, actions et validation | Présent et testé |
| Card | `registry/react/card/` | Surface et sous-composants | Présent et testé |
| Badge | `registry/react/badge/` | Statut compact | Présent et testé |
| Avatar, AvatarGroup | `registry/react/avatar/` | Identité et groupe | Présents et testés |
| Separator | `registry/react/separator/` | Séparation de contenu | Présent et testé |
| Skeleton | `registry/react/skeleton/` | Attente de contenu | Présent et testé |
| Spinner | `registry/react/spinner/` | Activité | Présent et testé |
| Switch | `registry/react/switch/` | Choix binaire | Présent et testé |
| Checkbox | `registry/react/checkbox/` | Choix multiple | Présent et testé |
| Radio, RadioGroup | `registry/react/radio/` | Choix exclusif | Présents et testés |
| Textarea | `registry/react/textarea/` | Saisie multilignes | Présent et testé |
| Select | `registry/react/select/` | Sélection native ou stylée | Présent et testé |
| Combobox | `registry/react/combobox/` | Recherche et sélection | Présent et testé |
| MultiSelect | `registry/react/multi-select/` | Sélection multiple | Présent et testé |
| Slider | `registry/react/slider/` | Valeur sur piste | Présent et testé |
| RangeSlider | `registry/react/range-slider/` | Intervalle | Présent et testé |
| Progress | `registry/react/progress/` | Progression linéaire | Présent et testé |
| CircularProgress | `registry/react/circular-progress/` | Progression circulaire | Présent et testé |
| Tooltip | `registry/react/tooltip/` | Aide contextuelle | Présent et testé |

Le provider est dans `registry/react/provider/`; les utilitaires de positionnement et portail dans `registry/react/internal/`. Les pages de playground couvrent les 20 familles (AvatarGroup et RadioGroup sont montrés avec leur famille). `registry/native/`, `registry/angular/` et `registry/web/` sont des emplacements vides : aucun composant de ces plateformes ne doit être annoncé comme existant.

Pour connaître exactement props, variantes, tailles et états d'un composant, lire son fichier `.types.ts`, `.variants.ts`, `.tsx`, ses tests et son CSS ; les axes diffèrent selon la famille. Des revues manuelles clavier, lecteurs d'écran, RTL, forced colors et responsive restent nécessaires avant de qualifier l'ensemble de terminé.
