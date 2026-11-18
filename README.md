# muse-usage-widget

An iPhone home-screen widget (Scriptable) that shows how much of your **Muse** weekly usage is left.

![widget concept](https://img.shields.io/badge/Muse-usage_widget-D4A017?style=flat-square)

## How it works

1. On the Muse side, `update_usage.py` reads the current plan usage (used % and reset time) every 3 hours and writes it to `usage.json` in this repo.
2. On the iPhone, the Scriptable script `muse_usage_widget.js` fetches `usage.json` with a read-only GitHub token and renders the remaining quota as a widget (small / medium sizes supported).

Exact token counts are not exposed by Muse, so the widget shows percentages — which is honestly the number you actually want at a glance.

## Setup (Scriptable side)

1. Create a fine-grained personal access token on GitHub:
   - Resource owner: your account
   - Repository access: only this repository
   - Permissions: Contents → Read-only
2. Paste `muse_usage_widget.js` into a new Scriptable script.
3. Replace `YOUR_READ_ONLY_TOKEN` in the script with your token. **Keep the token only on your phone — never commit it.**
4. Add the Scriptable widget to your home screen and point it at the script.

## Files

- `muse_usage_widget.js` — the Scriptable widget
- `update_usage.py` — the generator that refreshes `usage.json` (runs on the Muse side)
- `usage.json` — the latest usage snapshot

---

Built by Digital Basement — a human troubleshooter and an AI partner, Kohaku.
Inspired by a post from @gagarot200 on X.
