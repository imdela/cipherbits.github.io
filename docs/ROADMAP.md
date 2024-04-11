# Cipherbits — Roadmap

> Version: 1.0 | March 2024

**Goal:** grow from a password generator into a small, free, transparent,
practical cryptography toolkit — every tool 100% local, verifiable, and
clearly documented whenever an exception to "100% local" exists (and why).

---

## Guiding principle

Cipherbits is not required to stay "a single tool". Each new tool follows
the same rules already set for the generator: zero account, zero ads,
verifiable behavior, and no data collection.

---

## Planned tools — 100% in your browser

All of these run entirely on your device, exactly like the generator.

### Strength checker
Analyse an existing password's real entropy, not a fake coloured bar.

### Breach checker (Have I Been Pwned)
Checks known breach databases using k-anonymity: the password is hashed
locally, only part of the hash is sent, and the full password never leaves
your device. **This is the only planned tool that makes a network call** —
it will be documented explicitly on a dedicated "How it works" page.

### Passphrase generator (diceware)
Word passphrases (e.g. "coral-storm-drone-nickel-42") from a public word
list — easier to type and remember than a random character password.

### TOTP generator
Time-based one-time codes (2FA) and scannable setup QR codes, generated
locally.

### Text encryption
AES-GCM: encrypt and decrypt text locally with a passphrase, and share the
result through any channel.

### File checksum
Verify a download's SHA-256 hash without uploading the file.

### Technical secrets
API keys and tokens: hexadecimal, Base64, UUID v4.

### Numeric PIN
A digits-only generator for unlock codes and the like.

---

## Under study

### Educational content
Interactive demos of historical ciphers (Caesar, Vigenère, XOR), short
honest articles, and a plain-language glossary of cryptography terms.

---

## V2 — planned

### Ephemeral secret sharing
Encrypt a message client-side, then share a link that self-destructs after
reading. This is the **only planned exception** to the "100% local" promise:
delivery needs a small serverless piece, and it would be documented
explicitly. Everything else stays 100% in the browser.

---

## Languages

| Language | Status |
|---|---|
| English | Live |
| Français | Live |
| Español | Next |
| 中文 | Next |
| Português | Next |
| Bahasa Indonesia | Next |
| Deutsch | Next |
| हिन्दी | Next |
| 日本語 | Next |
| العربية | Under study (RTL layout) |

English and Français are live. The others follow once native-speaker
translations exist — the site's "transparent, no-bullshit" positioning is
undermined by machine-translated UI.

---

## Versioning

| Version | Scope |
|---|---|
| **1.0** | The launch: generator + English/French bilingual + SEO. Locked. |
| **1.1, 1.2, …** | Each new language and its SEO. Shipped as ordinary commits, no history rewrite. |
| **2.0** | The toolkit: the first new tool beyond the generator. |

The version lives in this roadmap, not in the deployment guide.

---

## No dates, ever

Statuses are the only promise: **Live**, **Planned**, **Under study**,
**V2 — planned**. A roadmap is a direction, not a commitment to a date.
