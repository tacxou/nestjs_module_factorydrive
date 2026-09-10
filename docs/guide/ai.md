---
description: Connecter les agents de code aux fichiers llms.txt et au serveur MCP documentaire Factorydrive.
---

# Agents IA

Factorydrive publie une documentation machine-readable en anglais et un serveur MCP
strictement documentaire. Le MCP ne reçoit jamais la configuration des disques ni les
identifiants de stockage.

## Fichiers `llms.txt`

| Fichier | Rôle |
| --- | --- |
| [llms.txt](https://ficsysfr.github.io/nestjs_module_factorydrive/llms.txt) | Index court vers les pages Markdown |
| [llms-full.txt](https://ficsysfr.github.io/nestjs_module_factorydrive/llms-full.txt) | Bundle complet de la documentation anglaise |

## Serveur MCP

```bash
npx -y @ficsysfr/nestjs_module_factorydrive-mcp
```

| Outil | Rôle |
| --- | --- |
| `list_doc_sources` | Lire et analyser l’index `llms.txt` |
| `search_docs` | Classer les pages pertinentes de l’index et du bundle |
| `fetch_docs` | Charger une URL documentaire autorisée |

```json
{
  "mcpServers": {
    "factorydrive": {
      "command": "npx",
      "args": ["-y", "@ficsysfr/nestjs_module_factorydrive-mcp"]
    }
  }
}
```

Pour une prévisualisation locale, définir `DOCS_BASE_URL` sur
`http://127.0.0.1:4173`. Les seuls hôtes autorisés sont `ficsysfr.github.io`,
`127.0.0.1` et `localhost`.
