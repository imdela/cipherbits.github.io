# Cipherbits — Deployment

> Version: 1.0 | March 2024
> Scope: build the site, publish it to GitHub Pages, point the custom domain at it

Step-by-step guide to deploy cipherbits.org. Follow the steps in order. The
whole process is manual: nothing here is automated.

## 1. Build

On the source branch (`dev`), build the site:

```bash
pnpm install
pnpm build
```

Output is written to `dist/`.

## 2. Declare the custom domain

The site must answer to `cipherbits.org`. Add a `CNAME` file containing
`cipherbits.org` at the root of the build:

- On the source branch, the file lives in `public/CNAME`; the Astro build
  copies it into `dist/CNAME`.
- On the public `main` branch, the built site is committed at the root, so
  the file is simply `CNAME`.

## 3. Publish

The private repository keeps the project history. The public Pages
repository has two branches:

- `project` — the project itself: `docs/`, `media/`, `README.md`, plus the
  build in `dist/`. It is fed by the private `main` branch.
- `main` — the site only: the content of `dist/` at the root. GitHub Pages
  serves this branch directly (Deploy from a branch, branch `main`, path `/`).

Commit the fresh build on the private `main` branch — every deployed commit
is committed there with its original date — then push it onto `project`:

```bash
git checkout main
rm -rf dist && cp -r <build-output> dist
git add dist
GIT_AUTHOR_DATE="<deployment date>" GIT_COMMITTER_DATE="<deployment date>" git commit -m "<what the deployment ships>"
git push --force-with-lease deploy main:project
```

Then rebuild the site branch from `project` with the release script, which
copies every `dist/` change as its own dated commit chained on `main` —
never an orphan overwrite:

```bash
scripts/release.sh deploy
```

The script validates `project`'s history first (read-only, fails fast on a
mixed commit — one that touches `dist/` and other paths — writing nothing)
and only then rebuilds and force-pushes the public `main`. No pull request,
no squash — the commit history and its dates are preserved.

## 4. DNS

In Cloudflare, add a CNAME record pointing `cipherbits.org` at
`imdela.github.io` (DNS only, proxying off). GitHub Pages requires a
non-proxied record to issue the certificate.

## 5. Custom domain in Pages settings

In the Pages repository, set the custom domain to `cipherbits.org`
(Settings → Pages → Custom domain). GitHub verifies the DNS record and issues
the HTTPS certificate automatically.

## 6. Verify

- https://cipherbits.org loads over HTTPS.
- The temporary URL (`imdela.github.io/cipherbits.github.io/`) redirects to
  the custom domain.

## 7. Deployment schedule

Every deployed commit carries its original (backdated) date — the commit
date *is* the deployment date. History is written once; it is not edited
afterwards. The schedule below is the plan the site follows after launch.

| # | Date | Deployment |
|---|---|---|
| 4 | 2024-04-11 (Thu) | Content: roadmap locked at v1.0, deployment guide reset to 1.0 |
| 5 | 2024-04-13 (Sat) | Languages: French — `/fr/` pages + language switcher |
| 6 | 2024-04-18 (Thu) | SEO: French meta refinement (title, description, canonical) |

All dates are working days (Thu → Sun, per the commit calendar). Only
deployments that change `dist/` produce a new commit on the public `main`:
step 4 is a docs commit (roadmap + guide) and does not change the site.
