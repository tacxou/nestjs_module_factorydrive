---
name: github-issue-comment
description: >-
  Rédige un commentaire de progression pour une issue GitHub Factorydrive dans le
  cache local .issues/{numero}.md. Utiliser quand l'utilisateur demande de préparer,
  rédiger ou mettre à jour un commentaire d'issue sans le publier immédiatement.
---

# Préparer un commentaire d'issue GitHub

## Destination

- Écrire le brouillon dans `.issues/{numero}.md`.
- Le contenu de `.issues/` est ignoré par Git, sauf `.issues/.gitignore`.
- Ne jamais publier avec `gh issue comment` ou une API sans demande explicite.

## Contenu

- Rédiger en français, sauf demande contraire.
- Produire un commentaire de progression prêt à copier-coller, pas un plan.
- Décrire ce qui est livré, les fichiers ou modules touchés et les décisions.
- Éviter les prochaines étapes, le hors scope et les checklists sauf demande.

Pour une livraison technique, utiliser cet ordre : introduction datée et périmètre,
puces de livraison, table `Commits`, puis ligne `Décision :` si nécessaire.

```markdown
**Commits**

| Hash | Date | Contenu |
|------|------|---------|
| `abc1234` | JJ/MM | Résumé court de l'apport à l'issue |
```

## Sélection des commits

- Utiliser `git log -- <chemins>` sur le périmètre et la période de l'issue.
- Garder uniquement les commits pertinents et déjà enregistrés dans Git.
- Utiliser le hash court sur sept caractères sans le répéter dans les puces.
- Omettre ou regrouper les commits triviaux si la table devient illisible.

Présenter le chemin du brouillon et laisser l'utilisateur le publier lui-même.
