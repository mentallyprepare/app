# Mentally Prepare — Android App

Native Android client (Expo / React Native) for Mentally Prepare, the anonymous 21-day writing ritual for Indian college students. The product is live on the web at [mymentallyprepare.com](https://mymentallyprepare.com); this app is a native client of the existing backend.

## What this repo is

- Expo (React Native) + TypeScript + Expo Router
- Talks only to the existing `/api/v1/*` backend (Express/SQLite on Railway), authenticated with Firebase ID tokens
- Built step by step against the phase plan in `BLUEPRINT.md`

## Rules

Read `CLAUDE.md` before writing any code. It summarizes the sacred list, voice rules, architecture, and workflow discipline. On any conflict, `PRINCIPLES.md` wins.

## Context documents

| File | Status |
|---|---|
| `CLAUDE.md` | ✅ in repo |
| `BLUEPRINT.md` | ⬜ to be added (13-week phase plan) |
| `API.md` | ⬜ to be added (endpoint contract, source of truth) |
| `PRINCIPLES.md` | ⬜ to be added (founder-signed sacred list) |
| `SYSTEMS.md` | ⬜ to be added (partner health, notifications, AI boundaries) |
| `NEXT.md` | ⬜ to be added (parked ideas) |

No code work starts until `BLUEPRINT.md` and `API.md` are in place.
