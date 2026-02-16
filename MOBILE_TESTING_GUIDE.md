# Mobile Testing Quick Reference Guide

## Quick Start Testing Checklist

### 🎯 Priority 1: Core Functionality (Must Test First)

#### Video Background Test
```
iPhone Safari:
1. Open index.html
2. Video should play automatically inline (not fullscreen)
3. If blocked, poster image should display
4. Video should pause when scrolling away

Android Chrome:
1. Same tests as iPhone
2. Check performance on older devices
```

#### Navigation Test
```
1. Tap hamburger menu (☰)
2. Menu slides in from right
3. Tap outside menu → closes
4. Tap any link → closes and navigates
5. Press Escape key → closes
6. "Find Your Clinic" button always visible
```

#### Glass Effects Test
```
1. Check hero card has translucent effect
2. Text should be readable (check contrast)
3. On older devices, should see solid background fallback
4. Scroll smoothly without performance issues
```

---

## 📱 Device-Specific Test Matrix

### iPhone SE (375px width)
Priority Tests:
- [ ] Hero video plays inline
- [ ] Hero title fits on screen (no overflow)
- [ ] All buttons are tappable (44x44px)
- [ ] No horizontal scroll
- [ ] Forms don't trigger zoom
- [ ] Navigation menu works

Expected Behavior:
- Hero title: ~1.75rem
- Single column layouts throughout
- Glass effects with 8px blur
- Touch targets minimum 44px

### iPhone 12 Pro (390px width)
Priority Tests:
- [ ] Video background works
- [ ] Glass effects render properly
- [ ] All sections stack correctly
- [ ] Touch interactions smooth
- [ ] Landscape mode works

### iPad (768px width)
Priority Tests:
- [ ] 2-column layouts appear
- [ ] Touch targets adequate
- [ ] Landscape orientation works
- [ ] Video plays in both orientations

### Android Phone (360px - 412px)
Priority Tests:
- [ ] Chrome compatibility
- [ ] Video playback works
- [ ] Touch events respond
- [ ] No webkit-specific bugs

---

## 🔍 Section-by-Section Testing

### Hero Section ✓
```
Layout:
- [ ] Video plays inline
- [ ] Poster shows if video blocked
- [ ] Glass card visible with text
- [ ] Metrics stack in 1 column
- [ ] Buttons are full width

Text Readability:
- [ ] Title readable (contrast check)
- [ ] Lead text readable
- [ ] Eyebrow label visible

Touch Targets:
- [ ] "Get Started" button tappable
- [ ] "Find Your Clinic" button tappable
```

### Why Onevia Section ✓
```
Layout:
- [ ] Benefits grid stacks (1 column)
- [ ] Cards have adequate padding
- [ ] Glass effects visible
- [ ] No layout shift when loading

Content:
- [ ] All 4 benefit cards visible
- [ ] Icons visible and sized correctly
- [ ] Text remains readable
```

### How It Works Section ✓
```
Layout:
- [ ] 3 step cards stack vertically
- [ ] Step numbers visible
- [ ] Glass effect maintained

Interactions:
- [ ] Cards are tappable
- [ ] Hover effects work on touch
```

### Locations Section ✓
```
Layout:
- [ ] Location cards stack vertically
- [ ] Images load properly
- [ ] Distance badges visible
- [ ] Status tags readable

Touch Targets:
- [ ] "View Details" buttons (44x44px)
- [ ] Card links work properly
```

### Testimonials Section ✓
```
Layout:
- [ ] Testimonials stack (1 column)
- [ ] Photo backgrounds visible
- [ ] Text readable over photos
- [ ] Adequate padding on cards

Glass Effects:
- [ ] Backdrop blur working
- [ ] Fallback solid background if needed
```

### Navigation ✓
```
Hamburger Menu:
- [ ] Tap opens menu (slides in)
- [ ] Tap outside closes
- [ ] Tap link closes and navigates
- [ ] Escape key closes
- [ ] Body scroll disabled when open

CTA Button:
- [ ] Always visible
- [ ] Minimum 44x44px
- [ ] Works while scrolling
```

---

## 🌐 Browser Testing Matrix

### iOS Safari (Priority 1)
Versions to test: 14, 15, 16, 17+
```
Critical:
- [ ] Video playsinline works
- [ ] Backdrop-filter supported (iOS 9+)
- [ ] Touch events work
- [ ] No rubber-band scrolling issues
```

### Chrome Mobile (Priority 1)
Versions to test: 90+
```
Critical:
- [ ] Video autoplay works
- [ ] Touch events respond
- [ ] Glass effects render
```

### Samsung Internet (Priority 2)
```
- [ ] Basic functionality works
- [ ] Fallbacks activate if needed
```

### Firefox Mobile (Priority 2)
```
- [ ] Glass effects work
- [ ] Video playback works
```

---

## 🚀 Performance Testing

### Google PageSpeed Insights
```
URL: https://pagespeed.web.dev/

Target Scores (Mobile):
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

Key Metrics:
- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- TBT (Total Blocking Time): < 200ms
```

### Lighthouse Mobile Test
```
In Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Mobile" device
4. Select "Performance" category
5. Click "Generate report"

Look for:
- Performance score > 90
- Accessibility score > 95
- No major CLS issues
```

### Network Throttling Test
```
In Chrome DevTools:
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Reload page

Check:
- [ ] Poster image loads quickly
- [ ] Video is disabled or loads slowly
- [ ] Text content loads first
- [ ] Page is usable within 3 seconds
```

---

## ♿ Accessibility Testing

### Quick WCAG Checks
```
Contrast:
- [ ] All text meets 4.5:1 contrast (WCAG AA)
- [ ] Glass overlays have sufficient contrast
- [ ] Buttons are visible and readable

Touch Targets:
- [ ] All buttons: minimum 44x44px
- [ ] Links have adequate padding
- [ ] Form inputs are tappable

Keyboard Navigation:
- [ ] Tab through all interactive elements
- [ ] Focus states are visible (3px outline)
- [ ] Menu can be closed with Escape
```

### Screen Reader Test
```
iOS VoiceOver:
1. Settings → Accessibility → VoiceOver → On
2. Swipe through page elements
3. Check all interactive elements are announced
4. Navigation should be logical

Android TalkBack:
1. Settings → Accessibility → TalkBack → On
2. Swipe through page elements
3. Check announcements are clear
```

---

## 📊 Real Device Testing

### Test on Physical Devices

#### iPhone SE (Small screen)
```
Critical Issues to Check:
- Text doesn't overflow
- Images scale correctly
- Touch targets are adequate
- No horizontal scroll

Test Scenarios:
1. Load homepage
2. Navigate through all sections
3. Open mobile menu
4. Fill out a form
5. Test in both orientations
```

#### iPhone 12 Pro (Standard)
```
Test Scenarios:
1. Video autoplay test
2. Glass effects rendering
3. Smooth scrolling performance
4. Touch interactions
5. Landscape mode
```

#### Android Phone (Various)
```
Test on:
- Samsung Galaxy S21
- Google Pixel 6
- OnePlus 9

Check:
- Chrome compatibility
- Video playback
- Touch events
- Performance
```

#### iPad (Tablet)
```
Test Scenarios:
1. 2-column layouts appear
2. Landscape orientation works
3. Touch interactions smooth
4. Split-screen mode (if applicable)
```

---

## 🐛 Common Issues & Solutions

### Video Not Playing on iOS
```
Check:
✓ playsinline attribute present
✓ muted attribute present
✓ webkit-playsinline present
✓ Poster image specified

If still not working:
→ Check iOS version (should be 10+)
→ Check browser (should be Safari)
→ Verify video format (H.264)
```

### Glass Effects Not Working
```
Check:
✓ backdrop-filter support in browser
✓ -webkit-backdrop-filter for Safari
✓ Fallback class added by JS

If not working:
→ Should see solid background instead
→ Check .no-backdrop-filter class
→ Opacity should be 0.92 instead of 0.18
```

### Horizontal Scroll Appearing
```
Debug:
1. Open DevTools
2. Add border to all elements:
   * { outline: 1px solid red; }
3. Find overflowing element
4. Check width values
5. Ensure max-width: 100% on images
```

### Touch Targets Too Small
```
Check:
✓ Minimum 44x44px
✓ Adequate padding
✓ Not nested in other clickable elements

Fix:
.touch-target-enhanced {
  min-width: 44px;
  min-height: 44px;
}
```

### Forms Causing Zoom on iOS
```
Fix:
input, textarea, select {
  font-size: 16px; /* Minimum to prevent zoom */
}
```

---

## 📈 Performance Monitoring

### Core Web Vitals Dashboard
```
Monitor these metrics:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

Tools:
- Google Search Console
- PageSpeed Insights
- Lighthouse CI
```

### Real User Monitoring (RUM)
```
Implement:
- Google Analytics 4
- Monitor mobile vs desktop performance
- Track bounce rate by device
- Monitor conversion rates by device
```

---

## ✅ Final Checklist Before Launch

### Pre-Launch Mobile Audit
```
Critical:
- [ ] Tested on iPhone SE, 12 Pro, and iPad
- [ ] Tested on at least 2 Android devices
- [ ] Video backgrounds work on iOS Safari
- [ ] Navigation menu works smoothly
- [ ] No horizontal scroll on any page
- [ ] All touch targets are 44x44px minimum
- [ ] Forms don't trigger zoom
- [ ] PageSpeed score > 90
- [ ] Accessibility score > 95
- [ ] No console errors on mobile
- [ ] Tested on 3G connection

Nice to Have:
- [ ] Tested on Samsung Internet
- [ ] Tested on Firefox Mobile
- [ ] Tested in landscape mode
- [ ] Tested with screen reader
- [ ] Tested in low power mode
- [ ] Tested offline behavior
```

---

## 🆘 Emergency Fixes

### If Video Is Causing Issues
```css
/* Disable video on all mobile devices */
@media (max-width: 768px) {
  .video-hero-bg,
  .location-hero-video {
    display: none !important;
  }
}
```

### If Glass Effects Cause Performance Issues
```css
/* Disable glass effects on mobile */
@media (max-width: 768px) {
  .glass-hero-card,
  .glass-metric-card,
  .feature-card-glass {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(255, 255, 255, 0.95) !important;
  }
}
```

### If Animations Are Choppy
```css
/* Disable all animations on mobile */
@media (max-width: 768px) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 📞 Testing Contact Info

For issues or questions during testing:
- Check console for JavaScript errors
- Use Chrome DevTools device emulation
- Test on real devices when possible
- Document any issues found

Testing Date: __________
Tested By: __________
Devices Tested: __________
Issues Found: __________
