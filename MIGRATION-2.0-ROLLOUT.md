# Factorydrive 2.0 rollout

This runbook describes external operations only. Repository transfer, Git operations,
npm publication, package deprecation, and Trusted Publisher changes remain manual and
must not be performed by an agent without explicit authorization.

## Preconditions

- FicSysFR can receive the core, S3, and SFTP repositories without renaming them.
- The four `@ficsysfr` package names are available and the organization can publish them.
- GitHub Pages is configured to use GitHub Actions in the core repository.
- The Codecov GitHub App is installed for the three transferred repositories and each
  FicSysFR project is activated in Codecov.
- CI is green in all three repositories and the generated package audit is retained.

## Ordered rollout

1. Transfer the three repositories to FicSysFR without renaming them.
2. Merge the prepared core-repository changes and let `deploy-docs.yml` publish GitHub
   Pages. Keep the satellite changes ready until the new core exists on npm so their
   dependency installation can succeed.
3. Confirm that all three CI workflows authenticate Codecov with GitHub OIDC and publish
   a coverage status against their own `${{ github.repository }}` slug. No
   `CODECOV_TOKEN` is consumed by the prepared workflows.
4. Confirm that the public `llms.txt`, `llms-full.txt`, and every linked English Markdown
   page return HTTP 200 under the documented Pages prefix.
5. Dispatch the core `release.yml` with `release_version=2.0.0`. It publishes the core
   tarball first and the MCP tarball second with provenance.
6. Once the core is visible on npm, replace the temporary development aliases in the S3
   and SFTP manifests with `^2.0.0`, regenerate both Yarn lockfiles, merge the prepared
   changes, require their
   CI to pass, then dispatch each satellite `release.yml` with the same exact version.
7. Install the four public packages in a clean temporary project, resolve their entry
   points and MCP binary, and inspect npm provenance.
8. Run all three MCP tools against the public site.
9. Apply the legacy-package deprecations documented in the bilingual migration guide.

The legacy `CODECOV_TOKEN` repository secrets can be removed only after successful OIDC
uploads are visible, and only after the explicit deletion approval required by the
migration procedure.

## Trusted Publishing transition

The first publication needs an `NPM_TOKEN` secret in the protected GitHub `npm`
environment because npm requires each
package to exist before a Trusted Publisher can be attached. Immediately afterwards:

1. Configure each new npm package to trust its repository's `release.yml` workflow.
2. Re-run a non-publishing authentication/provenance check for each workflow.
3. Remove `NPM_TOKEN` from the three protected `npm` environments.
4. Remove the `NODE_AUTH_TOKEN` environment entry and its bootstrap comment from every
   release workflow.
5. Protect the npm organization against token-based publication according to its current
   npm policy controls.

Future releases use GitHub OIDC only. Do not fall back to a token if OIDC fails; repair
the Trusted Publisher association instead.
