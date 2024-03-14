# Cipherbits — Brand Book

> Version: 1.0 | March 2024

*Who we are, who we're for, and how we sound.*

---

## 01 — Brand Overview

### Who we are
Cipherbits is a small, transparent cryptography toolkit that runs entirely in the browser. It starts with a local password generator and grows into a full set of tools — passphrases, breach checking, TOTP + QR, text encryption — each built on the same principle: nothing the user generates is ever sent, logged, or stored anywhere.

**Cipherbits is built for the general public first, not for a technical audience.** Anyone who needs a password — signing up for a new account, resetting a login, helping a relative — is the primary user. Power users (developers, IT/sysadmins) are fully served too, through an Advanced options panel that stays out of the way until someone asks for it.

### Brand pillars
- **Local-first.** Everything communicates that processing happens on-device, in the browser, in real time.
- **Transparent.** No dark patterns, no hidden costs, no ambiguity about what the product does with data (nothing).
- **Approachable by default, technical on request.** The interface greets a first-time, non-technical visitor with zero jargon and one obvious action; anything power-user-specific lives one click away in Advanced options.
- **Minimal by default.** One task per page, one accent colour, no decorative content that isn't functional.

### Personality, in three words
**Trustworthy · Approachable · Unhurried**

> Litmus test for any new asset: if it doesn't support "local, transparent, approachable-first," it doesn't belong in the Cipherbits brand.

---

## 02 — Audience

### Primary: the general public
Anyone who lands on Cipherbits because they need a password right now, with no prior security knowledge assumed. They want to see the generator immediately, click once, copy, and leave. Every default (secure character types pre-selected, sensible length, no forced choices) is tuned for this person to succeed without reading anything.

### Secondary: technical / power users
Developers, sysadmins, and privacy-conscious users who want to tune character sets, generate in bulk, or verify the tool is genuinely local-only. They are fully supported — just not at the expense of the primary audience's simplicity. Advanced options, the open-source/local-execution framing, and the technical precision of the copy all serve this group without requiring the general-public visitor to see any of it by default.

### What this means in practice
- Defaults must always produce a safe, usable result with zero configuration.
- Anything power-user-specific (bulk generation, file download, granular character-set control) is opt-in, never default-visible.
- Copy is written for a first-time visitor with no security background — plain language, no acronyms without explanation.
- Trust signals (local-only, no account, no ads) are stated once, clearly, near the point of action — not buried in a privacy policy the general-public visitor won't read.

---

## 03 — Voice & Tone

### Principles
- **Plain and factual.** Say what the tool does, not how impressive it is. "Nothing you generate is sent, logged, or stored anywhere — not even to us" beats "revolutionary military-grade security."
- **Short sentences, active voice, no filler adjectives.**
- **No jargon by default.** Technical accuracy still matters, but the general-public reader should never need to look a term up to understand the main flow.
- **Dry, not cold.** A light, understated touch is welcome in secondary copy; the core flow stays neutral, calm, and fast to scan.

### Do / Don't

| | Example |
|---|---|
| ✅ Do | "Get a strong password in one click." |
| ❌ Don't | "Leverage cryptographically secure entropy for maximum-strength credential generation." |
| ✅ Do | "Generated locally on your device — never transmitted or stored." |
| ❌ Don't | "The world's most secure password generator, trusted by millions!" |

---

## 04 — Brand Architecture: adding new tools

As Cipherbits grows from one tool into a toolkit (Passphrases, Breach checker, Text encryption), each new tool follows the same brand logic already established for the password generator:

- **One tool, one page, one job.** A new tool gets its own focused landing page — same layout logic as the password generator (short headline, the tool front and centre, Advanced options collapsed) — never bolted on as a tab inside an existing tool's page.
- **Tools are cross-linked only through the "More tools" menu** in the header, never through the primary navigation. This keeps every individual tool page single-purpose, and keeps unreleased tools discoverable without ever presenting a dead link as if it were live.
- **A tool only appears as selectable/live in that menu once it is actually shipped**; until then it's listed, greyed out, and tagged "Soon" — visible for transparency about the roadmap, but never clickable.

*See the companion Style Guide for the exact visual pattern and markup used for this menu.*

---

*End of document — Cipherbits Brand Book.*
