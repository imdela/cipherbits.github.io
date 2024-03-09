# Cipherbits — Architecture

> Version: 0.1 | March 2024
> Stack: Vanilla HTML/CSS/JS, no backend, static on Vercel

## 1. What it is

Cipherbits is a secure password generator. It runs 100% in the browser using
the native Web Crypto API (`crypto.getRandomValues`). No network call happens
during generation, nothing is stored, and there is no account, no tracking,
and no ads. It is multilingual (English default, French, Spanish) and deploys
for free on static hosting.

## 2. Repository structure

```
cipherbits.org/
├── template.html    # single template with {{placeholders}}
├── build.js         # tiny Node script: template + locales → static pages per language
├── locales/         # en.json, fr.json, es.json
├── assets/          # app.js (generator logic), style.css (design tokens)
└── dist/            # generated output — this is what gets deployed
```

## 3. Why per-language static pages

Each language gets its own indexable URL (`/`, `/fr/`, `/es/`) with its own
`<title>`, `<meta description>` and `hreflang` tags — better indexed by search
engines than a single URL with a client-side language switch. Text stays
centralized in `locales/*.json`; `build.js` regenerates the pages.

## 4. Security

Generation is 100% local via `crypto.getRandomValues()` (Web Crypto API).
Verifiable in the Network tab of the browser's developer tools. No data is
stored, no trackers, no ads.

## 5. Deployment

Vercel static hosting, free (Hobby plan). Output Directory = `dist`.
`BASE_URL` feeds the canonical and hreflang tags.
