# Pimolu UI — conventions permanentes des vidéos marketing

Instructions du mainteneur, enregistrées le 27 octobre 2026. Ce document est la
référence commune des futures vidéos de composants Remotion. Il complète les
instructions existantes sans les supprimer. Une consigne explicite ultérieure
du mainteneur prime pour la vidéo concernée.

## Comprendre les demandes courtes

| Demande | Format à produire automatiquement |
|---|---|
| `Avatar — vidéo design` | Publicité visuelle Avatar, sans code affiché |
| `Button — vidéo code + design` | Publicité Button, code React/TypeScript et rendu synchronisés |
| `Select — vidéo design` | Publicité visuelle Select, sans code affiché |
| `ColorPicker — vidéo code + design` | Publicité ColorPicker, code React/TypeScript et rendu synchronisés |

Appliquer la même interprétation à tout autre composant réellement disponible.
Le nom du composant et le format suffisent : ne pas demander au mainteneur de
réexpliquer ces concepts. Adapter le scénario aux capacités vérifiées du
composant. Une demande de ce type autorise sa réalisation et son export local,
avec vérification du rendu ; elle n'autorise pas sa publication sur les réseaux.

## 1. Une publicité dans les deux formats

L'objectif est de donner envie aux développeurs de découvrir et d'utiliser
Pimolu UI. Chaque film doit proposer une direction artistique premium, du motion
design professionnel, des transitions fluides et originales, une mise en scène
cinématographique, des animations de composants et des interactions réalistes.

Conserver une identité Pimolu cohérente et un rythme adapté aux réseaux sociaux.
Terminer avec une composition de marque soignée. Éviter les tutoriels classiques,
les captures successives, les diaporamas et les grilles de variantes statiques.
La narration doit former une expérience continue, avec des changements d'échelle,
de composition ou de caméra utiles à ce que le spectateur doit remarquer.

## 2. Format « vidéo design »

Aucun code à l'écran, y compris lors des démonstrations en contexte.

Respecter cette progression narrative :

**Composant seul → Variantes → Personnalisation → Interactions → Applications
réelles → Branding Pimolu.**

1. Présenter le véritable composant dans une apparition élégante. En faire le
   centre de l'attention, avec des zooms, transformations, mouvements de caméra
   ou compositions adaptés.
2. Explorer les propriétés visuellement intéressantes réellement disponibles :
   variantes, tailles, couleurs, arrondis, thèmes, états, icônes, éléments associés
   et autres personnalisations. Animer chaque changement ; faire évoluer les
   apparences, les regroupements et les dispositions progressivement. Une grille
   peut être un moment de composition, jamais la démonstration entière.
3. Montrer les comportements pris en charge : hover, clic, focus, sélection,
   ouverture, fermeture, changement de valeur, loading et autres états pertinents.
   Les effets de caméra et de publicité doivent rester distincts du comportement
   natif du composant.
4. **Obligatoirement intégrer le composant dans des interfaces réalistes après
   sa présentation isolée.** Animer leur construction ou leur apparition, puis
   montrer des interactions du composant à l'intérieur de ces interfaces.
5. Terminer avec le branding Pimolu et un appel à l'action bref, lorsque pertinent.

Varier librement la mise en scène entre les vidéos, tout en conservant cette
progression et la cohérence de la marque.

## 3. Format « vidéo code + design »

Concept central : **Code → Modification → Résultat → Interaction.**

Respecter cette progression narrative :

**Composant → Code → Modification des props → Aperçu dynamique → Interactions
→ Personnalisation avancée → Applications réelles → Branding Pimolu.**

1. Montrer le composant dans sa configuration par défaut, avec un panneau de code
   élégant et son véritable rendu.
2. Mettre une propriété en évidence, animer sa modification dans le code et
   transformer simultanément le composant dans l'aperçu. Montrer une interaction
   démontrant la configuration, puis passer à une autre propriété.
3. Répéter ce principe sur les propriétés pertinentes et montrer des combinaisons
   avancées de props et de styles. Faire comprendre comment quelques changements
   de code transforment le résultat, avec l'API existante uniquement.
4. **Terminer les démonstrations par des interfaces réalistes et des interactions
   en contexte**, comme dans le format Design. Afficher, si pertinent, le fragment
   qui configure le composant dans cette interface.
5. Conclure avec le branding Pimolu.

Les extraits doivent être du React/TypeScript valide et correspondre exactement
aux props montrées : valeurs, tailles, variantes, états et personnalisation.
Compiler les exemples contre les véritables types. Garder une source de données
commune au code et à l'aperçu pour éviter leur désynchronisation. Distinguer les
props du composant de celles du Provider, et l'initialisation d'un état de sa
valeur courante. Ne pas présenter un changement de props applicatif comme un
comportement automatique du composant.

## 4. Applications réalistes : étape essentielle des deux formats

Choisir plusieurs contextes crédibles et adaptés au composant. Les exemples
suivants sont des pistes, à adapter aux composants effectivement disponibles :

| Composant | Contextes pertinents |
|---|---|
| Avatar | Profil utilisateur, paramètres de compte, membres d'équipe, messagerie, commentaires, dashboard avec utilisateurs |
| Button | Carte produit, formulaire, header, tarification, boîte de dialogue, dashboard SaaS |
| Select | Inscription, filtre de produits, paramètres, filtres d'un dashboard |
| ColorPicker | Personnalisation d'une interface, paramètres de marque, éditeur d'apparence |

Composer ces écrans avec les vrais composants Pimolu disponibles. Soigner les
espacements, la hiérarchie, les proportions et la lisibilité. Animer leur
assemblage et démontrer le composant dans son contexte, au lieu d'ajouter une
simple capture statique en fin de film.

Des données fictives sont autorisées pour ces démonstrations. « Applications
réelles » signifie des usages réalistes et réellement composables ; ne pas faire
passer une démo fictive pour une application cliente en production. Identifier
les compositions locales comme telles dans les notes de production, sans les
présenter comme des composants publics supplémentaires.

## 5. Références : analyser, puis créer une réalisation originale

Lorsqu'une référence est fournie, l'analyser avant de construire les scènes :
rythme, composition, transitions, interactions et évolution sur plusieurs images
consécutives. Utiliser les outils locaux vidéo disponibles pour étudier les
mouvements et le montage, pas uniquement quelques captures isolées.

Rechercher sa qualité de production et développer une direction originale Pimolu.
Ne copier ni son branding, ni ses assets, ni ses interfaces ou séquences exactes.

Pour une référence Avatar à apparitions progressives : conserver ce principe,
explorer davantage de variantes, animer la personnalisation, montrer des états
et combinaisons, les modes clair/sombre s'ils existent, plusieurs usages dans des
interfaces et une conclusion de marque soignée.

## 6. Vérifier et employer exclusivement les vrais composants Pimolu

Avant chaque vidéo :

1. Explorer le monorepo et relire les instructions, le contexte et les skills
   pertinents ; réexaminer les sources actuelles plutôt que se fier au film précédent.
2. Localiser l'implémentation, l'API TypeScript, les styles, les variantes, les
   props, les comportements, exemples et tests du composant.
3. Examiner la documentation officielle et les exemples existants. Si une page
   est indisponible, s'appuyer sur les sources vérifiées et consigner cette limite.
4. Vérifier les interactions intéressantes dans le rendu réel et déterminer ce
   qui peut être représenté fidèlement.
5. Importer et rendre le véritable composant Pimolu avec ses styles dans Remotion.

Ne jamais inventer une prop, une variante, un état, une fonctionnalité ou une
plateforme. Énumérer les variantes depuis leurs sources lorsque disponibles.
Ne jamais substituer une autre bibliothèque aux composants Pimolu. Les éléments
décoratifs CSS/SVG, curseurs et cadres cinématographiques sont permis ; ils ne
doivent pas être présentés comme des capacités natives de la bibliothèque.

Vérifier aussi les affirmations commerciales, le site et toute commande
d'installation affichée. Ne pas annoncer une fonctionnalité comme publiée si
elle n'existe que dans le workspace. Préserver les conventions d'accessibilité
des exemples, notamment les noms des contrôles et les véritables états de focus.

## 7. Remotion, formats, rythme et organisation

- Utiliser Remotion, React et TypeScript, avec les skills Remotion pertinents.
  Réutiliser le projet et les outils existants dans `docs/marketing/` ; inspecter
  notamment `docs/marketing/launch/` s'il existe. Éviter de recréer l'architecture
  pour chaque composant ou d'ajouter des dépendances lourdes sans nécessité.
- Conserver les sources, assets, notes et exports vidéo sous `docs/marketing/`,
  avec des sous-dossiers propres à chaque production. La présente convention
  reste dans `docs/ai/` pour appartenir aux instructions du dépôt, même si les
  médias marketing sont ignorés par Git.
- Priorité au vertical 9:16, normalement 1080 × 1920 à 30 fps, pour TikTok, Reels
  et Shorts. Durée indicative de 30 à 60 secondes, adaptable au composant et à
  la densité utile des démonstrations. Un autre format explicitement demandé
  prime ; concevoir son cadrage, sans simple rognage automatique.
- Textes courts en anglais. Aucune voix off nécessaire. Le film doit être
  compréhensible sans son.
- Animations fluides, interactions rapides et réactives. Synchroniser l'arrivée
  du curseur, le clic et la réponse visible. Supprimer les pauses inutiles avant
  le clic, les temps morts et les plans statiques trop longs.
- Piloter les animations, changements de props et interactions par les frames
  Remotion. Garantir un rendu déterministe, y compris lors d'un accès direct
  aux frames, et organiser des scènes/compositions réutilisables.
- Garder le travail vidéo isolé des composants publics et de `apps/website/`.
  Ne pas les modifier pour faciliter le tournage. Documenter les limitations et
  adapter la mise en scène. Préserver les changements existants du mainteneur.
- Préférences déjà exprimées : aucun halo violet ou anneau lumineux décoratif
  derrière le logo ; aucune signature logo + « Pimolu UI » fixée en haut à gauche
  donnant un aspect page web. Ces préférences n'empêchent pas un vrai branding
  d'introduction ou de conclusion, ni une apparence native du composant.
- Aucun son de transition. Une musique instrumentale et des clics discrets sont
  possibles si leurs droits sont vérifiés, ou s'ils sont originaux. Sinon, livrer
  sans audio avec une piste facilement ajoutable. Ne pas utiliser une musique
  de référence sans autorisation.

## 8. Livraison et définition de « terminé »

Une demande de vidéo exige la production de la vidéo, pas seulement un storyboard.
Après implémentation, générer le rendu complet, normalement en MP4 H.264, puis :

- Vérifier le build Remotion et les validations pertinentes à ce qui a changé.
- Inspecter les fichiers effectivement rendus à plusieurs instants : animations,
  interactions, changements de props, transitions et conclusion.
- Vérifier l'authenticité des composants et la validité/synchronisation de tout
  code affiché ; le format Design ne doit afficher aucun code.
- Contrôler lisibilité, cadrage, marges, superpositions, débordements et absence
  d'éléments tronqués dans le format demandé.
- Vérifier les dimensions, la durée, la cadence, les codecs et l'audio éventuel.
- Corriger les problèmes observés et refaire les rendus concernés avant livraison.
- Fournir les chemins des MP4, la prévisualisation disponible, les sources
  réutilisables, un storyboard textuel bref et les commandes de reproduction.
- Consigner les contrôles réellement exécutés et les limites restantes ; ne
  jamais affirmer qu'une vérification non effectuée a réussi.

Ne pas considérer la vidéo comme terminée tant que ces vérifications requises
restent à faire. Ne pas commiter, pousser ou publier sans demande explicite.
