# Feature: Factorydrive Agent Skills pack

## Résumé

Factorydrive expose un pack versionné d'Agent Skills depuis une source canonique
`agent-skills/`. Les deux skills destinés aux consommateurs sont distribués dans le
package npm principal, tandis que les workflows de maintenance restent disponibles
uniquement dans le dépôt. L'API TypeScript et les dépendances runtime restent inchangées.

Source : [issue GitHub #96](https://github.com/FicSysFR/nestjs_module_factorydrive/issues/96).

## User stories

### P1 — Installer les skills publics avec le package npm

- Given une application installe `@ficsysfr/nestjs_module_factorydrive` avec Yarn
- When un outil compatible Agent Skills déclare `agent-skills/public` comme source
- Then il découvre exactement `use-factorydrive` et `factorydrive-driver`, avec leurs
  instructions et ressources locales complètes

### P1 — Maintenir une source unique dans le dépôt

- Given un mainteneur modifie un skill Factorydrive
- When il travaille sous `agent-skills/public` ou `agent-skills/maintenance`
- Then aucun contenu de skill n'est dupliqué sous les adapters `.agents/skills` ou
  `.claude/skills`

### P1 — Auditer le contenu distribué

- Given le tarball npm principal est généré
- When `yarn package:check` analyse puis installe ce tarball
- Then tous les fichiers publics attendus sont présents, aucun workflow de maintenance
  ou adapter n'est publié, et aucune dépendance agentique runtime n'est ajoutée

### P2 — Utiliser les workflows de maintenance localement

- Given le dépôt déclare ses racines externes dans `.agents/skill-sources.json`
- When un adapter compatible avec le contrat Fysion #13 prépare les liens locaux
- Then `github-release` et `spec-driven` restent utilisables sans être distribués dans
  le package npm

## Exigences

- `agent-skills/` est l'unique source versionnée des skills Factorydrive.
- `agent-skills/public` contient exactement `use-factorydrive` et
  `factorydrive-driver`.
- `agent-skills/maintenance` contient exactement `github-release` et `spec-driven`.
- Les copies locales `commit-message`, `github-issue-comment` et
  `sync-samples-patterns` sont supprimées ; elles relèvent des adapters externes.
- `.agents/skill-sources.json` déclare les deux racines canoniques.
- `.agents/skills/` et `.claude/skills/` restent ignorés et ne contiennent aucune source
  versionnée.
- Les skills publics sont en anglais, utilisent Yarn et Vitest, et décrivent exactement
  les contrats courants de `FactorydriveService`, `AbstractStorage`, S3 et SFTP.
- Le package npm principal contient `agent-skills/public/**/*`, y compris les deux
  `SKILL.md` et les ressources de `use-factorydrive`.
- Le tarball exclut `agent-skills/maintenance`, `.agents`, `.claude`, `.fysion`, les
  sources applicatives et toute dépendance agentique runtime.
- Les quatre skills respectent la spécification Agent Skills validée par `skills-ref`
  à la révision `69ef37e9424c0a7ea9dd2293b559e43ec8176379`.
- Le README empaqueté documente l'emplacement standard du pack et son installation avec
  Yarn, sans dépendre d'un outil de liaison particulier.

## Hors scope

- Modifier l'API TypeScript ou le comportement runtime de Factorydrive.
- Ajouter un linker, un `postinstall`, une découverte automatique de `node_modules` ou
  une dépendance runtime liée aux agents.
- Implémenter le contrat Fysion #13 dans ce dépôt.
- Créer un plugin Codex.
- Modifier la version, committer, pousser, taguer ou publier un package.

## Impact SemVer

MINOR — le package acquiert une nouvelle surface distribuée sans rupture applicative.
