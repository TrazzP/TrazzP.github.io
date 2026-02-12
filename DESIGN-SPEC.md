# Onevia Brand Design Specification

**Version:** 1.0
**Last Updated:** February 12, 2026
**Status:** Design Review & Recommendations

---

## Executive Summary

This document provides a comprehensive design specification for the Onevia website redesign, including current implementation analysis, brand guidelines, and strategic recommendations for achieving a premium healthcare brand experience.

**Overall Design Assessment:** 7.5/10

The current design successfully establishes a clean, professional foundation with thoughtful glassmorphism integration. However, there are opportunities to elevate the premium feel, refine the color harmony, and enhance the pharmaceutical-ad optimism to match the brand vision.

---

## 1. Color Palette

### 1.1 Current Color System

#### Primary Colors
```css
--ink: #0b1e33              /* Deep navy - primary text */
--ink-soft: #1c2a44         /* Slightly lighter navy */
--accent: #1f6fb2           /* Blue - primary brand color */
--accent-2: #1f6fb2         /* Secondary accent (currently identical) */
```

#### Neutral Colors
```css
--sand: #f2f7fb             /* Light warm background */
--mist: #e8f2fb             /* Cool light background */
--white: #ffffff            /* Pure white */
```

#### Background Gradients
```css
/* Body gradient */
background: linear-gradient(180deg, #f8f4ee 0%, #eef4fb 45%, #f6fbff 100%);

/* Accent gradient */
background: linear-gradient(140deg, #1f6fb2 0%, #2a7ccf 100%);
```

### 1.2 Design Assessment

**Strengths:**
- Clean, professional color choices
- Good contrast for accessibility
- Subtle gradients create depth without overwhelming

**Opportunities for Improvement:**

1. **Color Harmony Issues:**
   - The warm beige (#f8f4ee) at the top of the body gradient clashes with the cool blue theme
   - Creates an inconsistent temperature throughout the experience
   - Undermines the "liquid glass" aesthetic which requires cooler tones

2. **Accent Color Redundancy:**
   - `--accent` and `--accent-2` are identical (#1f6fb2)
   - Missed opportunity for complementary accent (e.g., success green, warm optimism)

3. **Limited Emotional Range:**
   - Lacks a warm optimism accent (pharmaceutical ads use warm golds, soft corals)
   - No success/validation color for positive moments (membership confirmations, savings highlights)

### 1.3 Recommended Color Palette

#### Primary Brand Colors
```css
--ink: #0b1e33                    /* Keep - excellent deep navy */
--ink-soft: #1c2a44               /* Keep - good hierarchy */
--accent: #1f6fb2                 /* Keep - primary blue */
--accent-warm: #2b7ed8            /* New - brighter, more optimistic blue */
```

#### Secondary Accents
```css
--accent-success: #2bb673         /* New - validation, savings, positive outcomes */
--accent-optimism: #f8a44f        /* New - warm pharmaceutical optimism */
--accent-subtle: #7ec1ff          /* New - light blue for hover states */
```

#### Neutrals (Refined)
```css
--sand: #f6f9fc                   /* Cooler, more aligned with glass aesthetic */
--mist: #e8f2fb                   /* Keep - perfect for sections */
--cloud: #f9fcff                  /* New - ultra-light for cards */
--white: #ffffff                  /* Keep */
```

#### Glass Colors (New Category)
```css
--glass-base: rgba(255, 255, 255, 0.70)
--glass-border: rgba(255, 255, 255, 0.65)
--glass-hover: rgba(255, 255, 255, 0.85)
--glass-tint: rgba(31, 111, 178, 0.15)
```

#### Background System (Refined)
```css
/* Premium cool gradient - replaces warm opening */
background: linear-gradient(180deg, #f6f9fc 0%, #eef4fb 45%, #f6fbff 100%);

/* Hero accent gradient - more vibrant */
background: linear-gradient(140deg, #1f6fb2 0%, #2b7ed8 100%);

/* Success gradient for CTAs and highlights */
background: linear-gradient(135deg, #2bb673 0%, #2b8fd8 100%);
```

---

## 2. Typography System

### 2.1 Current Implementation

#### Font Families
```css
--font-heading: "Fraunces", serif    /* Warm, classic serif */
--font-body: "Karla", sans-serif     /* Clean, readable sans */
```

**Font Pairing Assessment:** 8/10
- Excellent contrast between serif headlines and sans body
- Fraunces brings warmth and humanity
- Karla is highly legible and modern

#### Current Type Scale
```css
/* Hero headline */
font-size: clamp(2.8rem, 5vw, 4rem)

/* Section headlines */
font-size: clamp(2rem, 3vw, 2.6rem)

/* Service titles */
font-size: clamp(2.4rem, 3.5vw, 3.2rem)

/* Body text */
font-size: 1rem (implied base)
line-height: 1.6
```

### 2.2 Design Assessment

**Strengths:**
- Fluid type scaling with clamp() is modern and responsive
- Good hierarchy between levels
- Line-height provides excellent readability

**Opportunities for Improvement:**

1. **Lack of Intermediate Sizes:**
   - Jump from body (1rem) to section headlines (2rem+) is large
   - Missing h3, h4, lead paragraph specifications

2. **Font Weight Usage:**
   - Heavy reliance on 600-700 weights
   - Could use more nuanced weight scale (400, 500, 600, 700)

3. **Letter Spacing:**
   - Eyebrow text uses 0.18em (good)
   - Headlines could benefit from tighter tracking (-0.02em to -0.01em)

### 2.3 Recommended Typography System

#### Type Scale (8pt base)
```css
/* Display (hero moments) */
--type-display: clamp(3.2rem, 5.5vw, 4.5rem)
--type-display-weight: 700
--type-display-tracking: -0.02em

/* H1 (page headlines) */
--type-h1: clamp(2.6rem, 4.5vw, 3.6rem)
--type-h1-weight: 700
--type-h1-tracking: -0.015em

/* H2 (section headlines) */
--type-h2: clamp(2rem, 3.2vw, 2.8rem)
--type-h2-weight: 600
--type-h2-tracking: -0.01em

/* H3 (card headlines) */
--type-h3: clamp(1.5rem, 2.4vw, 2rem)
--type-h3-weight: 600

/* H4 (subsection headlines) */
--type-h4: clamp(1.2rem, 1.8vw, 1.5rem)
--type-h4-weight: 600

/* Body Large (lead paragraphs) */
--type-body-large: 1.125rem
--type-body-large-weight: 400
--type-body-large-line-height: 1.7

/* Body (default) */
--type-body: 1rem
--type-body-weight: 400
--type-body-line-height: 1.6

/* Body Small (metadata, captions) */
--type-body-small: 0.9rem
--type-body-small-weight: 500
--type-body-small-line-height: 1.5

/* Eyebrow (category labels) */
--type-eyebrow: 0.8rem
--type-eyebrow-weight: 600
--type-eyebrow-tracking: 0.12em
--type-eyebrow-transform: uppercase
```

#### Font Usage Guidelines

**Headlines (Fraunces):**
- Use for h1, h2, h3, display
- Creates emotional connection and warmth
- Works beautifully with glassmorphism

**Body Text (Karla):**
- Use for body copy, captions, UI elements
- Maintains readability and professionalism
- Weight range: 400-700

**Color Relationships:**
```css
/* Primary text */
--text-primary: var(--ink)         /* #0b1e33 */

/* Secondary text */
--text-secondary: #41546a          /* Softer navy */

/* Tertiary text */
--text-tertiary: #4f6074           /* Muted */

/* Accent text */
--text-accent: var(--accent)       /* Links, highlights */

/* On dark backgrounds */
--text-inverse: #ffffff
--text-inverse-muted: rgba(255, 255, 255, 0.8)
```

---

## 3. Glassmorphism Specifications

### 3.1 Current Implementation

**Strength:** The glassmorphism is tastefully implemented and not gimmicky.

#### Glass Components

**Glass Overlay (hero images):**
```css
background: rgba(255, 255, 255, 0.66)
border: 1px solid rgba(255, 255, 255, 0.7)
backdrop-filter: blur(12px) saturate(140%)
box-shadow: 0 20px 50px rgba(13, 27, 42, 0.2)
border-radius: 20px
```

**Glass Panel:**
```css
background: rgba(255, 255, 255, 0.78)
border: 1px solid rgba(255, 255, 255, 0.6)
backdrop-filter: blur(10px) saturate(130%)
box-shadow: 0 20px 50px rgba(13, 27, 42, 0.16)
border-radius: 18px
```

**Glass Bubble:**
```css
background: linear-gradient(135deg, rgba(255, 255, 255, 0.55), rgba(31, 111, 178, 0.2))
border: 1px solid rgba(255, 255, 255, 0.65)
backdrop-filter: blur(14px) saturate(140%)
box-shadow: 0 14px 30px rgba(13, 27, 42, 0.14)
border-radius: 16px
```

### 3.2 Design Assessment

**Strengths:**
- Premium feel achieved
- Not overwhelming or gimmicky
- Good layering and depth hierarchy

**Opportunities for Improvement:**

1. **Blur Consistency:**
   - Blur values vary (10px, 12px, 14px)
   - Recommendation: Establish 3-tier blur system (subtle, medium, strong)

2. **Saturation Values:**
   - Good use of saturation(130-140%)
   - Creates the "liquid" quality successfully

3. **Border Transparency:**
   - Works well overall
   - Could be slightly more pronounced for accessibility

### 3.3 Recommended Glass System

#### Glass Tiers

**Tier 1: Subtle Glass (background elements)**
```css
.glass-subtle {
  background: rgba(255, 255, 255, 0.50);
  border: 1px solid rgba(255, 255, 255, 0.60);
  backdrop-filter: blur(8px) saturate(120%);
  box-shadow: 0 8px 24px rgba(13, 27, 42, 0.10);
}
```

**Tier 2: Medium Glass (cards, overlays)**
```css
.glass-medium {
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px) saturate(135%);
  box-shadow: 0 16px 40px rgba(13, 27, 42, 0.16);
}
```

**Tier 3: Strong Glass (hero overlays, CTAs)**
```css
.glass-strong {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(16px) saturate(140%);
  box-shadow: 0 24px 60px rgba(13, 27, 42, 0.22);
}
```

#### Glass with Tint (for visual interest)
```css
.glass-tint-blue {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.60),
    rgba(31, 111, 178, 0.20)
  );
  border: 1px solid rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(14px) saturate(140%);
}

.glass-tint-success {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.60),
    rgba(43, 182, 115, 0.18)
  );
  border: 1px solid rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(14px) saturate(135%);
}
```

#### Interactive States
```css
.glass-interactive:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 20px 48px rgba(13, 27, 42, 0.20);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-interactive:active {
  transform: translateY(0) scale(0.99);
}
```

---

## 4. Animation & Motion Design

### 4.1 Current Implementation

#### Transitions
```css
transition: transform 0.2s ease, box-shadow 0.2s ease;
transition: all 0.6s ease; /* for reveal animations */
```

#### Reveal Animations
```css
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

#### Hover States
```css
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.glass-bubble:hover {
  transform: translateY(-2px) scale(1.02);
}
```

### 4.2 Design Assessment

**Strengths:**
- Subtle, professional animations
- Good use of IntersectionObserver for performance
- Hover states provide clear feedback

**Opportunities for Improvement:**

1. **Easing Functions:**
   - Using generic `ease` - could benefit from custom bezier curves
   - Premium brands use more sophisticated easing

2. **Stagger Animations:**
   - Reveal animations are uniform
   - Could stagger child elements for more polish

3. **Micro-interactions:**
   - Missing subtle interactions (button ripple, input focus glow)

### 4.3 Recommended Motion System

#### Timing Scale
```css
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

#### Easing Functions
```css
/* Standard easing */
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Deceleration (enter) */
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);

/* Acceleration (exit) */
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);

/* Bounce (playful interactions) */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Smooth (glass movements) */
--ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);
```

#### Animation Patterns

**Button Interactions:**
```css
.btn {
  transition:
    transform var(--duration-fast) var(--ease-bounce),
    background var(--duration-base) var(--ease-standard),
    box-shadow var(--duration-base) var(--ease-standard);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(13, 27, 42, 0.24);
}

.btn:active {
  transform: translateY(-1px);
  transition-duration: var(--duration-instant);
}
```

**Glass Interactions:**
```css
.glass-interactive {
  transition:
    transform var(--duration-base) var(--ease-smooth),
    background var(--duration-base) var(--ease-standard),
    box-shadow var(--duration-base) var(--ease-standard);
}
```

**Reveal Animations (Staggered):**
```css
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity var(--duration-slow) var(--ease-decelerate),
    transform var(--duration-slow) var(--ease-decelerate);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger child elements */
[data-reveal].is-visible > *:nth-child(1) { transition-delay: 0ms; }
[data-reveal].is-visible > *:nth-child(2) { transition-delay: 80ms; }
[data-reveal].is-visible > *:nth-child(3) { transition-delay: 160ms; }
[data-reveal].is-visible > *:nth-child(4) { transition-delay: 240ms; }
```

---

## 5. Spacing System

### 5.1 Current Implementation

**Inconsistent Spacing:**
- Uses arbitrary values (0.6rem, 0.85rem, 1.4rem, 2.5rem)
- No clear systematic spacing scale
- Makes adjustments difficult and inconsistent

### 5.2 Recommended Spacing System

#### 8pt Grid System
```css
--space-xs: 0.5rem;      /* 8px */
--space-sm: 0.75rem;     /* 12px */
--space-md: 1rem;        /* 16px */
--space-lg: 1.5rem;      /* 24px */
--space-xl: 2rem;        /* 32px */
--space-2xl: 3rem;       /* 48px */
--space-3xl: 4rem;       /* 64px */
--space-4xl: 6rem;       /* 96px */
```

#### Usage Guidelines
```css
/* Card padding */
padding: var(--space-xl);

/* Section vertical spacing */
padding: var(--space-3xl) 0;

/* Element gaps */
gap: var(--space-lg);

/* Tight groupings */
gap: var(--space-sm);
```

---

## 6. Video Integration Guidelines

### 6.1 Current Status
**No video currently integrated** - this is a significant miss for the "liquid glass aesthetic + video" vision.

### 6.2 Recommended Video Strategy

#### Video Placement Opportunities

**1. Hero Background Video**
- Subtle, slow-motion healthcare footage
- Consultation, hands caring, facility shots
- Low opacity (20-30%) with glass overlay
- Enhances pharmaceutical-ad optimism

**2. Service Section Backgrounds**
- Short looping clips specific to each service
- Behind glass overlays for depth
- Maintains readability while adding life

**3. Testimonial Video Cards**
- Optional video testimonials in glass cards
- Auto-play muted with captions
- Human-centered storytelling

#### Video Technical Specifications

**Performance:**
```html
<!-- Optimized video loading -->
<video
  autoplay
  loop
  muted
  playsinline
  preload="metadata"
  poster="fallback-image.jpg"
>
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
</video>
```

**Video Overlay Pattern:**
```css
.video-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25; /* Subtle presence */
}

.video-container::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(11, 30, 51, 0.05) 0%,
    rgba(11, 30, 51, 0.25) 100%
  );
}
```

#### Content Guidelines
- 15-30 second loops
- Slow motion (0.5x-0.75x speed)
- Warm, natural lighting
- Human-centered moments
- Pharmaceutical-ad aesthetic (optimistic, aspirational)
- Professional color grading

---

## 7. Shadow System

### 7.1 Current Implementation
```css
--shadow: 0 24px 60px rgba(13, 27, 42, 0.18);
```

Single shadow value - functional but limited.

### 7.2 Recommended Shadow System

```css
/* Elevation scale */
--shadow-sm: 0 2px 8px rgba(13, 27, 42, 0.08);
--shadow-md: 0 8px 24px rgba(13, 27, 42, 0.12);
--shadow-lg: 0 16px 40px rgba(13, 27, 42, 0.16);
--shadow-xl: 0 24px 60px rgba(13, 27, 42, 0.20);
--shadow-2xl: 0 32px 80px rgba(13, 27, 42, 0.24);

/* Glass shadows (softer) */
--shadow-glass-sm: 0 4px 16px rgba(13, 27, 42, 0.10);
--shadow-glass-md: 0 12px 32px rgba(13, 27, 42, 0.14);
--shadow-glass-lg: 0 20px 50px rgba(13, 27, 42, 0.18);

/* Colored shadows (for accents) */
--shadow-accent: 0 8px 24px rgba(31, 111, 178, 0.20);
--shadow-success: 0 8px 24px rgba(43, 182, 115, 0.20);
```

---

## 8. Brand Voice & Tone Guidelines

### 8.1 Current Voice Assessment

**Strengths:**
- Professional without being sterile
- Clear, benefit-focused copy
- Good use of concrete details (pricing, timing)

**Tone Characteristics:**
- ✅ Professional
- ✅ Accessible
- ✅ Direct
- ⚠️ Optimistic (present but could be stronger)
- ⚠️ Warm (somewhat clinical)
- ⚠️ Human-centered (more focus on system than people)

### 8.2 Recommended Brand Voice

#### Core Voice Attributes

**1. Optimistically Professional**
- Confident about outcomes without overpromising
- "Feel healthier, spend less time navigating paperwork"
- Balance clinical credibility with hopeful future

**2. Warmly Human**
- Use first-person plural ("We believe," "Our members")
- Personal stories and quotes from real practitioners
- Emphasize relationships over transactions

**3. Accessibly Expert**
- Explain complex healthcare concepts simply
- Avoid medical jargon unless necessary
- Use concrete examples over abstractions

**4. Transparently Direct**
- Upfront about pricing, limitations, expectations
- No small print surprises
- Clear calls-to-action

#### Copy Framework

**Headlines:**
- Benefit-forward: "One Membership. Complete Care."
- Emotionally resonant: "Care that feels different"
- Clear and concrete: "Same-day appointments, longer visits"

**Body Copy:**
- Lead with empathy: "Traditional healthcare rushes past the story..."
- Follow with solution: "Onevia gives physicians time to listen..."
- Close with confidence: "Members feel the difference the fastest."

**CTAs:**
- Action-oriented: "Start membership" (not "Sign up")
- Outcome-focused: "Build your plan" (not "Choose options")
- Human: "Meet your care team" (not "View providers")

---

## 9. Component Specifications

### 9.1 Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--accent);
  color: var(--white);
  padding: 0.875rem 1.75rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid transparent;
  box-shadow: var(--shadow-md);
  transition: all var(--duration-fast) var(--ease-bounce);
}

.btn-primary:hover {
  background: var(--accent-warm);
  transform: translateY(-3px);
  box-shadow: var(--shadow-accent);
}
```

#### Secondary Button (Recommended Update)
```css
.btn-secondary {
  background: transparent;
  color: var(--accent);
  padding: 0.875rem 1.75rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid var(--accent);
  transition: all var(--duration-fast) var(--ease-standard);
}

.btn-secondary:hover {
  background: var(--accent);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### 9.2 Cards

#### Standard Card
```css
.card {
  background: var(--white);
  padding: var(--space-xl);
  border-radius: var(--radius);
  border: 1px solid rgba(20, 42, 58, 0.08);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-base) var(--ease-smooth);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

#### Glass Card (for overlays)
```css
.card-glass {
  background: var(--glass-medium);
  backdrop-filter: blur(12px) saturate(135%);
  padding: var(--space-xl);
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: var(--shadow-glass-lg);
}
```

### 9.3 Forms

#### Input Fields
```css
input[type="text"],
input[type="email"],
select,
textarea {
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 2px solid rgba(20, 42, 58, 0.12);
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--white);
  transition: all var(--duration-fast) var(--ease-standard);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(31, 111, 178, 0.10);
}
```

---

## 10. Design Quality Assessment

### 10.1 Strengths

**✅ Professional Foundation**
- Clean, modern design system
- Good typographic hierarchy
- Accessible color contrast

**✅ Glassmorphism Implementation**
- Tasteful and premium
- Not gimmicky or overwhelming
- Creates depth effectively

**✅ Responsive Design**
- Fluid typography with clamp()
- Mobile-first considerations
- Good breakpoint management

**✅ Brand Consistency**
- Unified visual language across pages
- Consistent component patterns
- Cohesive navigation experience

### 10.2 Areas for Improvement

**⚠️ Color Harmony**
- Warm beige conflicts with cool glass aesthetic
- Limited emotional color range (no success green, warm optimism)
- Accent redundancy (accent and accent-2 identical)

**⚠️ Pharmaceutical-Ad Optimism**
- Missing warm, uplifting moments
- Could benefit from more human photography
- Video integration would significantly enhance this

**⚠️ Spacing System**
- Arbitrary spacing values
- Difficult to maintain consistency
- Recommend 8pt grid system

**⚠️ Typography Polish**
- Missing intermediate sizes
- Could benefit from tighter headline tracking
- Need defined weights for each use case

**⚠️ Video Integration**
- Completely absent (major gap for stated vision)
- "Liquid glass + video" requires video presence
- Pharmaceutical ads rely heavily on emotional video

### 10.3 Page-Specific Assessments

#### Homepage (index.html) - 8/10
**Strengths:**
- Strong hero section with clear value prop
- Good use of comparison cards (Traditional vs Onevia)
- Savings table is transparent and compelling

**Improvements:**
- Hero could benefit from subtle background video
- Testimonials lack visual interest (consider glass card format with photos)
- CTA banners feel slightly heavy (dark background)

#### About Page (about.html) - 7.5/10
**Strengths:**
- Excellent use of glass bubbles for specialist profiles
- Personal quotes add humanity
- Good visual hierarchy

**Improvements:**
- All specialists use same placeholder image
- Could benefit from more personality (hobbies section is good start)
- Video introductions would be powerful here

#### Services Page (services.html) - 8/10
**Strengths:**
- Glass overlays on hero images work beautifully
- Savings snapshots are compelling
- Good service-by-service breakdown

**Improvements:**
- All services use same background image (vision.jpg)
- Could show actual service-specific photography
- Pricing could be more visually prominent

#### Membership Flow - 7/10
**Strengths:**
- Clear step-by-step progression
- Live order summary is excellent
- Good use of note boxes for additional info

**Improvements:**
- Could use progress indicator (Step 1 of 5)
- Success states need visual celebration
- Family plan discount could be more prominent

---

## 11. Recommendations by Priority

### 11.1 High Priority (Immediate)

**1. Fix Color Harmony**
- Replace warm beige (#f8f4ee) with cool tone (#f6f9fc)
- Add success green for savings, confirmations
- Add warm optimism accent for CTA moments
- Differentiate accent-2 from primary accent

**2. Implement Systematic Spacing**
- Adopt 8pt grid system
- Replace arbitrary values with scale
- Improves maintainability and consistency

**3. Enhance Typography**
- Add intermediate sizes (h3, h4, body-large)
- Define weight scale for each use case
- Tighten tracking on large headlines

**4. Refine Glassmorphism**
- Standardize blur values (3-tier system)
- Increase border opacity slightly for accessibility
- Add glass color variables to CSS

### 11.2 Medium Priority (Phase 2)

**5. Integrate Video**
- Start with hero background video (subtle, 25% opacity)
- Add service-specific videos behind glass overlays
- Consider video testimonials

**6. Improve Photography**
- Replace placeholder images with real team photos
- Use service-specific imagery (not all vision.jpg)
- Capture warm, human moments

**7. Enhance Micro-interactions**
- Add sophisticated easing curves
- Stagger reveal animations
- Improve button feedback

**8. Strengthen Brand Voice**
- Review copy for pharmaceutical-ad optimism
- Add more personal, human moments
- Emphasize relationships over transactions

### 11.3 Low Priority (Polish)

**9. Component Library**
- Document all components
- Create reusable patterns
- Build style guide page

**10. Performance Optimization**
- Lazy load images
- Optimize video delivery
- Minimize CSS/JS

---

## 12. Pharmaceutical-Ad Aesthetic Guidance

### 12.1 What Makes Pharmaceutical Ads Distinctive?

**Visual Characteristics:**
- Soft, natural lighting (golden hour, diffused)
- Warm color grading (slight amber tint)
- Slow-motion footage (0.5x-0.75x)
- Aspirational but relatable people
- Nature and family moments
- Close-ups of human connection

**Emotional Tone:**
- Hopeful and optimistic
- Gentle, not aggressive
- Focus on outcomes (feeling better, living fully)
- Warm humanity balanced with clinical credibility

### 12.2 How to Apply to Onevia

**Visual Strategy:**
- Add warm amber/gold accent color (#f8a44f)
- Use in subtle moments (success badges, highlights)
- Pair with existing blues for balance

**Photography Direction:**
- Capture real consultation moments (hands, eye contact)
- Natural lighting, slightly warm tone
- Show diverse ages and families
- Focus on human connection, not clinical setting

**Video Approach:**
- Slow-motion B-roll: morning walks, family meals, active moments
- Voiceover or text overlays with optimistic messaging
- Subtle presence (background, low opacity) not dominant
- Always paired with glass overlays for brand consistency

**Copy Tone:**
- "Feel healthier" not just "Get healthcare"
- "Live fully" not just "Manage conditions"
- "Your best self" not just "Treatment"
- Future-focused with present credibility

---

## 13. Technical Implementation Notes

### 13.1 CSS Custom Properties (Recommended Additions)

```css
:root {
  /* Color System (Updated) */
  --ink: #0b1e33;
  --ink-soft: #1c2a44;
  --accent: #1f6fb2;
  --accent-warm: #2b7ed8;
  --accent-success: #2bb673;
  --accent-optimism: #f8a44f;
  --accent-subtle: #7ec1ff;

  --sand: #f6f9fc;
  --mist: #e8f2fb;
  --cloud: #f9fcff;
  --white: #ffffff;

  /* Glass System */
  --glass-base: rgba(255, 255, 255, 0.70);
  --glass-border: rgba(255, 255, 255, 0.65);
  --glass-hover: rgba(255, 255, 255, 0.85);
  --glass-tint: rgba(31, 111, 178, 0.15);

  /* Typography */
  --font-heading: "Fraunces", serif;
  --font-body: "Karla", sans-serif;

  /* Spacing (8pt grid) */
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(13, 27, 42, 0.08);
  --shadow-md: 0 8px 24px rgba(13, 27, 42, 0.12);
  --shadow-lg: 0 16px 40px rgba(13, 27, 42, 0.16);
  --shadow-xl: 0 24px 60px rgba(13, 27, 42, 0.20);
  --shadow-2xl: 0 32px 80px rgba(13, 27, 42, 0.24);

  /* Motion */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;

  --ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);

  /* Other */
  --radius: 26px;
  --container: 1120px;
}
```

### 13.2 Accessibility Considerations

**Color Contrast:**
- All current text passes WCAG AA standards
- Maintain 4.5:1 minimum for body text
- Maintain 3:1 minimum for large text (18pt+)

**Glass Overlays:**
- Ensure text on glass maintains adequate contrast
- Test with background images of varying brightness
- Provide fallback solid backgrounds if needed

**Motion:**
- Respect prefers-reduced-motion (already implemented)
- Provide pause controls for auto-playing video
- Ensure all interactions work without hover (touch)

---

## 14. Final Assessment & Next Steps

### 14.1 Overall Score: 7.5/10

**What's Working:**
- Solid professional foundation
- Tasteful glassmorphism
- Good brand consistency
- Responsive implementation

**What Needs Attention:**
- Color harmony (warm/cool conflict)
- Video integration (missing entirely)
- Pharmaceutical-ad optimism (present but underdeveloped)
- Spacing system (inconsistent)
- Typography polish (needs intermediate sizes)

### 14.2 Path to 9/10 Premium Quality

**Phase 1: Foundation Fixes (2-3 days)**
1. Update color system (remove warm beige, add success/optimism colors)
2. Implement 8pt spacing system
3. Refine typography scale
4. Standardize glass blur system

**Phase 2: Visual Elevation (5-7 days)**
5. Integrate background video in hero
6. Replace placeholder images with real photography
7. Add service-specific imagery
8. Enhance micro-interactions

**Phase 3: Brand Polish (3-5 days)**
9. Strengthen pharmaceutical-ad optimism in copy
10. Add video testimonials
11. Refine brand voice across all pages
12. Test and iterate based on feedback

### 14.3 Key Takeaway

**The design is 80% of the way to premium quality.** The foundation is professional and the glassmorphism is well-executed. The main gaps are:

1. **Color harmony** (quick fix, high impact)
2. **Video integration** (stated vision, completely missing)
3. **Pharmaceutical optimism** (needs warm accents and emotional moments)

With focused attention on these three areas, plus systematic spacing and typography refinement, this becomes a truly premium healthcare brand experience.

---

## 15. Resources & References

### 15.1 Pharmaceutical Ad References
- Look at: Humira, Ozempic, Jardiance campaigns
- Note: Warm color grading, slow-mo, nature, human connection
- Apply: Color accents, video strategy, emotional tone

### 15.2 Healthcare Brand Benchmarks
- **One Medical:** Clean, modern, professional
- **Forward Health:** Tech-forward, glass elements
- **Parsley Health:** Warm, optimistic, human-centered

### 15.3 Design System Tools
- **Figma/Sketch:** For creating component library
- **Storybook:** For documenting components
- **ChromaJS:** For generating accessible color variations

---

**Document End**

*For questions or implementation support, contact the design review team.*
