# Issue template

Title format:

```text
English title / Titre français
```

Body:

```markdown
## English

### Summary

<One paragraph: what is broken, who is affected, and the user-visible impact.>

### Affected versions

- **`<affected version>`**: <what changed or failed>.
- **`<fixed version>`**: fixed.

### Why upgrade

<Explain the user-visible consequence and why staying on the affected version is risky or inconvenient.>

### Reproduction

1. <Minimal setup with exact package versions.>
2. <Integration or configuration relevant to the bug.>
3. <Action that reveals the problem.>

**Expected:** <correct behavior.>

**Actual:** <observed behavior.>

### Root cause

<Technical explanation, only when verified.>

### Fix / workaround

<What changed in the fix, the upgrade command, or a safe temporary workaround.>

```bash
<install or upgrade command>
```

### Verification

- `<command>`: <result actually executed>.
- <Browser, engine, version or environment coverage.>

### Links

- Release: <url>
- Changelog: <url>
- Documentation: <url>

---

## Français

### Résumé

<Un paragraphe : ce qui est cassé, qui est concerné et l'impact visible.>

### Versions concernées

- **`<version concernée>`** : <ce qui a changé ou échoué>.
- **`<version corrigée>`** : corrigé.

### Pourquoi mettre à jour

<Expliquer la conséquence visible et pourquoi rester sur la version concernée est risqué ou gênant.>

### Reproduction

1. <Configuration minimale avec les versions exactes.>
2. <Intégration ou configuration concernée.>
3. <Action qui révèle le problème.>

**Attendu :** <comportement correct.>

**Observé :** <comportement constaté.>

### Cause racine

<Explication technique, uniquement si elle est vérifiée.>

### Correctif / contournement

<Ce qui a changé dans le correctif, la commande de mise à jour ou un contournement sûr.>

```bash
<commande d'installation ou de mise à jour>
```

### Vérifications

- `<commande>` : <résultat réellement exécuté>.
- <Couverture navigateurs, moteurs, version ou environnement.>

### Liens

- Release : <url>
- Changelog : <url>
- Documentation : <url>
```
