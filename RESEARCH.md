# Ratty Run Club - Website Research

## Run Club Website Landscape Analysis

### Sites Analyzed
- November Project (november-project.com) - WordPress, grassroots, "just show up"
- NYRR (nyrr.org) - Drupal/custom, institutional, full registration platform
- Midnight Runners (midnightrunners.com) - Webflow, dark/energetic, uses Heylo for events
- Parkrun (parkrun.com) - Custom + WordPress, data-driven, universal barcode system
- Black Girls RUN! (blackgirlsrun.com) - WordPress + Shopify, mission-driven
- Black Men Run (blackmenrun.com) - WordPress, community-focused
- Koreatown Run Club (koreatownrunclub.com) - Shopify, merch-first, streetwear aesthetic
- Bandit Running (banditrunning.com) - Shopify, brand + community hybrid

### Common Page Structure
| Page | Prevalence | Notes |
|------|-----------|-------|
| Home / Landing | 8/8 | Mission-first messaging, strong hero |
| About / Our Story | 8/8 | Origin story is crucial |
| Schedule / Events | 8/8 | Core utility page |
| Blog / Stories | 7/8 | Community storytelling |
| Shop / Merch | 5/8 | Revenue driver for grassroots clubs |
| FAQ | 4/8 | Newcomer onboarding |
| Code of Conduct | 2/8 | Growing trend |

### Event Handling Models
1. **"Just show up"** - Static schedule page, no registration (November Project, KRC)
2. **External app** - Website stays lean, booking via Heylo/Luma (Midnight Runners)
3. **Full platform** - Custom registration with results (NYRR, Parkrun)

### Social/Photo Patterns
- Instagram is the primary photo archive for all clubs
- Blog recaps with embedded photos on-site
- Instagram feed widgets (EmbedSocial, Elfsight) auto-pull from branded hashtags
- Strava embed widgets broke Jan 2026; route embeds still work

### Tech Stack Patterns
| Pattern | Examples | Good for |
|---------|----------|----------|
| WordPress | November Project, BGR!, BMR | Content-heavy sites |
| Shopify | KRC, Bandit | Merch-first clubs |
| WordPress + Shopify | BGR!, Parkrun | Content + separate shop |
| Custom (Next.js/Astro) | NYRR results | Max control |

## Design Reference
- **Primary vibe**: Dark & energetic (Midnight Runners, KRC style)
- **Shop reference**: LTTT (lttt.life) - Shopify, minimal, streetwear-forward community merch

## Decisions Made
- **Framework**: Next.js
- **Design**: Dark & energetic, mobile-first
- **Features for launch**: Events/schedule, photo gallery, social/Strava links, about/join info, shop
- **Shop inspiration**: lttt.life (Little Tokyo Table Tennis) - minimal, clean product grid, community club meets cult merch
