# Brand Apps — Design System

> Cross-platform apps (Flutter, desktop, mobile). Map from SSOT, don't import CSS.

## Quick Reference
- **Light:** Background `#EFE3D2`, Surface `#FFFFFF`, Text `#2A1A10`, Primary CTA `#6F1D1B`
- **Dark:** Background `#15100b`, Surface `#231a14`, Text `#F5EFE7`, Primary accent `#BB9457`
- **Typography:** Inter for UI, Playfair Display sparingly for marketing/display
- **Grid:** 4pt

## Rules
1. **ThemeData first** - Generate `ColorScheme`/`TextTheme` from `tokens.json`. Don't rely on web CSS vars.
2. **Light/Dark required** - Support both using `app.light` and `app.dark`
3. **Accessible** - Keep WCAG AA contrast. Harvest Gold decorative only in most contexts.
4. **Platform native** - Respect Material/Cupertino where sensible, but enforce brand palette
5. **Focus/interaction** - Use states from Material system, tinted with brand colors
6. **Web export** - If Flutter web is purely CSS driven and needs web tokens, you may reference `brand-webapps`, but `brand-apps` remains the SSOT for the app theme
7. **Icons** - Prefer `flutter_lucide` or custom brand icons
