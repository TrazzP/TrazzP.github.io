# Onevia Homepage - Section Order Reference

## Complete Section Flow

### 1. Hero (Video + Glass)
- **ID**: `#hero`
- **Type**: Video background section
- **Content**: Main value proposition, CTA buttons
- **Video**: `assets/videos/hero-family.mp4`
- **Status**: ✓ Existing design kept

### 2. Why Onevia (NEW - Video + Glass)
- **ID**: `#why`
- **Type**: Video background section
- **Content**: 4 key benefits in 2x2 grid
- **Video**: `assets/videos/why-onevia.mp4`
- **Status**: ✓ NEW section added

### 3. How It Works (Video + Glass)
- **ID**: `#how-it-works`
- **Type**: Video background section
- **Content**: 3-step process cards
- **Video**: `assets/videos/how-it-works.mp4`
- **Status**: ✓ Updated with video background

### 4. Growing With You (Locations)
- **ID**: `#locations`
- **Type**: Standard section with cards
- **Content**: Location cards (Missoula, Bozeman, Billings)
- **Features**: IP detection for distance
- **Status**: ✓ Kept existing design

### 5. Savings Comparison
- **ID**: `#savings`
- **Type**: Standard section with table
- **Content**: Price comparison table
- **CTA**: Updated to "Find Your Clinic"
- **Status**: ✓ Kept existing, updated CTA

### 6. Services Preview (Glass Cards)
- **ID**: `#services-preview`
- **Type**: Standard section with glass cards
- **Content**: 4 service cards (Primary, Pharmacy, Dental, Vision)
- **Status**: ✓ Kept existing design

### 7. Testimonials (Glass Overlays on Photos)
- **ID**: `#testimonials`
- **Type**: Standard section with photo cards
- **Content**: 3 testimonial cards with photo backgrounds
- **Photos**: `testimonial-1.jpg`, `testimonial-2.jpg`, `testimonial-3.jpg`
- **Status**: ✓ Redesigned with photos

### 8. FAQ
- **ID**: `#faq`
- **Type**: Standard section with details/summary
- **Content**: 6 common questions
- **Status**: ✓ Kept existing design

### 9. Final CTA (Find Your Clinic)
- **ID**: `#contact`
- **Type**: Standard section with CTA banner
- **Content**: "Ready to join Onevia?" + CTA button
- **Status**: ✓ Updated copy and CTA

---

## Navigation Menu Order

Header navigation matches chronological flow:
1. Why Onevia → `#why`
2. Services → `services.html`
3. Locations → `locations.html`
4. Patient Stories → `#testimonials`
5. FAQ → `#faq`

CTA Button: "Find Your Clinic" → `locations.html`

---

## Video Background Sections (3 total)

1. **Hero** (#hero) - ✓ Video ready
2. **Why Onevia** (#why) - ⚠️ Video needed: `why-onevia.mp4`
3. **How It Works** (#how-it-works) - ⚠️ Video needed: `how-it-works.mp4`

All use same CSS treatment:
- `.video-hero` class
- `.video-hero-bg` for video element
- `.video-hero-overlay` for dark overlay
- `.video-hero-content` for content container

---

## Glass Card Sections (3 types)

1. **Large Hero Cards** - Hero, Why Onevia
   - Class: `.glass-hero-card` (and `.glass-hero-card-wide`)
   - Background: rgba white with blur

2. **Feature Cards** - How It Works, Why Onevia benefits
   - Class: `.feature-card-glass` or `.glass-benefit-card`
   - Background: rgba white with blur

3. **Service Cards** - Services Preview
   - Class: `.care-card-glass`
   - Background: rgba white with blur

---

## All CTAs Flow to Locations

Every CTA button now directs to `/locations.html`:

1. Hero primary button: "Get Started"
2. Hero secondary button: "Find Your Clinic"
3. Header CTA: "Find Your Clinic"
4. Savings section: "Find Your Clinic"
5. Final CTA: "Find Your Clinic"

**Old CTAs Removed**:
- ❌ "Start Membership" → `membership.html`
- ❌ "Join Now" → `membership.html`
- ❌ "Build my plan" → `membership.html`

**New CTA Pattern**:
- ✓ All point to `locations.html`
- ✓ Consistent messaging: "Find Your Clinic" / "Get Started"
- ✓ Clear user journey: Choose location first

---

## Mobile Breakpoints

CSS adjusts at these breakpoints:

- **Desktop**: 1024px+ (3 columns, full layouts)
- **Tablet**: 768px - 1023px (2 columns, adjusted spacing)
- **Mobile**: < 768px (1 column, stacked layouts)

Key mobile changes:
- Glass benefits grid: 2 columns → 1 column
- Testimonial grid: 3 columns → 1 column
- Feature cards: Auto-fit to single column
- Font sizes reduced 10-20%
- Padding reduced 20-30%
