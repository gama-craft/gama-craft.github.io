# Gama Craft

A responsive, buildless corporate website using the supplied red brand mark and a charcoal palette.

## Local preview

Run `python -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173.

- `index.html`: page content and accessible navigation
- `styles.css`: responsive layout, graphics, and reduced-motion support
- `app.js`: mobile menu, service dialogs, and email copy
- `images/brand-mark.png`: supplied transparent logo

The contact links open an email draft; no email is sent by the website. Fonts are loaded from Google Fonts with system fallbacks.

The isolated `gamacraft-redline/` folder holds the private Sites deployment copy and its hosting manifest. Copy the three source files and brand mark into its `dist/` directory before publishing a new version.
