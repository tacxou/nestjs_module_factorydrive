# Tasks: Factorydrive Agent Skills pack

- [x] T01 Créer la spec, le plan et la checklist depuis l'issue #96.
- [x] T02 Migrer les quatre skills conservés vers l'arborescence canonique.
- [x] T03 Supprimer les trois skills génériques et déclarer les racines externes.
- [x] T04 Réviser les skills publics contre l'API et les drivers publiés.
- [x] T05 Mettre à jour les instructions et liens documentaires du dépôt.
- [x] T06 Distribuer uniquement les ressources publiques dans le package npm.
- [x] T07 Renforcer l'audit et l'installation temporaire du tarball avec Yarn.
- [x] T08 Ajouter les tests Vitest du pack et des contrats API illustrés.
- [x] T09 Épingler et exécuter `skills-ref validate` sur les quatre skills.
- [ ] T10 Exécuter l'intégration temporaire avec Fysion #13 dès que le contrat amont
  est publié.
- [x] T11 Exécuter toutes les portes de qualité et consigner la limite Fysion #13.

## Limite externe constatée

L'intégration temporaire avec Fysion #13 reste différée : au moment de cette
implémentation, l'issue amont est ouverte, son contrat final n'est pas publié et aucune
implémentation de `skill-sources.json` n'est disponible sur la branche principale.
La déclaration et le tarball Factorydrive sont couverts localement sans simuler ce
comportement externe.
