# Design System - Apple Liquid UI

Inspired by Apple's modern design language with glassmorphism, fluid animations, and premium aesthetics.

## Color Palette

### Primary Colors
- **Purple**: `#667eea` → `#764ba2`
- **Pink**: `#f093fb`
- **Blue**: `#667eea`
- **Gradients**: Multi-stop gradients with 200% size for animation

### Background
- **Base**: Pure black `#000000`
- **Glass**: `rgba(255, 255, 255, 0.05)` with blur
- **Glass Strong**: `rgba(255, 255, 255, 0.1)` with heavier blur

## Typography

### Font Family
- **Sans**: Geist Sans (Apple system font fallback)
- **Mono**: Geist Mono

### Scale
- **Hero**: 7xl-8xl (72px-96px)
- **Section Headers**: 5xl (48px)
- **Card Titles**: xl-2xl (20px-24px)
- **Body**: sm-lg (14px-18px)

## Components

### Glass Cards
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

### Animated Gradients
- Background orbs float and pulse (6s ease)
- Gradient text shifts position (8s)
- Smooth transitions on all interactions (0.3s cubic-bezier)

### Buttons
- Glass effect with hover scale (1.05)
- Gradient text for primary CTAs
- Rounded corners (16px-24px)
- Shadow on hover

### Cards
- Rounded-3xl (24px corners)
- Glass backdrop
- Hover: scale 1.02-1.05
- Smooth transitions

## Animations

### Float
```
0%, 100%: translateY(0px)
50%: translateY(-20px)
Duration: 6s ease-in-out infinite
```

### Glow
```
0%, 100%: opacity 0.5
50%: opacity 1
Duration: 3s ease-in-out infinite
```

### Gradient Shift
```
Background position shifts 0% → 100% → 0%
Duration: 8s ease infinite
```

## Layout

### Spacing
- Container: `max-w-7xl`
- Section padding: `py-16` to `py-24`
- Card gap: `gap-4` to `gap-6`

### Responsiveness
- Mobile-first
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Hidden/show elements with `hidden md:flex`

## Effects

### Backdrop Blur
- Light: `blur-lg` (20px)
- Strong: `blur-xl` (30px)
- Always pair with `saturate(180%)`

### Shadows
- Cards: `0 8px 32px rgba(0, 0, 0, 0.37)`
- Hover: `0 8px 32px rgba(0, 0, 0, 0.5)`

### Opacity
- Primary text: `100%`
- Secondary: `60%` (`text-white/60`)
- Tertiary: `40%` (`text-white/40`)
- Disabled: `20%`

## Best Practices

1. **Always use glass effect** for cards and overlays
2. **Animate on hover** with scale + opacity changes
3. **Use gradient text** for primary headlines and CTAs
4. **Keep backgrounds dark** to make glass pop
5. **Add floating orbs** for depth and motion
6. **Round everything** - minimum 16px corners
7. **Space generously** - don't crowd elements
8. **Subtle shadows** - never too harsh

## Implementation

### New Page Checklist
- [ ] Black background with floating gradient orbs
- [ ] Glass header (sticky)
- [ ] Hero section with gradient text
- [ ] Glass cards with hover effects
- [ ] Smooth transitions on all interactive elements
- [ ] Proper spacing (py-24 for sections)
- [ ] Gradient text for CTAs
- [ ] Footer with glass effect

---

**Result:** Premium, modern UI that feels like an Apple product ✨
