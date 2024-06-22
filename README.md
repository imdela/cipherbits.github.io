# Cipherbits

A secure password generator — 100% static, zero backend, multilingual
(EN default, FR, ES).

Live site: https://cipherbits.org

## What it is

Cipherbits generates passwords entirely in the browser using the native Web
Crypto API (`crypto.getRandomValues`). No network call happens during
generation, nothing is stored, and there is no account, no tracking, and no
ads. It deploys for free on static hosting (GitHub Pages).

Cipherbits is planned to grow into a small, free, transparent practical
cryptography toolkit — strength checking, breach checking (HIBP),
passphrases, TOTP, text encryption, file checksums, and more — each tool a
client-side, verifiable widget. See [docs/roadmap.md](docs/roadmap.md).

## Stack

- **Astro** — static site generator, zero JavaScript by default (tools are
  vanilla-JS "islands")
- **TypeScript** — typed crypto core in `src/lib/`, unit-tested with Vitest
- **Built-in i18n** — English at `/`, French at `/fr/`, Spanish at `/es/`,
  for the whole site, including the mini blog
- **pnpm** — package manager
- **GitHub Pages** — free static hosting (v1); **Vercel** — added for the V2
  serverless feature

## Repository layout

```
cipherbits/
├── README.md                # this file
├── docs/                    # documentation
│   ├── architecture.md      # stack, i18n model, SEO strategy, roadmap mapping
│   └── roadmap.md           # planned features beyond the generator
├── Taskfile.yml             # task runner (dev / build / test / check)
├── public/                  # favicon, robots.txt
└── src/
    ├── i18n/                # translation dictionaries (en/fr/es)
    ├── lib/                 # pure, tested crypto core
    ├── content/blog/        # mini blog — MDX articles, one file per language
    ├── components/          # Layout, LangSwitch, PasswordGenerator
    ├── pages/               # index, [locale] routes, tools, blog
    └── styles/              # design tokens
```

## Development

```bash
pnpm install
pnpm dev        # local development server
pnpm build      # static output to dist/
pnpm test       # unit tests (crypto core)
pnpm check      # pre-commit gate: lint → typecheck → test → build
```

## Deployment

The static `dist/` output is served by **GitHub Pages** (free, from the public
`cipherbits.github.io` repository — a clone of the `dev` branch). **Vercel**
(free Hobby plan) is added for the V2 ephemeral secret-sharing feature — the
only serverless piece in the roadmap. See
[docs/architecture.md](docs/architecture.md#7-development-workflow).

## Security

Generation is 100% local via `crypto.getRandomValues()` (Web Crypto API). No
network request happens during generation — verifiable in the Network tab of
your browser's developer tools. No data is stored, no trackers, no ads.
