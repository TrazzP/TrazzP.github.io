# Onevia Homepage Redesign - Implementation Summary

## Overview
The homepage has been redesigned with optimal section order, video backgrounds on key sections, and all CTAs updated to direct users to the locations page.

---

## Section Order (New Structure)

1. **Hero** (Video + Glass) - ✓ Kept existing design
2. **Why Onevia** (NEW - Video + Glass) - ✓ Added immediately after hero
3. **How It Works** (Video + Glass) - ✓ Converted to video background
4. **Growing With You** (Locations) - ✓ Kept with IP detection
5. **Services Preview** (Glass Cards) - ✓ Kept existing
6. **Savings Comparison** - ✓ Kept existing
7. **Testimonials** (Glass Overlays on Photos) - ✓ Redesigned with photo backgrounds
8. **FAQ** - ✓ Kept existing
9. **Final CTA** (Find Your Clinic) - ✓ Updated CTA

---

## New & Updated Sections

### 1. Why Onevia Section (NEW)
**Location**: Immediately after hero section
**File**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/index.html` (lines 92-134)

**Features**:
- Full-screen video background (`assets/videos/why-onevia.mp4`)
- Dark overlay (0.5 opacity)
- Large centered glass card
- 2x2 grid of benefit cards:
  - "Time to listen" - 30-60 min visits
  - "Aligned incentives" - membership model
  - "Transparent pricing" - no surprise bills
  - "Coordinated care" - all services connected

**CSS Classes**:
- `.video-hero` - Video background container
- `.glass-hero-card-wide` - Wider glass card for this section
- `.glass-benefits-grid` - 2x2 grid layout
- `.glass-benefit-card` - Individual benefit cards with hover effects

### 2. How It Works Section (UPDATED)
**Location**: After locations section
**File**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/index.html` (lines 191-230)

**Changes**:
- Converted from static background to full video background
- Added video element (`assets/videos/how-it-works.mp4`)
- Glass cards now overlay video with same styling
- Kept existing 3-step content

**CSS Classes**:
- `.video-hero` - Video background treatment
- `.section-title-glass` - White text for video overlay
- `.feature-grid-glass` - Glass cards with 3 steps

### 3. Testimonials Section (REDESIGNED)
**Location**: After services preview
**File**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/index.html` (lines 330-378)

**Changes**:
- Replaced simple glass cards with photo-background cards
- Each card has:
  - Background photo (`assets/images/testimonial-1.jpg`, `testimonial-2.jpg`, `testimonial-3.jpg`)
  - Dark gradient overlay (0.6 opacity)
  - Glass content overlay with quote
  - Hover effect: lift and shadow increase

**CSS Classes**:
- `.testimonial-photo-grid` - 3-column grid layout
- `.testimonial-photo-card` - Card container
- `.testimonial-photo-bg` - Background image
- `.testimonial-photo-overlay` - Dark gradient overlay
- `.testimonial-glass-content` - Quote and attribution

---

## Header Navigation Updates

**File**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/index.html` (line 38)

**Changes**:
- CTA button changed from "Start Membership" → "Find Your Clinic"
- CTA now links to `/locations.html` instead of `/membership.html`

**Order** (unchanged):
1. Why Onevia
2. Services
3. Locations
4. Patient Stories
5. FAQ

---

## CTA Updates (All Sections)

All CTAs now point to `/locations.html` instead of `/membership.html`:

### Hero Section (lines 68-69)
- Primary: "Get Started" → `/locations.html`
- Secondary: "Find Your Clinic" → `/locations.html`

### Savings Section (lines 281-286)
- Heading: "Ready to see your savings?"
- Copy: "Choose your location to get started."
- Button: "Find Your Clinic" → `/locations.html`

### Final CTA Section (lines 421-428)
- Heading: "Ready to join Onevia?"
- Copy: "Find your clinic and get started today."
- Button: "Find Your Clinic" → `/locations.html`

---

## Footer Updates

**File**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/index.html` (lines 437-440)

**Changes**:
- Removed: "Employer plans: hello@onevia.health"
- Changed to: "Questions? hello@onevia.health"
- Kept: "Email: hello@onevia.health"

---

## CSS Updates

**File**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/css/styles.css` (lines 3574-3762)

### New CSS Classes Added:

1. **Glass Hero Card Wide**
   - `.glass-hero-card-wide` - Max-width 900px, centered

2. **Glass Benefits Grid**
   - `.glass-benefits-grid` - 2x2 grid layout
   - `.glass-benefit-card` - Individual benefit cards with glass effect
   - Hover effects: lift and shadow

3. **Section Title Glass**
   - `.section-title-glass` - White text styling for video overlays

4. **Testimonial Photo Cards**
   - `.testimonial-photo-grid` - 3-column responsive grid
   - `.testimonial-photo-card` - Card with photo background
   - `.testimonial-photo-bg` - Background image container
   - `.testimonial-photo-overlay` - Dark gradient overlay
   - `.testimonial-glass-content` - Quote content overlay
   - Hover effects: translateY(-10px) with shadow

5. **Mobile Responsive**
   - Benefits grid: 2 columns → 1 column
   - Testimonial grid: 3 columns → 1 column
   - Adjusted padding and font sizes

---

## Video Requirements

**Directory**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/assets/videos/`

### Required Videos:

1. **hero-family.mp4** (existing)
   - Content: Family/consultation scene
   - Specs: 1920x1080, H.264, 30fps
   - Currently using poster fallback

2. **why-onevia.mp4** (NEW)
   - Content: Happy patients in conversation with physician
   - Specs: 1920x1080, H.264, 30fps
   - Purpose: Why Onevia section background

3. **how-it-works.mp4** (NEW)
   - Content: Collaborative care scene, physician + patient
   - Specs: 1920x1080, H.264, 30fps
   - Purpose: How It Works section background

**Fallback**: All videos use `assets/images/hero-consult.jpg` as poster image until videos are provided.

**Documentation**: See `/Users/trazz.pepper/Documents/website/TrazzP.github.io/assets/videos/VIDEO-REQUIREMENTS.md`

---

## Image Assets

### Testimonial Images
**Location**: `/Users/trazz.pepper/Documents/website/TrazzP.github.io/assets/images/`

Created placeholder images:
- `testimonial-1.jpg` - Patient consultation scene
- `testimonial-2.jpg` - Team/group scene
- `testimonial-3.jpg` - Healthcare setting scene

**Note**: Replace these with actual patient photos showing:
1. Happy patient in healthcare setting
2. Employer/business context
3. Member with care team

---

## Design Specifications

### Video Background Treatment
- All video sections use `.video-hero` class
- Dark overlay: `rgba(13, 27, 42, 0.5)` via `.video-hero-overlay`
- Videos: autoplay, muted, loop, playsinline
- Fallback: poster image displays if video unavailable

### Glass Card Effects
- Background: `rgba(255, 255, 255, 0.65-0.75)`
- Border: `1px solid rgba(255, 255, 255, 0.8)`
- Backdrop filter: `blur(16px) saturate(130%)`
- Hover: translateY(-8px) with increased shadow

### Color Palette (from existing design)
- Primary: `#1F6FB2` (Onevia Blue)
- Ink: `#0D1B2A` (Dark text)
- White: `#FFFFFF`
- Overlays: Various rgba values for glass effect

---

## Testing Checklist

- [ ] Video backgrounds load and play correctly
- [ ] Glass overlays are readable on video backgrounds
- [ ] All CTAs link to `/locations.html`
- [ ] Testimonial photo backgrounds display correctly
- [ ] Mobile responsive layouts work (tested at 768px and below)
- [ ] Hover effects work on glass cards
- [ ] Navigation links scroll to correct sections
- [ ] Footer links are correct
- [ ] IP detection for location cards works (existing feature)

---

## Files Modified

1. `/Users/trazz.pepper/Documents/website/TrazzP.github.io/index.html`
   - Restructured section order
   - Added Why Onevia section
   - Updated How It Works to video background
   - Redesigned testimonials section
   - Updated all CTAs
   - Updated header navigation
   - Updated footer contact

2. `/Users/trazz.pepper/Documents/website/TrazzP.github.io/css/styles.css`
   - Added `.glass-hero-card-wide`
   - Added `.glass-benefits-grid` and `.glass-benefit-card`
   - Added `.section-title-glass`
   - Added testimonial photo card styles
   - Added mobile responsive breakpoints

## Files Created

1. `/Users/trazz.pepper/Documents/website/TrazzP.github.io/assets/videos/VIDEO-REQUIREMENTS.md`
   - Video specifications and requirements

2. `/Users/trazz.pepper/Documents/website/TrazzP.github.io/assets/images/testimonial-[1-3].jpg`
   - Placeholder testimonial images

3. `/Users/trazz.pepper/Documents/website/TrazzP.github.io/HOMEPAGE-REDESIGN-SUMMARY.md`
   - This document

---

## Next Steps

1. **Add Videos**:
   - Create or source `why-onevia.mp4`
   - Create or source `how-it-works.mp4`
   - Ensure videos meet specs in VIDEO-REQUIREMENTS.md

2. **Replace Testimonial Images**:
   - Replace placeholder images with actual patient photos
   - Ensure photos show happy, diverse patients

3. **Test Across Devices**:
   - Desktop (1920px, 1440px, 1024px)
   - Tablet (768px)
   - Mobile (375px, 414px)

4. **Performance Optimization**:
   - Compress video files (target <10MB each)
   - Optimize testimonial images (WebP format recommended)
   - Test loading times

5. **Content Review**:
   - Review all copy for accuracy
   - Ensure testimonials are compliant
   - Verify all links work

---

## Browser Compatibility

The redesign uses modern CSS features with fallbacks:
- Backdrop filters (glass effect) - Safari 9+, Chrome 76+, Firefox 103+
- Video autoplay - All modern browsers
- CSS Grid - All modern browsers
- CSS variables - All modern browsers

**Fallbacks included**:
- `-webkit-backdrop-filter` for Safari
- Poster images for video elements
- Graceful degradation of glass effects

---

## Performance Notes

- Video backgrounds use lazy loading via native HTML5
- Glass effects use GPU-accelerated CSS properties
- Images are served from local assets (consider CDN)
- CSS is not minified (minify for production)
- No JavaScript changes required for this redesign

---

## Support & Maintenance

For questions or issues:
- Email: hello@onevia.health
- This redesign maintains compatibility with existing JavaScript in `js/scripts.js`
- No breaking changes to existing functionality
