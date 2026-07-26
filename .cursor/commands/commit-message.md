# Générer un message de commit (Conventional Commits)

Analyse **uniquement les fichiers stagés** (`git diff --cached`). Si rien n'est stagé, le signaler et s'arrêter.

## Conventions

Suivre strictement `docs/conventions/conventional-commits.md` :

- Format : `type(scope): description` — anglais, impératif, sans point final
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Scopes : `src`, `tests`, `s3`, `deps`, `ci`, `root` — omis seulement si transversal
- Breaking : `type(scope)!:` ou pied de page `BREAKING CHANGE:`
- SemVer stricte : indiquer le bump attendu (`PATCH` / `MINOR` / `MAJOR`) si `feat`, `fix` ou breaking

## Sortie

1. **Message** — sujet (+ corps optionnel si le *pourquoi* n'est pas évident)
2. **Bump SemVer** — sur le(s) `package.json` touché(s), si applicable
3. **Commande** prête à copier-coller :

```bash
git commit -m "type(scope): description"
```

Ne **pas** exécuter `git commit` ni `git push` sauf demande explicite.
