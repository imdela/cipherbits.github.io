# Cipherbits — Style Guide

> Version: 1.0 | March 2024

*Logo, colour, typography, and UI patterns.*

---

## 01 — Logo

### Primary lockup
The icon is a rounded, open ring in Cipherbits Green, trailed by three dots of decreasing distance — read as the letter C resolving into an ellipsis. It pairs with the wordmark "cipherbits." in a clean sans, with the trailing full stop picked out in green.

- **Ink lockup** — for light backgrounds. The wordmark is set in a dark ink, the icon in Cipherbits Green, on a transparent background.
- **White lockup** — for dark backgrounds. The wordmark is set in white, the icon in the brightened green used on dark surfaces, on a transparent background.

### Clear space & minimum size
- Clear space equal to the icon mark's height on every side.
- Minimum size: 24px tall for the icon alone; 90px wide for the full lockup. Below this, icon only.

### Colour variants
- **Ink on white/light** — default context: the light-theme product UI, marketing pages, and print.
- **White on dark** — for the optional dark theme and any dark-background placement.
- **Single colour** (all Ink or all White) for contexts where colour can't reproduce.

### Don'ts
- Don't recolour the icon outside Cipherbits Green.
- Don't stretch, skew, rotate, or add shadows/glows.
- Don't set the wordmark in any typeface other than the logo itself.
- Don't place the light-background lockup on a dark surface, or vice versa — always match the variant to the background.

---

## 02 — Colour Palette

The interface uses a **light theme by default** — approachable for a general-public visitor — with a dark theme available as a one-click, user-controlled option. The brand green matches the logo exactly: `#048B6A`.

### Light theme — default

| Swatch | Name | Hex | RGB | Usage |
|---|---|---|---|---|
| ⬜ | Background | `#F7F7F4` | 247, 247, 244 | Page background |
| ⬜ | Surface | `#FFFFFF` | 255, 255, 255 | Cards, panels |
| ⬜ | Border | `#E4E5E0` | 228, 229, 224 | Hairlines, dividers |
| 🟩 | Green (primary) | `#048B6A` | 4, 139, 106 | Buttons, links, focus states — matches the logo exactly |
| 🟩 | Green (hover/active) | `#02644C` | 2, 100, 76 | Interaction state for the primary green |
| 🟩 | Green tint | `#E5F3F0` | 229, 243, 240 | Success wash, filled-state backgrounds, "Live" tag |
| ⬛ | Ink / text primary | `#15181B` | 21, 24, 27 | Headings, body text |
| ⬛ | Text secondary | `#565C61` | 86, 92, 97 | Supporting copy |

### Dark theme — optional, user-toggled

| Swatch | Name | Hex | RGB |
|---|---|---|---|
| ⬛ | Background (dark) | `#101318` | 16, 19, 24 |
| ⬛ | Surface (dark) | `#171B21` | 23, 27, 33 |
| ⬛ | Border (dark) | `#2A2F38` | 42, 47, 56 |
| 🟢 | Green (on dark) | `#39C08A` | 57, 192, 138 — brightened for contrast on dark backgrounds |

### Usage ratio
Roughly 70% neutral background, 25% neutral text/surfaces, 5–10% green. Green marks the single most important action or state on a screen — it should never compete with itself.

---

## 03 — Typography

### Typeface roles

| Role | Specification |
|---|---|
| **Display / Heading** | A geometric or grotesque sans (Inter or similar). Bold, tight tracking. Used for page titles and section headers — monospace is not used for headings. |
| **Body** | Same sans family, Regular/Medium. Paragraphs, descriptions, UI copy. |
| **Monospace** | Reserved for where it earns its place: the generated password itself (disambiguates `0`/`O`, `l`/`1`), small system labels (eyebrow tag, character count), and status tags ("Live"/"Soon"). |

### Why monospace is reserved
Monospace reads as a terminal / hacker-tool register — a signal that adds friction for the general-public visitor the product targets by default. It is kept exactly where it has a functional reason to exist (character disambiguation, system-status labels) and used nowhere it would be purely decorative.

---

## 04 — UI Components & Patterns

### Component notes
- **Buttons:** solid Green fill, white text, pill-radius, for the primary action; a bordered "ghost" button for secondary actions (Copy).
- **Cards:** white surface, soft shadow, 1px Border hairline, generous padding, 14–18px corner radius — the card must read clearly as the interactive focal point of the page.
- **Advanced options:** collapsed by default behind a plain-text disclosure toggle. Anything power-user-specific (character-set toggles, bulk generation, file download) lives here, never in the default view.
- **Trust microcopy:** one short line near the action ("Generated locally on your device — never transmitted or stored"). This is the one piece of repeated messaging that is never trimmed — it's what the visitor actually needs to verify, not marketing filler.

### "More tools" menu — the pattern for adding new tools
The header "More tools" dropdown is the only place new tools are referenced from an existing tool's page. Live tools are clickable and tagged "Live"; unreleased tools are visible, greyed out, tagged "Soon", and not clickable. This keeps the primary navigation free of dead links while keeping the roadmap transparent to anyone who chooses to look. Shipping a new tool is a small, contained change: turn the disabled item into a link, swap the "Soon" tag for "Live".

### Generate animation
On "Generate," the password reveals character-by-character through a brief scramble-to-final effect. This is the one deliberate signature moment in the interface — functional (visible confirmation something was computed) and a quiet nod to the brand name and the icon's ring-and-dots mark, without adding decoration that isn't earning its place.

---

## 05 — Iconography & Imagery
- Line-based icons, 1.5–2px stroke, no fill, rounded joins.
- No photography, no illustration, no gradients, no 3D renders.
- Diagrams use only the palette above — never introduce new colours to explain the product.

---

## 06 — Print & Stationery

Print applications use the Ink lockup on white or light-neutral stock, consistent with the product's light-first default.

| | Spec |
|---|---|
| **Business card** | Icon mark front (Ink or Green on white stock); full wordmark + monospace contact details on the back, 8–9pt. |
| **Letterhead** | Icon mark top-left, 10–12mm; footer in monospace 8pt Text-secondary; body copy in sans, Ink, no green in running text. |
| **General rule** | Green is an accent only in print — a rule, an icon, a single word — never a body-text colour. Never print the dark theme as a full-page fill for stationery. |

---

## 07 — Do's and Don'ts, Summary

| | |
|---|---|
| ✅ Do | Default to the light theme; keep dark theme as an equally polished, user-controlled option. |
| ✅ Do | Keep every tool page single-purpose — one job, one hero, one card. |
| ✅ Do | Reserve monospace for password output, system labels, and status tags — not headings. |
| ❌ Don't | Put unreleased tools in the primary navigation as clickable links. |
| ❌ Don't | Surface power-user features (bulk generation, granular options) outside Advanced options. |
| ❌ Don't | Introduce a second accent colour — green and neutrals only; red reserved for genuine errors. |

---

## 08 — Deliverables

- Ink lockup on a transparent background, for light placements.
- White lockup on a transparent background, for dark placements.
- The icon mark on its own (the ring and three dots), in Ink, White, and full colour, for favicons and app icons.
- Colour tokens for both themes, as shared design tokens.
- Type stack: sans (heading + body) and monospace, licensed for web use.

---

*End of document — Cipherbits Style Guide.*
