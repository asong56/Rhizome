# 🌿 Rhizome

**A minimalist, decentralized webring protocol for the indie web.**

Rhizome is a zero-dependency webring infrastructure built for developers who want to be found without going through a platform. It rejects the hierarchy of algorithmic feeds and centralized directories — sites connect as peers, no center, no authority, just a living network that grows one node at a time.

[Live Demo](https://Ansel-S.github.io/Rhizome/) · [Join the Network](https://github.com/Ansel-S/Rhizome/issues/new?template=join.yml)

---

## ✨ Key Features

- 🌱 **Dead Simple to Join:** No account, no config file, no ID to manage. Open an issue with your name, URL, and bio — that's it.
- 🎲 **Random Traversal:** Click *Wander* on the landing page to jump to a random node in the network.
- 🖥️ **Node Registry Card:** Every traversal passes through a macOS-style transit page that shows a generated node fingerprint, coordinates, and IPv6 address before jumping.
- ⚡ **Ultra-Lightweight:** The routing engine (`pulse.js`) is under 600B gzipped. No frameworks, no build step, no runtime dependencies.
- 🔁 **Auto-Pruning:** A weekly GitHub Actions job probes every node URL. Unreachable sites are automatically marked `dormant` and excluded from traversal — and revived when they come back.
- 🔒 **Cache-First:** Node data is cached in `localStorage` for 24 hours, so traversal works even with intermittent connectivity.

---

## 🛠️ The Tech Stack

- **Vanilla JavaScript:** Zero-dependency routing, FNV-1a URL hashing for node identity, LCG seeded RNG for deterministic fake metadata.
- **Web Components:** The `<rhizome-spore>` embed is a self-contained Shadow DOM widget with ink-bleed hover effects and a clip-path transition overlay.
- **CSS Custom Properties:** Playfair Display + system sans-serif typography, golden-ratio spacing, and a warm alabaster palette — all in plain CSS.
- **GitHub Actions:** A single weekly workflow (`prune.yml`) handles node health checks and commits changes automatically.
- **GitHub Pages:** Zero-config deployment. No build step. Push and it's live.

---

## 🚀 Quick Start

### Join as a member

1. Embed the Spore widget on your site before `</body>`:

```html
<rhizome-spore
    theme="light"
    node-url="https://yoursite.com"
    host="https://Ansel-S.github.io/Rhizome"
></rhizome-spore>
<script
    src="https://Ansel-S.github.io/Rhizome/spore.js"
    async></script>
```

2. [Open an issue](https://github.com/Ansel-S/Rhizome/issues/new?template=join.yml) with your site name, URL, and bio — I'll add you.

| Attribute | Description |
|---|---|
| `theme` | `light` or `dark` |
| `node-url` | Your site's canonical URL |
| `host` | The Rhizome deployment base URL |
| `label` | Widget label (default: `🌿 Rhizome`) |

### Fork your own Rhizome

```bash
# 1. Fork this repo on GitHub
# 2. Settings → Pages → Deploy from branch → main → / (root)
# 3. Add your nodes to nodes.json
# 4. Update the host URL in index.html and your Spore embeds
```

Each fork is a fully independent Sub-Rhizome. The network is decentralized by design.

---

## 📁 File Structure

```
Rhizome/
├── index.html                  # Landing page
├── ring.html                   # Transit page (node registry card)
├── nodes.json                  # Node registry — name, url, bio only
├── pulse.js                    # Routing engine (<600B gz)
├── spore.js                    # <rhizome-spore> Web Component
├── assets/
│   ├── css/
│   │   ├── index.css           # Landing page styles
│   │   └── ring.css            # Transit page styles
│   └── js/
│       ├── index.js            # Wander button logic
│       └── ring.js             # Transit page logic
├── scripts/
│   └── prune.js                # Weekly node health check (CI only)
└── .github/
    ├── ISSUE_TEMPLATE/
    │   └── join.yml            # Join request form
    └── workflows/
        └── prune.yml           # Auto-prune every Sunday 00:00 UTC
```

---

## ⚡ Performance

| File | Raw | Gzipped |
|---|---|---|
| `pulse.js` | 1.4KB | 709B |
| `spore.js` | 4.0KB | 1.8KB |
| `ring.html` | 3.6KB | 1.0KB |
| `index.html` | 5.1KB | 1.7KB |
| Main-thread blocking | — | **0ms** |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

> 🌿 The rhizome has no beginning or end; it is always in the middle, between things, interbeing, *intermezzo.* — Deleuze & Guattari

---

Built with ❤️ by Ansel.
