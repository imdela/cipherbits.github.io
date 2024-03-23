# Cipherbits — Deployment

> Version: 1.1 | March 2024
> Scope: build the site, publish it to GitHub Pages, point the custom domain at it

Step-by-step guide to deploy cipherbits.org. Follow the steps in order. The
whole process is manual: nothing here is automated.

## 1. Build

On the source branch (`vanilla-v3`), build the site:

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

The public Pages repository has two branches:

- `project` — the project itself: `docs/`, `media/`, `README.md`, plus the
  build in `dist/`. It is fed by the private `dev` branch.
- `main` — the site only: the content of `dist/` at the root. GitHub Pages
  serves this branch directly (Deploy from a branch, branch `main`, path `/`).

Commit the build on the `dev` branch — every deployed commit is committed
there with its original date — then push `dev` onto `project`:

```bash
git push --force-with-lease deploy dev:project
```

Then deploy the site: rebuild the `site-branch` from the fresh build and
push it onto `main`:

```bash
git branch -D site-branch 2>/dev/null; git checkout --orphan site-branch
git rm -rf --cached .
git read-tree dev:dist
git checkout-index -a -f
GIT_AUTHOR_DATE="<deployment date>" GIT_COMMITTER_DATE="<deployment date>" git commit -m "<what the deployment ships>"
git push --force-with-lease deploy site-branch:main
```

No pull request, no squash — the commit history and its dates are preserved.

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
