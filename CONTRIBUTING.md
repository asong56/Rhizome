# Contributing to Rhizome

Thank you for your interest in Rhizome. There are two ways to contribute: joining the network as a member, or improving the project itself.

---

## Joining the Network

The simplest contribution is adding your site.

1. **Embed the Spore** on your site first (see [README](README.md#join-as-a-member)). Your site must have the widget live before being added.

2. **Open a Join issue** using the [join request template](https://github.com/Ansel-S/Rhizome/issues/new?template=join.yml). Fill in your site name, URL, and a one-sentence bio (160 chars max).

3. **Wait for review.** The maintainer will verify your site has the Spore embedded, then add your entry to `nodes.json`.

**Node requirements:**
- Must be a personal or independent site (no commercial storefronts, no spam)
- Must be publicly accessible via HTTPS
- Must have the `<rhizome-spore>` widget embedded and functional
- Must not host illegal content, malware, or hate speech
- Bio must be in plain text, 160 characters or fewer

Nodes that go offline for an extended period will be automatically marked `dormant` by the weekly pruner and excluded from traversal. They are revived automatically when they come back online.

---

## Improving the Project

### Reporting bugs

Open a GitHub issue. Include:
- What you expected to happen
- What actually happened
- Browser and OS
- Steps to reproduce

### Suggesting changes

Open a GitHub issue before writing any code. Describe the problem you're solving and your proposed approach. Small, focused changes are preferred over large rewrites.

### Submitting code

1. Fork the repository.
2. Create a branch: `git checkout -b fix/your-description`
3. Make your changes. Keep commits small and focused.
4. Test in a browser — there is no test suite, so manual verification matters.
5. Open a pull request with a clear description of what changed and why.

### Code style

- **Vanilla JS only.** No frameworks, no bundlers, no npm dependencies for the runtime files (`pulse.js`, `spore.js`, `assets/js/`).
- **4-space indentation** throughout.
- Keep file sizes in mind — `pulse.js` must stay under 1KB raw. Check gzipped sizes before submitting.
- CSS variables for all colors and repeated values.
- Semantic HTML with ARIA attributes where appropriate.

### What we won't accept

- Dependencies that add to the runtime bundle
- Features that require a server or database
- Changes that break the zero-config GitHub Pages deployment
- Nodes or content that violate the [Code of Conduct](CODE_OF_CONDUCT.md)

---

## Project Philosophy

Rhizome is intentionally minimal. Every addition should be weighed against the cost it imposes on the network — in bytes, complexity, and maintenance burden. When in doubt, do less.

The network grows one node at a time. That's enough.
