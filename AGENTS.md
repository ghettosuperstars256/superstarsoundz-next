# agents.md — Superstarsoundz.com (SSZ Next.js)
> Project context for the Hermes Agent. Read this before any SSZ-Next work.

## Project Identity
- **Domain:** superstarsoundz.com
- **Type:** Affiliate content site (music industry gear reviews & buying guides)
- **Stack:** Next.js (React) + Vercel hosting
- **GitHub:** ghettosuperstars256/superstarsoundz-next
- **Deployment:** Vercel auto-deploys from git push

## What This Project IS
- DJ gear, PA systems, studio monitors, audio interfaces, microphones, instruments
- Buying guides and "Best X Under $Y" content
- Affiliate product pages linking to retailers
- Content-rich blog posts with comparison tables
- Product catalog under /gear/

## What This Project is NOT
- NOT WordPress — no WP REST API, no PHP, no WooCommerce
- NOT an e-commerce store (no checkout, no payments)
- NOT a client services site
- NOT the same as Ghetto Superstars or Umar Khan Charity
- Runs on its OWN stack — never mix Next.js code into WP projects or vice versa

## Stack Isolation — CRITICAL
- This is NEXT.JS/REACT. WordPress tools WILL NOT work here.
- Never push WP REST API calls, PHP code, or WP-CLI commands to this project.
- Never mix Next.js code with WordPress projects in the same session.

## Content Rules
- Multi-page site only (never single-page)
- Real CDN product images only (never emoji)
- Global-facing copy (NO Uganda localization on product/shop pages)
- Preview HTML as Telegram doc before WP push
- Semantic ordering: informational content before transactional
- Category-by-category publishing checkpoints
- Comparison tables in all buying guides

## Key Patterns
- 'use client' can't export metadata (use layout.tsx)
- Smart quotes break JSX strings
- Vercel auto-deploys from git push (no CLI auth needed)

## Do NOT
- Use WP REST API on this domain
- Install WordPress plugins
- Mix this project with SSZ (WordPress) or Ghetto work in the same session
- Modify Vercel config without Mainman approval
