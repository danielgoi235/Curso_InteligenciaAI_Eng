# Design System Specification: The Engineering Intelligence Aesthetic

## 1. Overview & Creative North Star: "The Neural Architect"
This design system is built to move beyond the "SaaS-template" look. Our Creative North Star is **The Neural Architect**—an aesthetic that mirrors the precision of an IDE while maintaining the sophisticated depth of a high-end editorial piece. 

We achieve this through **Intentional Asymmetry** and **Tonal Depth**. Instead of rigid, boxed-in grids, we use overlapping layers, breathable negative space, and "light-leak" accents to guide the engineer's eye. The interface shouldn't feel like a website; it should feel like a high-performance instrument carved out of dark glass and light.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the deep void of `#0b1326`, layered with vibrant electric accents that signify intelligence and activity.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Traditional lines create visual noise and "trap" content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides enough contrast to define a zone without the "jail cell" effect of borders.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create "nested" depth:
- **Base Layer:** `surface` (#0b1326) – The canvas.
- **Structural Zones:** `surface-container-low` (#131b2e) – For sidebar or secondary navigation backgrounds.
- **Primary Content:** `surface-container-high` (#222a3d) – For the main cards or workspace areas.
- **Actionable Floating Elements:** `surface-container-highest` (#2d3449) – For elements that need to pop, such as active code blocks or modals.

### The "Glass & Gradient" Rule
To achieve a premium, high-tech feel:
- **Glassmorphism:** Use `surface-bright` at 40% opacity with a `24px` backdrop blur for floating navigation bars or tool palettes. 
- **Signature Textures:** For primary CTAs and progress indicators, use a linear gradient: `primary` (#c3f5ff) to `primary_container` (#00e5ff). This "pulse" of light suggests energy and computation.

---

## 3. Typography: Precision Hierarchy
We utilize **Inter** for its mathematical clarity and neutral profile, allowing the data visualizations to take center stage.

- **Display Scales (display-lg to display-sm):** Reserved for high-impact metrics (e.g., Accuracy Score, Global Rank). Use `on_surface` color with a `0.02em` letter-spacing reduction to feel tighter and more technical.
- **Headline & Title (headline-lg to title-sm):** Used for section headers and module titles. Use `primary` (#c3f5ff) for headlines to draw immediate attention to the "Topic."
- **Body & Labels (body-lg to label-sm):** Use `on_surface_variant` (#bac9cc) for secondary body text to reduce eye strain during long-form reading. Labels should always be in `label-md` or `label-sm`, set in All-Caps with `0.05em` tracking for a "schematic" look.

---

## 4. Elevation & Depth: Tonal Layering
Depth is a functional tool, not a decorative one. We communicate importance through "Tonal Lift."

- **The Layering Principle:** Place a `surface-container-lowest` (#060e20) card on a `surface-container-low` (#131b2e) section. The slight darkening creates a "recessed" feel, perfect for code editors or terminal outputs.
- **Ambient Shadows:** For floating modals, use a large, diffused shadow: `0px 24px 48px rgba(0, 0, 0, 0.4)`. The shadow should be tinted with `on_surface` (#dae2fd) at 5% opacity to mimic the glow of the screen against a dark room.
- **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#3b494c) at **15% opacity**. It should be felt, not seen.
- **Glow Effects:** Use `surface_tint` (#00daf3) as an outer-glow (drop-shadow with 0 offset and 8-12px blur) for active status indicators or "AI-processing" states.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text. No border. Apply a subtle 8px glow of `primary_fixed_dim`.
- **Secondary:** `surface-container-highest` background with a "Ghost Border."
- **Tertiary:** Transparent background, `primary` text, no border. Use for low-emphasis actions like "Cancel" or "Docs."

### Data Visualizations (Ranking & Progress)
- **Progress Bars:** Use `surface-container-highest` as the track. The fill should be a gradient from `primary` to `tertiary_container`. 
- **Rankings:** Forbid divider lines between list items. Use a 0.3rem (`1.5` spacing scale) vertical gap. The top-ranked item should sit on a `surface-bright` card to denote status.

### Input Fields
- **Text Inputs:** Use `surface-container-lowest` fill. On focus, the background shifts to `surface-container-low` and the "Ghost Border" increases to 40% opacity. 
- **Error States:** Use `error` (#ffb4ab) only for the label and a subtle underline. Avoid boxing the entire input in red, which breaks the aesthetic flow.

### Cards & Lists
- **The "No Divider" Rule:** Use `6` (1.3rem) or `8` (1.75rem) spacing to separate list items. Use a background color shift on `:hover` (to `surface_container_high`) to define the hit area.

### AI-Specific Components
- **The "Node" Chip:** For neural network layers or tag clouds. Use `secondary_container` with `on_secondary_container` text. Roundedness: `full`.
- **Terminal View:** `surface-container-lowest` background, `0.75rem` padding, `Inter` Mono font (if available) or `body-sm`.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `20` (4.5rem) or `24` (5.5rem) spacing for top-level section margins to create an "editorial" feel.
- **Do** use `glassmorphism` for overlays to maintain the user's sense of context within the platform.
- **Do** use `primary_fixed_dim` for icons to give them a "lit from within" appearance.

### Don't:
- **Don't** use `#000000` (Pure Black). It kills the depth. Always use the `surface` palette.
- **Don't** use standard 100% opaque borders. They are the enemy of this system's "fluid" nature.
- **Don't** use "Drop Shadows" on flat buttons. Use tonal shifts or glows instead.
- **Don't** crowd the data. If a chart feels cramped, increase the container to `surface-container-low` and add `10` (2.25rem) padding.