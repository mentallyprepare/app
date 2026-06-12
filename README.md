# Mentally Prepare — Android App

Native Android client (Expo / React Native) for Mentally Prepare, the anonymous 21-day writing ritual for Indian college students. The product is live on the web at [mymentallyprepare.com](https://mymentallyprepare.com); this app is a native client of the existing backend.

## What this repo is

- Expo (React Native) + TypeScript + Expo Router
- Talks only to the existing `/api/v1/*` backend (Express/SQLite on Railway), authenticated with Firebase ID tokens
- Built step by step against the phase plan in `BLUEPRINT.md`

## Rules

Read `CLAUDE.md` before writing any code. It summarizes the sacred list, voice rules, architecture, and workflow discipline. On any conflict, `PRINCIPLES.md` wins.

## Context documents

| File | Purpose |
|---|---|
| `CLAUDE.md` | Rules for AI-assisted development |
| `BLUEPRINT.md` | The 13-week phase plan with exit gates |
| `API.md` | Endpoint contract (source of truth) |
| `PRINCIPLES.md` | Founder-signed sacred list (wins on conflict) |
| `SYSTEMS.md` | Partner health, notification policy, AI boundaries |
| `NEXT.md` | Parked ideas, reviewed monthly |
