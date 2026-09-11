# Plan: Factorydrive Agent Skills pack

## Approche technique

1. Déplacer les skills conservés vers `agent-skills/public` et
   `agent-skills/maintenance`, puis supprimer les workflows génériques désormais fournis
   par les adapters externes.
2. Déclarer ces racines dans `.agents/skill-sources.json` et réduire `.gitignore` afin
   que seul ce manifeste soit suivi sous `.agents/`.
3. Réviser les deux skills publics contre les exports et implémentations actuels du core,
   du driver S3 et du driver SFTP. Employer uniquement des commandes Yarn et une
   stratégie de tests Vitest.
4. Ajouter les skills publics à `package.json#files`, puis renforcer l'audit du tarball
   avec un inventaire exact, des chemins privés interdits, un contrôle des dépendances
   runtime et une installation temporaire avec Yarn.
5. Ajouter des tests Vitest pour l'inventaire, le frontmatter, les références locales,
   le vocabulaire public et les contrats `AbstractStorage`/`FactorydriveService`.
6. Valider les quatre skills avec le CLI `skills-ref` épinglé et exécuter la validation
   dans la CI à partir de la même révision.
7. Mettre à jour le README et les instructions du dépôt afin que chaque lien pointe vers
   la source canonique.

## Contrats et fichiers touchés

- Source publique : `agent-skills/public/*`.
- Source de maintenance : `agent-skills/maintenance/*`.
- Déclaration adapter : `.agents/skill-sources.json` avec une propriété `sources`
  contenant les deux chemins relatifs.
- Distribution npm : `package.json#files` et `scripts/package.mjs`.
- Tests : `tests/agent-skills.test.ts` et `scripts/tests/package.test.mjs`.
- Documentation : `README.md`, `AGENTS.md`, `CLAUDE.md`, règles Cursor et index des specs.
- CI : validation `skills-ref` depuis le commit épinglé de la spécification Agent Skills.

## Risques et compatibilité

- Le schéma définitif de Fysion #13 n'est pas encore publié. La déclaration locale
  adopte le contrat minimal annoncé par l'issue ; le test d'intégration complet dépendra
  de la livraison amont.
- Une allowlist trop large pourrait publier les workflows de maintenance. L'audit exige
  donc la liste exacte des ressources publiques et refuse explicitement les adapters.
- Une documentation de driver trop prescriptive pourrait réintroduire un faux contrat.
  Les tests prouvent qu'une sous-classe vide de `AbstractStorage` est valide et que
  l'enregistrement passe directement par `FactorydriveService.registerDriver()`.
- Aucun export TypeScript, script d'installation ou dépendance runtime n'est ajouté.

## Stratégie de tests

- Vitest : inventaires, frontmatter, noms, liens locaux, contenu public et API illustrée.
- Node test runner : allowlist du tarball, fichiers obligatoires, chemins interdits,
  lifecycle scripts et dépendances agentiques runtime.
- `skills-ref validate` sur les quatre dossiers avec le validateur épinglé.
- `yarn package:check` : génération, inventaire exact, installation temporaire avec Yarn,
  imports ESM/CommonJS, types et démarrage du binaire MCP.
- Portes finales : lint, typecheck, tests, build, MCP, documentation, scripts, changelog
  et packaging.
