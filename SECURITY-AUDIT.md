# Onevia Website Security Audit Report

**Date:** February 12, 2026
**Auditor:** Security Assessment Team
**Scope:** Onevia Healthcare Website Redesign
**Technology Stack:** Static HTML/CSS/JavaScript, Google Fonts CDN

---

## Executive Summary

This security audit evaluated the Onevia healthcare website redesign for vulnerabilities, compliance considerations, and security hardening opportunities. The website is a static marketing site with client-side membership calculation functionality.

**Overall Risk Assessment:** MEDIUM

**Critical Findings:** 2
**High Priority:** 5
**Medium Priority:** 8
**Low Priority:** 6

The site currently lacks fundamental security headers and has potential XSS vulnerabilities in its JavaScript implementation. While no patient data is collected on this marketing site, the healthcare context demands heightened security standards to maintain patient trust and regulatory compliance.

---

## 1. Code Review Findings

### 1.1 Cross-Site Scripting (XSS) Vulnerabilities

**SEVERITY: HIGH**

#### Finding: Unsafe innerHTML Usage
**Location:** `/Users/trazz.pepper/Documents/website/TrazzP.github.io/js/scripts.js`

The application uses `innerHTML` to dynamically insert content in three locations:

```javascript
// Line 105: Plan features insertion
planFeatures.innerHTML = '';
plan.features.forEach((feature) => {
  const li = document.createElement('li');
  li.textContent = feature;  // SAFE: uses textContent
  planFeatures.appendChild(li);
});

// Line 210: Order items with template literals
li.innerHTML = `<span>${data.plan.label}</span><span>$${formatPrice(data.plan.price)}</span>`;

// Line 219: Addon items with template literals
li.innerHTML = `<span>${addon.label}</span><span>$${formatPrice(addonPrice)}</span>`;
```

**Risk Analysis:**
- Lines 210 and 219 insert user-controlled data (`data.plan.label`, `addon.label`) via innerHTML
- While data currently comes from predefined objects, the structure allows for localStorage manipulation
- An attacker could inject malicious HTML/JavaScript by modifying localStorage values

**Attack Vector:**
```javascript
// Attacker modifies localStorage
localStorage.setItem('oneviaMembership', JSON.stringify({
  plan: {
    key: 'individual',
    label: '<img src=x onerror=alert(document.cookie)>',
    price: 100
  }
}));
```

**Recommendation:**
- Replace `innerHTML` with `textContent` for user-controlled values
- Implement Content Security Policy (CSP) to prevent inline script execution
- Add input validation/sanitization for all localStorage data

### 1.2 Client-Side Data Storage Security

**SEVERITY: MEDIUM**

**Finding:** Sensitive membership data stored in localStorage and cookies without encryption

```javascript
// Line 181-182: Plain text storage
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
setCookie(STORAGE_KEY, JSON.stringify(data));
```

**Risk:**
- Membership selections and pricing visible in browser storage
- No integrity verification (data tampering possible)
- Long cookie expiration (30 days) increases exposure window
- Data persists across sessions without user consent tracking

**Recommendation:**
- Add data integrity checks (HMAC or digital signature)
- Implement short-lived session tokens
- Clear sensitive data after session completion
- Add cookie consent banner before storage operations

### 1.3 Form Validation and Input Handling

**SEVERITY: MEDIUM**

**Finding:** Contact form lacks server-side validation

**Location:** `/Users/trazz.pepper/Documents/website/TrazzP.github.io/membership-details.html`

```html
<input type="text" name="name" placeholder="Your name" required />
<input type="email" name="email" placeholder="you@email.com" required />
<input type="tel" name="phone" placeholder="(555) 555-5555" />
<textarea name="message" rows="4" placeholder="Tell us what matters most to you"></textarea>
```

**Issues:**
- HTML5 validation only (easily bypassed)
- No CSRF protection mechanism
- Form has no action/method defined (incomplete implementation)
- "Proceed to checkout" button does nothing (type="button" with no handler)

**Recommendation:**
- Implement server-side form validation when backend is added
- Add CSRF tokens to all form submissions
- Implement rate limiting on form endpoints
- Add client-side input sanitization
- Define clear form submission workflow

### 1.4 URL Parameter Injection

**SEVERITY: LOW-MEDIUM**

**Finding:** Unvalidated URL parameters used to modify application state

```javascript
// Line 239-244: Direct URL parameter manipulation
const urlParams = new URLSearchParams(window.location.search);
const addParam = urlParams.get('add');
if (addParam && membershipData.addons[addParam]) {
  membershipData.addons[addParam].selected = true;
  saveMembership(membershipData);
}
```

**Risk:**
- URL parameter values directly modify stored data
- No validation of parameter sources
- Potential for social engineering (malicious links)

**Example:** `services.html#dental?add=invalidkey` could cause unexpected behavior

**Recommendation:**
- Whitelist allowed addon values
- Validate parameter values against allowed list
- Add source verification for deep links

### 1.5 Meta Refresh Redirect

**SEVERITY: LOW**

**Finding:** Insecure meta refresh redirect

**Location:** `/Users/trazz.pepper/Documents/website/TrazzP.github.io/signup.html`

```html
<meta http-equiv="refresh" content="0; url=membership.html" />
```

**Issues:**
- Meta refresh can be abused in phishing attacks
- Not recommended for security-sensitive redirects
- Bypasses browser security features

**Recommendation:**
- Use JavaScript redirect or HTTP 301/302 server-side redirect
- Remove signup.html if it serves no purpose beyond redirect

### 1.6 Third-Party Dependencies

**SEVERITY: LOW-MEDIUM**

**Finding:** External Google Fonts loaded via CDN

**Location:** All HTML files

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Karla:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

**Risk:**
- Google Fonts CDN dependency creates external tracking
- GDPR concerns (third-party data processing)
- CDN compromise could inject malicious styles
- Font fingerprinting privacy concern

**Recommendation:**
- Self-host fonts for better privacy and GDPR compliance
- Implement Subresource Integrity (SRI) if using CDN
- Add CSP font-src directive
- Consider font subset optimization

---

## 2. Security Headers Recommendations

**SEVERITY: CRITICAL**

**Current State:** No security headers implemented (static site limitation)

### 2.1 Content Security Policy (CSP)

**Priority: CRITICAL**

**Recommended CSP Header:**
```
Content-Security-Policy:
  default-src 'none';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
```

**Benefits:**
- Prevents XSS attacks
- Blocks unauthorized script execution
- Prevents clickjacking
- Enforces HTTPS

**Implementation Options:**
1. **GitHub Pages:** Add via `_headers` file (if supported) or meta tag
2. **Cloudflare:** Configure via Page Rules
3. **Nginx/Apache:** Add to server configuration
4. **Meta Tag (less secure):** Add to all HTML pages

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com;">
```

### 2.2 X-Frame-Options

**Priority: HIGH**

**Recommended Header:**
```
X-Frame-Options: DENY
```

**Purpose:** Prevents clickjacking attacks by blocking iframe embedding

**Alternative (for future flexibility):**
```
X-Frame-Options: SAMEORIGIN
```

### 2.3 X-Content-Type-Options

**Priority: HIGH**

**Recommended Header:**
```
X-Content-Type-Options: nosniff
```

**Purpose:** Prevents MIME-type sniffing attacks

### 2.4 Referrer-Policy

**Priority: MEDIUM**

**Recommended Header:**
```
Referrer-Policy: strict-origin-when-cross-origin
```

**Purpose:**
- Protects user privacy
- Prevents referrer leakage to third parties
- Maintains analytics functionality

**Healthcare-Specific Consideration:**
For maximum privacy (HIPAA consideration):
```
Referrer-Policy: no-referrer
```

### 2.5 Permissions-Policy

**Priority: MEDIUM**

**Recommended Header:**
```
Permissions-Policy:
  geolocation=(),
  microphone=(),
  camera=(),
  payment=(),
  usb=(),
  magnetometer=(),
  gyroscope=(),
  accelerometer=()
```

**Purpose:** Disables unnecessary browser features

**Future Enhancement (when features needed):**
```
Permissions-Policy: geolocation=(self), payment=(self)
```

### 2.6 Additional Security Headers

**Strict-Transport-Security (HSTS):**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**X-XSS-Protection (Legacy support):**
```
X-XSS-Protection: 1; mode=block
```

---

## 3. HTTPS and TLS Configuration

### 3.1 SSL/TLS Requirements

**SEVERITY: CRITICAL**

**Minimum Requirements:**
- TLS 1.2 minimum (TLS 1.3 recommended)
- Strong cipher suites only
- Perfect Forward Secrecy (PFS) enabled
- Disable SSLv3, TLS 1.0, TLS 1.1

**Recommended Cipher Suite Priority:**
```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
```

### 3.2 Certificate Requirements

**Priority: CRITICAL**

**Requirements:**
- Domain Validation (DV) minimum
- Organization Validation (OV) recommended for healthcare
- Extended Validation (EV) certificate for maximum trust
- Certificate Transparency logging enabled
- Automated renewal process (Let's Encrypt recommended)

**Domain Coverage:**
- onevia.health (primary)
- www.onevia.health
- Wildcard certificate if subdomains planned

**Certificate Validation:**
- Monitor certificate expiration (30-day warning)
- Implement CAA DNS records
- Enable OCSP stapling

### 3.3 HSTS Implementation

**Priority: HIGH**

**Recommended Configuration:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Implementation Steps:**
1. Ensure all HTTP redirects to HTTPS
2. Test with shorter max-age (e.g., 300 seconds)
3. Gradually increase to 31536000 (1 year)
4. Submit to HSTS preload list: hstspreload.org

**Current Status:** Not implemented

### 3.4 Mixed Content Prevention

**Current Status:** COMPLIANT

**Findings:**
- All resources loaded with relative paths
- Google Fonts uses HTTPS
- No hardcoded HTTP resources detected

**Recommendation:**
- Add CSP `upgrade-insecure-requests` directive
- Monitor for mixed content in future updates

---

## 4. Third-Party Dependencies Audit

### 4.1 Google Fonts CDN

**Severity: MEDIUM**

**Current Usage:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Karla:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

**Security Concerns:**
- Third-party request creates privacy exposure
- IP address and user agent shared with Google
- Font fingerprinting potential
- GDPR compliance risk
- Single point of failure

**GDPR Considerations:**
- Google Fonts ruled non-compliant in German court (2022)
- EU users' data transferred to US without consent
- Violates GDPR Article 6 and 44

**Recommendations:**

**Option 1: Self-Host Fonts (RECOMMENDED)**
```bash
# Download fonts using google-webfonts-helper
# Place in /fonts directory
# Update CSS to reference local files
```

Benefits:
- Full GDPR compliance
- Better performance (no external DNS lookup)
- No third-party tracking
- Works offline

**Option 2: Proxy Through Own Domain**
- Cache fonts on own CDN
- Serve from subdomain (fonts.onevia.health)

**Option 3: Keep CDN with Consent**
- Implement cookie consent banner
- Load fonts only after user consent
- Document in privacy policy

### 4.2 JavaScript Libraries

**Current Status:** No external JavaScript libraries detected

**Finding:** Custom vanilla JavaScript implementation

**Security Posture:** POSITIVE
- No jQuery, React, or framework dependencies
- No npm package vulnerabilities
- Reduced attack surface
- Lower maintenance burden

**Recommendation:**
- Maintain this approach (no frameworks needed for this use case)
- Document any future library additions
- Use npm audit if dependencies added

### 4.3 Future Dependency Management

**Recommendations for Backend Integration:**

**When Adding Dependencies:**
1. Use npm audit / Snyk for vulnerability scanning
2. Pin dependency versions (no ^ or ~ in package.json)
3. Implement Dependabot or Renovate for updates
4. Review security advisories regularly
5. Use Subresource Integrity (SRI) for CDN scripts

**Example SRI Implementation:**
```html
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-hash-here"
  crossorigin="anonymous">
</script>
```

### 4.4 Image and Media Assets

**Current Status:** Local image hosting

**Findings:**
- Images stored in `/assets/images/`
- No external image CDN detected
- Favicon served locally

**Security Posture:** POSITIVE

**Recommendations:**
- Implement image optimization (WebP format)
- Add lazy loading for performance
- Consider CDN with proper CSP headers
- Implement image access logging

---

## 5. Privacy and Compliance

### 5.1 HIPAA Compliance Considerations

**Applicability:** Marketing site (non-covered entity for PHI)

**Current Status:** No PHI collected

**Analysis:**
The current website is a marketing/informational site that does not:
- Collect Protected Health Information (PHI)
- Process health records
- Handle insurance claims
- Store medical data

**However, patient inquiries via contact form could contain PHI.**

**Recommendations:**

**Immediate Actions:**
1. **Contact Form Warnings:**
   ```html
   <p class="warning">
     Please do not include sensitive health information in this form.
     For medical questions, contact your provider directly.
   </p>
   ```

2. **Secure Form Processing:**
   - Encrypt form data in transit (HTTPS)
   - Implement TLS 1.2+ for email transmission
   - Use encrypted email or secure portal for responses
   - Document data retention policy

3. **Privacy Policy Requirements:**
   - Disclose data collection practices
   - Explain form data handling
   - Document third-party data sharing (Google Fonts)
   - Provide data deletion requests process

**Future Backend Considerations:**
- Business Associate Agreement (BAA) with hosting provider
- Encrypted data storage at rest
- Audit logging for all data access
- Access controls and authentication
- Backup encryption
- Incident response plan

### 5.2 GDPR Compliance

**Severity: HIGH**

**Current Issues:**

**1. Google Fonts CDN (Non-Compliant)**
- Transfers EU user data to Google (US)
- No user consent obtained
- Violates GDPR Article 44 (International Transfers)

**2. localStorage/Cookies Without Consent**
- Stores data without user permission
- No cookie banner implemented
- Violates ePrivacy Directive

**3. Missing Privacy Documentation**
- No privacy policy linked
- No cookie policy
- No data processing disclosure

**Recommendations:**

**Immediate Actions:**

**1. Implement Cookie Consent Banner:**
```html
<div id="cookie-consent" class="cookie-banner">
  <p>
    We use cookies to save your membership selections.
    We also use Google Fonts, which may collect your IP address.
    <a href="privacy.html">Learn more</a>
  </p>
  <button onclick="acceptCookies()">Accept</button>
  <button onclick="rejectCookies()">Reject</button>
</div>
```

**2. Create Privacy Policy Page** (Required):
- Data controller identity (Onevia legal entity)
- Data collected (name, email, phone, membership preferences)
- Legal basis for processing (consent, legitimate interest)
- Data retention periods
- User rights (access, deletion, portability)
- Contact for data protection officer
- International data transfers disclosure

**3. Self-Host Google Fonts:**
- Eliminates third-party data transfer
- Immediate GDPR compliance improvement

**4. Cookie Classification:**

| Cookie | Type | Purpose | Duration | Consent Required |
|--------|------|---------|----------|------------------|
| oneviaMembershipStep | Functional | Store membership flow position | 30 days | Yes (non-essential) |
| oneviaMembership | Functional | Store membership selections | 30 days | Yes (non-essential) |

**5. User Rights Implementation:**
- Data access request process
- Data deletion capability
- Export membership data feature
- Consent withdrawal mechanism

**6. Privacy-Friendly Alternatives:**

**Current:** Google Fonts
**Alternative:** Self-hosted fonts

**Current:** localStorage without consent
**Alternative:** Session-only storage with consent

### 5.3 State-Specific Healthcare Marketing Compliance

**Montana Healthcare Laws:**

**Telehealth Considerations:**
- Montana expanded telehealth access
- Ensure marketing claims align with service capabilities
- Disclose telehealth vs. in-person visit options

**Direct Primary Care (DPC) Regulations:**
- Montana DPC statute (MCA 33-22-1821)
- Must clarify DPC membership ≠ insurance
- Transparent fee disclosure required

**Current Compliance Status:**
✅ **Compliant:** FAQ clearly states "No. Onevia is a membership-based clinic"
✅ **Compliant:** Pricing prominently displayed
✅ **Compliant:** Services clearly described

**Recommendations:**
- Add disclaimer on membership page
- Link to Montana DPC statute in footer
- Add "This is not insurance" notice near pricing

### 5.4 Americans with Disabilities Act (ADA) Compliance

**WCAG 2.1 Level AA Requirements**

**Positive Findings:**
- Semantic HTML structure
- Alt text on images (hero-consult.jpg)
- ARIA labels on navigation
- Keyboard navigation support
- Color contrast generally good

**Issues Identified:**
- Missing form labels on some inputs
- No skip navigation link
- Focus indicators could be stronger
- Details/summary elements need testing

**Recommendations:**
- Add skip navigation link
- Enhance focus visible styles
- Add ARIA live regions for dynamic content
- Test with screen readers (NVDA, JAWS)
- Conduct full WCAG 2.1 Level AA audit

### 5.5 FTC Healthcare Marketing Compliance

**Truth in Advertising Requirements:**

**Review of Marketing Claims:**

✅ **Acceptable:**
- "Same-day appointments" (service capability)
- "One-hour appointments" (time commitment)
- "At-cost labs and imaging" (pricing model)
- "Transparent pricing" (business practice)

⚠️ **Requires Substantiation:**
- "Members typically receive same- or next-day appointments"
- "Many members cover their membership cost through... savings alone"
- Example pricing: "Actual costs vary by market and supply"

**Recommendations:**
1. Document substantiation for all outcome claims
2. Add disclaimers to testimonials (even if composite)
3. Ensure savings examples are based on real data
4. Update disclaimers: "Example pricing only. Actual costs vary by market."

**Testimonials Analysis:**
Current: "Patient story (composite)", "Employer partner (composite)", "Member story (composite)"

✅ **Compliant:** Clearly marked as composite/illustrative

**Recommendation:** Add disclaimer:
```html
<p class="disclaimer">
  Testimonials are composite illustrations based on typical experiences.
  Individual results may vary. These do not represent specific patient outcomes.
</p>
```

---

## 6. Performance Security

### 6.1 DDoS Mitigation

**Severity: MEDIUM**

**Current Protection:** None (static site on GitHub Pages)

**Risk Assessment:**
- Static site = lower DDoS risk
- No database to overwhelm
- GitHub Pages has some built-in protection
- Future contact form = DDoS target

**Recommendations:**

**Immediate (Low Budget):**
1. **Cloudflare Free Plan:**
   - Point DNS to Cloudflare
   - Enable DDoS protection (automatic)
   - Configure rate limiting rules
   - Enable "Under Attack Mode" when needed
   - Cache static assets

2. **GitHub Pages:**
   - Monitor GitHub status page
   - Have backup hosting ready (Netlify, Vercel)
   - Consider GitHub Pages custom domain

**Future (Backend Integration):**
1. **Rate Limiting:**
   - 10 requests/minute per IP for form submissions
   - 100 requests/minute per IP for page loads
   - Progressive delays for repeat offenders

2. **WAF Rules:**
   - Block known malicious IPs
   - Filter SQL injection patterns
   - Block excessive requests

3. **Infrastructure:**
   - Multi-region deployment
   - CDN with DDoS protection
   - Auto-scaling for traffic spikes

**Configuration Example (Cloudflare):**
```
# Rate limiting rule
Rate: 10 requests per minute
Action: Challenge (CAPTCHA)
Path: /membership-details.html
Method: POST
```

### 6.2 Rate Limiting for Forms

**Severity: HIGH** (When form backend implemented)

**Current Status:** No form backend (non-functional forms)

**Future Requirements:**

**1. Client-Side Protection:**
```javascript
// Implement submission throttling
let lastSubmission = 0;
const SUBMISSION_COOLDOWN = 60000; // 1 minute

function handleFormSubmit(e) {
  const now = Date.now();
  if (now - lastSubmission < SUBMISSION_COOLDOWN) {
    e.preventDefault();
    alert('Please wait before submitting again.');
    return false;
  }
  lastSubmission = now;
  // Process form
}
```

**2. Server-Side Rate Limiting:**
```
Per IP Address:
- 3 form submissions per hour
- 10 form submissions per day
- Exponential backoff on violations

Per Email Address:
- 5 submissions per day
- Flag duplicate submissions

Global:
- 100 form submissions per hour (total)
- Alert on threshold breach
```

**3. CAPTCHA Implementation:**
- Add reCAPTCHA v3 or hCaptcha
- Invisible challenge on form pages
- Required for contact form submission
- Score threshold: 0.5+

**Example Implementation:**
```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<form>
  <!-- form fields -->
  <div class="g-recaptcha" data-sitekey="your-site-key"></div>
  <button type="submit">Submit</button>
</form>
```

**Privacy Consideration:**
- reCAPTCHA = Google tracking
- Alternative: hCaptcha (privacy-focused)
- Or: Custom honeypot fields

**4. Honeypot Fields:**
```html
<!-- Hidden field to catch bots -->
<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off" />
```

Server-side validation:
```javascript
if (formData.website !== '') {
  // Bot detected, reject silently
  return false;
}
```

### 6.3 Bot Protection

**Severity: MEDIUM**

**Current Status:** No bot protection

**Threats:**
- Form spam (when implemented)
- Content scraping
- Price monitoring bots
- Automated membership enumeration

**Recommendations:**

**1. User-Agent Analysis:**
```javascript
// Server-side bot detection
const suspiciousBots = [
  'scrapy', 'curl', 'wget', 'python-requests',
  'selenium', 'phantomjs'
];

function isSuspiciousBot(userAgent) {
  return suspiciousBots.some(bot =>
    userAgent.toLowerCase().includes(bot)
  );
}
```

**2. Behavioral Analysis:**
- Track form fill speed (< 2 seconds = likely bot)
- Monitor mouse movements (no movement = bot)
- Check for keyboard events
- Analyze navigation patterns

**3. Challenge Mechanisms:**
- JavaScript challenge (bots often have JS disabled)
- Canvas fingerprinting
- WebGL detection
- Browser consistency checks

**4. IP Reputation:**
- Block known VPN/proxy/hosting IPs
- Use IP blacklists (AbuseIPDB, Spamhaus)
- GeoIP blocking (if applicable)

**5. Cloudflare Bot Fight Mode:**
```
Enable: "Bot Fight Mode" in Cloudflare dashboard
- Challenges suspected bots
- Blocks verified bad bots
- Free tier available
```

### 6.4 Video Bandwidth Considerations

**Current Status:** No video content detected

**If Video Added (Future):**

**Recommendations:**

**1. Video Hosting:**
- ❌ Avoid: Self-hosting large video files
- ✅ Use: Vimeo Business (HIPAA-compliant option)
- ✅ Use: YouTube (privacy-enhanced mode)
- ✅ Use: Wistia (healthcare-friendly)

**2. Bandwidth Protection:**
- Lazy loading for video embeds
- Poster images instead of autoplay
- Adaptive bitrate streaming
- CDN delivery for video assets

**3. Privacy Considerations:**
```html
<!-- YouTube privacy-enhanced mode -->
<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  frameborder="0"
  allow="accelerometer; encrypted-media; gyroscope"
  allowfullscreen>
</iframe>
```

**4. Vimeo Privacy Settings:**
- Disable video tracking
- Hide from Vimeo.com
- Domain-level privacy (only embed on onevia.health)
- Disable comments/likes

**5. Video CSP Headers:**
```
Content-Security-Policy:
  frame-src 'self' https://player.vimeo.com https://www.youtube-nocookie.com;
  media-src 'self' https://player.vimeo.com;
```

**6. Performance:**
- Maximum 2-3 videos per page
- Thumbnail images < 100KB
- Video length < 2 minutes recommended
- Transcript provided (accessibility + SEO)

---

## 7. Deployment Security

### 7.1 GitHub Pages Security

**Current Hosting:** Assumed GitHub Pages (static site in GitHub repo)

**Security Posture Assessment:**

**Strengths:**
- ✅ Automatic HTTPS (Let's Encrypt)
- ✅ DDoS protection (GitHub infrastructure)
- ✅ No server management required
- ✅ Version control built-in
- ✅ Free SSL certificate

**Limitations:**
- ❌ No custom security headers (without workarounds)
- ❌ No server-side logic (forms, authentication)
- ❌ No WAF configuration
- ❌ Limited access control
- ❌ Public repository exposure risk

**Recommendations:**

**1. Repository Security:**

```bash
# Check current repository visibility
# Ensure .gitignore includes:
.env
.DS_Store
*.log
node_modules/
.vscode/
*.docx  # Remove sensitive Word docs
```

**Current Issue:** Repository contains:
- `DPC Clinic.docx` (potentially sensitive)
- `CV_Resume_Tech.docx` (personal information)
- `DPC_Clinic_temp.txt` (temporary file)

**Action Required:**
```bash
# Remove sensitive files from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch 'DPC Clinic.docx' 'assets/CV_Resume_Tech.docx'" \
  --prune-empty --tag-name-filter cat -- --all

# Add to .gitignore
echo "*.docx" >> .gitignore
echo "*.txt" >> .gitignore
echo "!README.txt" >> .gitignore
```

**2. Branch Protection:**
- Enable branch protection on `main`
- Require pull request reviews
- Require status checks to pass
- Disable force push
- Require signed commits (optional)

**3. GitHub Actions Security:**
```yaml
# .github/workflows/security-check.yml
name: Security Check
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for secrets
        run: |
          # Scan for API keys, passwords, tokens
          grep -r "api_key\|password\|secret" . || true
      - name: Validate HTML
        run: |
          # HTML validation
          npm install -g html-validator-cli
          html-validator --file=*.html
```

**4. Custom Domain Security:**

If using custom domain (onevia.health):

```bash
# Add CNAME file
echo "onevia.health" > CNAME

# Configure DNS:
# A records pointing to GitHub Pages IPs:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

# AAAA records (IPv6):
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**5. Security Headers Workaround:**

GitHub Pages doesn't support custom headers, but you can:

**Option A: Cloudflare Proxy**
- Point domain to Cloudflare
- Cloudflare proxies to GitHub Pages
- Configure security headers in Cloudflare

**Option B: Meta Tags (Limited)**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

**Option C: Migrate to Netlify/Vercel**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; script-src 'self'"
    Strict-Transport-Security = "max-age=31536000"
```

### 7.2 Domain Security

**Severity: HIGH**

**Current Status:** Unknown (domain not inspected)

**Requirements:**

**1. Domain Registrar Security:**
- Enable registrar lock (transfer lock)
- Two-factor authentication on registrar account
- Strong unique password (password manager)
- Domain privacy protection (WHOIS privacy)
- Auto-renewal enabled
- Multiple payment methods backup

**2. DNS Security:**

**DNSSEC:**
```
# Enable DNSSEC at registrar
DS Record: Add to parent zone
RRSIG: Sign DNS records
DNSKEY: Publish public key
```

Benefits:
- Prevents DNS spoofing
- Authenticates DNS responses
- Protects against cache poisoning

**CAA Records:**
```
# Restrict certificate issuance
onevia.health. IN CAA 0 issue "letsencrypt.org"
onevia.health. IN CAA 0 issuewild ";"
onevia.health. IN CAA 0 iodef "mailto:security@onevia.health"
```

**SPF Record:**
```
# Prevent email spoofing
onevia.health. IN TXT "v=spf1 include:_spf.google.com ~all"
```

**DMARC Record:**
```
# Email authentication policy
_dmarc.onevia.health. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@onevia.health"
```

**DKIM:**
- Configure DKIM signing for outbound email
- Publish DKIM public key in DNS

**3. Subdomain Security:**

```
# Prevent subdomain takeover
# If subdomains not used:
*.onevia.health. IN A 127.0.0.1  # Point to localhost

# Or use specific records:
www.onevia.health. IN CNAME onevia.health.
```

**4. Domain Monitoring:**
- Certificate Transparency monitoring (crt.sh)
- DNS change monitoring
- WHOIS change alerts
- Subdomain takeover monitoring

**Services:**
- SecurityTrails (DNS monitoring)
- DNSdumpster (subdomain discovery)
- Cert Spotter (certificate monitoring)

### 7.3 File Permissions and Access Control

**Severity: LOW-MEDIUM**

**Current Status:** Static files (no server-side permissions)

**GitHub Repository Permissions:**

**Current Team Access:**
```
# Review repository settings
Settings > Manage Access

Recommended:
- Owner: 1-2 people
- Maintainer: Core developers only
- Write: Contributors (pull request only)
- Read: Public (if open source) or Private
```

**Recommendations:**

**1. Repository Settings:**
- Private repository (not public)
- Disable forking (if private)
- Disable issues (if not needed)
- Enable vulnerability alerts
- Enable Dependabot security updates

**2. Deploy Keys:**
```bash
# Read-only deploy key for CI/CD
ssh-keygen -t ed25519 -C "deploy@onevia.health"
# Add public key to GitHub: Settings > Deploy keys
# Uncheck "Allow write access"
```

**3. Personal Access Tokens:**
- Use fine-grained tokens (not classic)
- Limit scope to specific repositories
- Set expiration dates (90 days max)
- Rotate regularly
- Store in password manager

**4. File System Permissions (Future Backend):**

```bash
# Web root permissions
sudo chown -R www-data:www-data /var/www/onevia.health
sudo find /var/www/onevia.health -type d -exec chmod 755 {} \;
sudo find /var/www/onevia.health -type f -exec chmod 644 {} \;

# Config files
sudo chmod 600 /var/www/onevia.health/.env
sudo chown root:root /var/www/onevia.health/.env

# Disable directory listing
# Apache: Options -Indexes
# Nginx: autoindex off;
```

**5. Secrets Management:**

Current: No secrets detected ✅

Future:
- Use GitHub Secrets for CI/CD
- Never commit API keys
- Use environment variables
- Implement secrets rotation policy

---

## 8. Monitoring and Maintenance

### 8.1 Security Monitoring Tools

**Severity: HIGH**

**Current Status:** No monitoring detected

**Recommended Tools:**

**1. Uptime Monitoring:**

**Free Options:**
- **UptimeRobot** (50 monitors free)
  - Check: https://onevia.health every 5 minutes
  - Alert: Email/SMS on downtime
  - SSL certificate expiry alerts

- **StatusCake** (Free plan available)
  - Uptime monitoring
  - Page speed monitoring
  - SSL monitoring

**Configuration:**
```
Monitor Type: HTTPS
URL: https://onevia.health
Check Interval: 5 minutes
Timeout: 30 seconds
Alert After: 2 failures
Alert Contact: ops@onevia.health
```

**2. SSL/TLS Monitoring:**

- **SSL Labs (Qualys)**: Manual scanning
  - URL: https://www.ssllabs.com/ssltest/
  - Target Grade: A or A+
  - Scan monthly

- **Certificate Transparency Monitoring:**
  - crt.sh (free)
  - Facebook Certificate Transparency Monitor
  - Alert on unexpected certificates

**3. Website Security Scanners:**

**Free Scanners:**
- **Mozilla Observatory**: https://observatory.mozilla.org/
  - Checks security headers
  - Scans for common issues
  - Provides actionable recommendations

- **Security Headers**: https://securityheaders.com/
  - Analyzes HTTP security headers
  - Grades A+ to F
  - Target: A+ rating

- **Hardenize**: https://www.hardenize.com/
  - Comprehensive security assessment
  - SSL/TLS, DNS, headers analysis

**4. Vulnerability Scanning:**

**For Static Site:**
- **GitHub Dependabot**: Built-in (enable in repository settings)
- **Snyk**: Free for open-source projects
- **npm audit**: If Node.js dependencies added

**For Future Backend:**
- **OWASP ZAP** (Zed Attack Proxy)
- **Burp Suite Community** (manual testing)
- **Nikto** (web server scanner)

**5. Log Monitoring:**

**GitHub Pages Limitations:**
- No access to raw logs
- Use analytics for indirect monitoring

**Future Backend:**
- **Centralized Logging**: ELK Stack, Splunk, Datadog
- **SIEM**: Security Information and Event Management

**Log Events to Monitor:**
- Authentication failures
- Form submission patterns
- Unusual traffic spikes
- Error rates (404, 500)
- Slow response times

**6. Analytics and Privacy-Friendly Tracking:**

**Privacy-Friendly Options:**
- **Plausible Analytics**: GDPR-compliant, no cookies
- **Fathom Analytics**: Privacy-first, GDPR-compliant
- **Matomo**: Self-hosted, full data control

**Avoid:**
- Google Analytics (GDPR issues, requires consent)

**Implementation Example (Plausible):**
```html
<script defer data-domain="onevia.health" src="https://plausible.io/js/script.js"></script>
```

Benefits:
- No cookies (no consent banner needed)
- GDPR/CCPA compliant
- Lightweight (< 1KB)
- No personal data collection

**7. File Integrity Monitoring:**

**Tools:**
- **Git-based**: Monitor unexpected file changes
- **AIDE** (Advanced Intrusion Detection Environment)
- **Tripwire**: File and directory integrity monitoring

**GitHub Approach:**
```bash
# Set up branch protection
# Enable commit signing
# Monitor for unauthorized commits

# GitHub Actions workflow:
name: File Integrity Check
on: [push]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for unauthorized changes
        run: |
          # Verify no sensitive files added
          if git diff --name-only HEAD~1 | grep -E '\\.env|\\.key|password'; then
            echo "Sensitive file detected!"
            exit 1
          fi
```

### 8.2 Update Procedures

**Severity: MEDIUM**

**Current Status:** No formal update process documented

**Recommended Update Policy:**

**1. Content Updates:**

**Process:**
```
1. Create feature branch: git checkout -b update/[description]
2. Make changes and test locally
3. Commit changes: git commit -m "Update: [description]"
4. Create pull request
5. Review changes (security check)
6. Merge to main
7. Verify deployment
```

**Security Checks Before Merge:**
- No sensitive data added
- HTML/CSS/JS validated
- No broken links
- Security headers intact
- HTTPS enforced

**2. Dependency Updates:**

**Currently: No dependencies** ✅

**Future (If Dependencies Added):**
```bash
# Weekly dependency check
npm outdated

# Security audit
npm audit

# Update dependencies
npm update

# Major version updates (manual review)
npm install package@latest
```

**Automated Updates:**
- Enable GitHub Dependabot
- Configure auto-merge for minor/patch updates
- Manual review for major updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
```

**3. Security Patch Procedure:**

**Emergency Patch Process:**
```
Priority: CRITICAL
Timeline: Within 24 hours

1. Assess vulnerability severity
2. Identify affected systems
3. Develop and test patch
4. Deploy to staging
5. Deploy to production
6. Verify fix
7. Document incident
8. Post-mortem review
```

**Non-Emergency Updates:**
```
Priority: HIGH/MEDIUM/LOW
Timeline: Within 7 days / 30 days / 90 days

1. Schedule maintenance window
2. Notify stakeholders
3. Deploy updates
4. Monitor for issues
5. Document changes
```

**4. Browser Security Testing:**

**Cross-Browser Testing:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Security Features Testing:**
- CSP implementation
- Cookie behavior
- localStorage isolation
- HTTPS enforcement
- Mixed content blocking

**Tools:**
- BrowserStack (paid)
- LambdaTest (paid)
- Manual testing on multiple devices

**5. Backup and Recovery:**

**Git-Based Backups:**
```bash
# Automatic via GitHub
# Additional backup: GitLab mirror

# Create backup repository
git remote add backup git@gitlab.com:onevia/website-backup.git
git push backup --mirror

# Scheduled backup (cron job)
0 2 * * * cd /path/to/repo && git push backup --mirror
```

**Static Site Backup:**
```bash
# Weekly full site backup
tar -czf onevia-backup-$(date +%Y%m%d).tar.gz /var/www/onevia.health/

# Retain 4 weekly backups
find /backups -name "onevia-backup-*.tar.gz" -mtime +28 -delete
```

**Database Backup (Future):**
```bash
# Daily encrypted backups
pg_dump onevia_db | gpg --encrypt --recipient backup@onevia.health > backup.sql.gpg

# Test restore monthly
```

**6. Change Management:**

**Documentation Requirements:**
- Change description
- Security impact assessment
- Rollback plan
- Testing results
- Deployment checklist

**Approval Process:**
- Security review (if security-related)
- Technical review (code quality)
- Business approval (major changes)

### 8.3 Incident Response Plan Outline

**Severity: HIGH**

**Purpose:** Prepare for security incidents

**Incident Types:**
- Data breach
- Website defacement
- DDoS attack
- Malware injection
- Unauthorized access
- Social engineering
- DNS hijacking

**Incident Response Team:**

```
Role Assignments:
- Incident Commander: [Name/Role]
- Technical Lead: [Name/Role]
- Communications Lead: [Name/Role]
- Legal/Compliance: [Name/Role]
- Business Owner: [Name/Role]
```

**Incident Response Phases:**

**1. PREPARATION**

**Before Incident:**
- Document this plan
- Train team members
- Establish communication channels
- Prepare forensics tools
- Define severity levels
- Create contact lists

**Tools Ready:**
- Backup/restore procedures
- Access to DNS management
- Access to hosting account
- GitHub admin access
- SSL certificate management
- Communication templates

**Contacts:**
```
Internal:
- Security Team: security@onevia.health
- On-Call: [Phone number]
- Leadership: [Contact info]

External:
- Hosting Provider: GitHub Support
- Domain Registrar: [Contact]
- CDN Provider: Cloudflare Support
- Cyber Insurance: [Contact if applicable]
- Legal Counsel: [Contact]
- PR/Communications: [Contact]
```

**2. DETECTION & ANALYSIS**

**Detection Methods:**
- Uptime monitoring alerts
- SSL expiry notifications
- User reports
- Security scanner findings
- Git commit anomalies
- Traffic pattern changes

**Initial Assessment (Within 30 minutes):**
```
Questions to Answer:
□ What happened?
□ When was it detected?
□ What systems are affected?
□ Is it ongoing?
□ What data is at risk?
□ Who needs to be notified?
```

**Severity Classification:**

**CRITICAL (P1):**
- Active data breach
- Website completely down
- Ransomware/malware
- DNS hijacking
- Response time: Immediate

**HIGH (P2):**
- Security vulnerability exploited
- Partial site compromise
- DDoS attack in progress
- Response time: Within 1 hour

**MEDIUM (P3):**
- Security misconfiguration discovered
- Non-critical vulnerability
- Suspicious activity detected
- Response time: Within 4 hours

**LOW (P4):**
- Minor security issue
- No active exploitation
- Response time: Within 24 hours

**3. CONTAINMENT**

**Immediate Actions (P1/P2):**
```
1. Activate incident response team
2. Document everything (timestamps, actions)
3. Preserve evidence (logs, screenshots)
4. Isolate affected systems
5. Change compromised credentials
6. Enable Cloudflare "Under Attack Mode"
7. Notify leadership
```

**Short-Term Containment:**
- Block malicious IPs
- Disable compromised accounts
- Revert to last known good state
- Enable additional logging
- Increase monitoring

**Long-Term Containment:**
- Apply security patches
- Rebuild compromised systems
- Implement additional controls
- Update firewall rules

**4. ERADICATION**

**Remove Threat:**
```
□ Identify root cause
□ Remove malware/backdoors
□ Close vulnerability
□ Patch affected systems
□ Update security configurations
□ Verify threat eliminated
```

**For Website Defacement:**
```bash
# Restore from last known good commit
git log  # Identify good commit
git reset --hard <commit-hash>
git push --force origin main

# Verify restoration
curl -I https://onevia.health
# Check site visually
```

**For Compromised Credentials:**
```
1. Rotate all passwords
2. Revoke access tokens
3. Generate new API keys
4. Update deploy keys
5. Enable 2FA everywhere
6. Review access logs
```

**5. RECOVERY**

**Restore Normal Operations:**
```
□ Verify systems clean
□ Restore from backups if needed
□ Test all functionality
□ Monitor for recurrence
□ Update security controls
□ Resume normal operations
□ Continue enhanced monitoring (72 hours)
```

**Validation:**
- Security scan (OWASP ZAP, SSL Labs)
- Code review
- Penetration testing (if applicable)
- User acceptance testing

**6. POST-INCIDENT ACTIVITY**

**Post-Mortem (Within 7 days):**
```
Documentation:
□ Incident timeline
□ Root cause analysis
□ Response effectiveness
□ Lessons learned
□ Action items
□ Prevention measures

Review Questions:
- What happened and why?
- What was done right?
- What could be improved?
- How do we prevent recurrence?
- Do we need additional tools/training?
```

**Follow-Up Actions:**
- Update incident response plan
- Implement preventive measures
- Conduct team training
- Update security policies
- Test incident response procedures

**Reporting:**

**Internal Report:**
- Executive summary
- Technical details
- Financial impact
- Reputation impact
- Recommendations

**External Notifications (If Required):**

**Breach Notification Laws:**
```
Timeline: Varies by state (30-90 days)

Montana:
- No specific timeline
- Notify without unreasonable delay

HIPAA:
- 60 days for breaches affecting 500+ individuals
- Annual notification for smaller breaches

GDPR:
- 72 hours to supervisory authority
- Immediate notification to affected individuals if high risk
```

**Who to Notify:**
- Affected individuals (email, letter)
- State Attorney General (if required)
- Consumer reporting agencies (large breaches)
- Media (if required by law)
- HHS Office for Civil Rights (if HIPAA-covered)
- Cyber insurance provider

**Communication Templates:**

**Template: User Notification**
```
Subject: Important Security Notice

Dear Onevia Member,

We are writing to inform you of a security incident that may
have affected your information. On [DATE], we discovered
[DESCRIPTION OF INCIDENT].

What Information Was Involved:
[List data types]

What We Are Doing:
[Steps taken to address incident]

What You Can Do:
[Recommended actions for users]

For questions, contact: security@onevia.health

Sincerely,
Onevia Security Team
```

**7. TESTING & DRILLS**

**Incident Response Drills:**
- Quarterly tabletop exercises
- Annual full simulation
- Test communication procedures
- Review and update plan
- Train new team members

**Drill Scenarios:**
- Website defacement
- DDoS attack simulation
- Ransomware response
- Data breach discovery
- Insider threat scenario

---

## 9. Prioritized Action Plan

### CRITICAL PRIORITY (Implement Immediately - Within 7 Days)

**Risk Level:** Could result in immediate exploitation or data breach

| # | Action | Severity | Effort | File/Location | Rationale |
|---|--------|----------|--------|---------------|-----------|
| 1 | **Remove sensitive files from repository** | CRITICAL | Low | `DPC Clinic.docx`, `CV_Resume_Tech.docx`, `DPC_Clinic_temp.txt` | Exposed personal and potentially sensitive business information |
| 2 | **Implement Content Security Policy** | CRITICAL | Medium | All HTML files or server config | Prevents XSS attacks and establishes baseline security |

**Action Items:**

```bash
# CRITICAL-1: Remove sensitive files
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch 'DPC Clinic.docx' 'assets/CV_Resume_Tech.docx' 'DPC_Clinic_temp.txt'" \
  --prune-empty --tag-name-filter cat -- --all

# Update .gitignore
echo "*.docx\n*.txt\n!README.txt" >> .gitignore

# Force push (after team notification)
git push origin --force --all
```

```html
<!-- CRITICAL-2: Add to all HTML <head> sections -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self';">
```

---

### HIGH PRIORITY (Implement Within 30 Days)

**Risk Level:** Significant vulnerability exposure or compliance violation

| # | Action | Severity | Effort | File/Location | Rationale |
|---|--------|----------|--------|---------------|-----------|
| 3 | **Fix XSS vulnerability in innerHTML usage** | HIGH | Medium | `js/scripts.js` lines 210, 219 | Direct HTML injection of potentially untrusted data |
| 4 | **Self-host Google Fonts** | HIGH | Medium | All HTML files, `fonts/` directory | GDPR compliance, privacy protection |
| 5 | **Implement cookie consent banner** | HIGH | Medium | New component, all pages | GDPR/ePrivacy compliance requirement |
| 6 | **Add security headers via Cloudflare** | HIGH | Low | Cloudflare dashboard | X-Frame-Options, HSTS, X-Content-Type-Options |
| 7 | **Create Privacy Policy page** | HIGH | High | New `privacy.html` file | Legal requirement for GDPR/CCPA compliance |

**Action Items:**

**HIGH-3: Fix XSS Vulnerability**
```javascript
// Replace innerHTML with safe DOM manipulation
// js/scripts.js lines 210, 219

// BEFORE (Unsafe):
li.innerHTML = `<span>${data.plan.label}</span><span>$${formatPrice(data.plan.price)}</span>`;

// AFTER (Safe):
const span1 = document.createElement('span');
span1.textContent = data.plan.label;
const span2 = document.createElement('span');
span2.textContent = `$${formatPrice(data.plan.price)}`;
li.appendChild(span1);
li.appendChild(span2);
```

**HIGH-4: Self-Host Fonts**
```bash
# Download fonts from Google Fonts
# Use google-webfonts-helper: https://gwfh.mranftl.com/fonts

# Place fonts in /fonts/
# Update CSS to reference local files

# Remove from HTML:
<link href="https://fonts.googleapis.com/css2?..." />

# Add to CSS:
@font-face {
  font-family: 'Karla';
  src: url('/fonts/karla-v23-latin-regular.woff2') format('woff2');
}
```

**HIGH-5: Cookie Consent Banner**
```html
<!-- Add to all pages before closing </body> -->
<div id="cookie-consent" class="cookie-banner" style="display:none;">
  <div class="cookie-content">
    <p>We use cookies to save your membership selections.
       <a href="/privacy.html">Learn more</a></p>
    <button onclick="acceptCookies()">Accept</button>
    <button onclick="rejectCookies()">Decline</button>
  </div>
</div>

<script>
function showConsentBanner() {
  if (!localStorage.getItem('cookieConsent')) {
    document.getElementById('cookie-consent').style.display = 'block';
  }
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  document.getElementById('cookie-consent').style.display = 'none';
}

function rejectCookies() {
  localStorage.setItem('cookieConsent', 'rejected');
  // Clear all cookies and localStorage
  document.cookie.split(";").forEach(c => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  localStorage.clear();
  document.getElementById('cookie-consent').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', showConsentBanner);
</script>
```

---

### MEDIUM PRIORITY (Implement Within 90 Days)

**Risk Level:** Improves security posture, reduces risk exposure

| # | Action | Severity | Effort | File/Location | Rationale |
|---|--------|----------|--------|---------------|-----------|
| 8 | **Add input validation to localStorage** | MEDIUM | Medium | `js/scripts.js` | Prevent data tampering and injection |
| 9 | **Configure DNS security (DNSSEC, CAA)** | MEDIUM | Low | Domain registrar/DNS provider | Prevent DNS hijacking and unauthorized certificates |
| 10 | **Set up uptime monitoring** | MEDIUM | Low | UptimeRobot or similar | Early detection of outages or attacks |
| 11 | **Enable SSL monitoring** | MEDIUM | Low | SSL Labs, Certificate Transparency | Ensure SSL certificate validity |
| 12 | **Add HIPAA-compliant form disclaimer** | MEDIUM | Low | `membership-details.html` | Prevent PHI collection on marketing site |
| 13 | **Implement GitHub branch protection** | MEDIUM | Low | GitHub repository settings | Prevent unauthorized code changes |
| 14 | **Add Subresource Integrity (SRI)** | MEDIUM | Low | Future external scripts | Prevent CDN compromise attacks |
| 15 | **Create incident response plan** | MEDIUM | High | Documentation | Prepare for security incidents |

**Action Items:**

**MEDIUM-8: Input Validation**
```javascript
// Add to js/scripts.js - loadMembership function

const validateMembershipData = (data) => {
  // Whitelist valid plan keys
  const validPlans = ['individual', 'family'];
  const validAddons = ['rx', 'dental', 'vision'];

  if (!data || typeof data !== 'object') {
    return { ...defaultMembership };
  }

  // Validate plan
  if (data.plan && !validPlans.includes(data.plan.key)) {
    data.plan = { ...defaultMembership.plan };
  }

  // Validate plan label (prevent HTML injection)
  if (data.plan && typeof data.plan.label !== 'string') {
    data.plan.label = defaultMembership.plan.label;
  }

  // Sanitize label (remove HTML tags)
  if (data.plan && data.plan.label) {
    data.plan.label = data.plan.label.replace(/<[^>]*>/g, '');
  }

  // Validate price is number
  if (data.plan && typeof data.plan.price !== 'number') {
    data.plan.price = defaultMembership.plan.price;
  }

  // Validate addons
  if (data.addons) {
    Object.keys(data.addons).forEach(key => {
      if (!validAddons.includes(key)) {
        delete data.addons[key];
      }
    });
  }

  return data;
};

// Use in loadMembership:
const stored = storedRaw ? JSON.parse(storedRaw) : null;
if (!stored) return { ...defaultMembership };
return validateMembershipData(stored);
```

**MEDIUM-12: Form Disclaimer**
```html
<!-- Add to membership-details.html before form -->
<div class="notice notice-warning">
  <strong>Privacy Notice:</strong> Please do not include sensitive health
  information in this form. For medical questions or concerns, contact your
  provider directly at hello@onevia.health or call 406-123-1234.
</div>
```

---

### LOW PRIORITY (Implement Within 6 Months)

**Risk Level:** Enhances overall security, defense in depth

| # | Action | Severity | Effort | File/Location | Rationale |
|---|--------|----------|--------|---------------|-----------|
| 16 | **Implement bot protection** | LOW | Medium | Form pages | Prevent automated abuse |
| 17 | **Add rate limiting (future backend)** | LOW | Medium | Server configuration | Prevent brute force and abuse |
| 18 | **Conduct WCAG 2.1 accessibility audit** | LOW | Medium | All pages | ADA compliance, improve usability |
| 19 | **Implement privacy-friendly analytics** | LOW | Low | Plausible or Fathom | Monitor traffic without privacy concerns |
| 20 | **Create security.txt file** | LOW | Low | `/.well-known/security.txt` | Responsible disclosure channel |
| 21 | **Add FTC disclaimer to testimonials** | LOW | Low | `index.html` testimonials section | Marketing compliance |

**Action Items:**

**LOW-20: security.txt**
```txt
# /.well-known/security.txt
Contact: mailto:security@onevia.health
Expires: 2027-02-12T00:00:00.000Z
Preferred-Languages: en
Canonical: https://onevia.health/.well-known/security.txt
Policy: https://onevia.health/security-policy.html
Acknowledgments: https://onevia.health/security-acknowledgments.html
```

**LOW-21: FTC Disclaimer**
```html
<!-- Add after testimonial grid in index.html -->
<p class="disclaimer muted" style="font-size: 0.875rem; margin-top: 1rem;">
  Testimonials are composite illustrations based on typical member experiences.
  Individual results may vary. These do not represent specific patient outcomes
  or guarantee future results.
</p>
```

---

## 10. Security Testing Checklist

### Pre-Deployment Security Verification

**Before Going Live:**

```
□ All CRITICAL items addressed
□ All HIGH priority items addressed
□ Security headers implemented
□ HTTPS enforced
□ Google Fonts removed or consent implemented
□ Privacy policy published
□ XSS vulnerabilities fixed
□ Sensitive files removed from repository
□ Cookie consent banner functional
□ Forms include HIPAA disclaimer
□ DNS security configured (DNSSEC, CAA)
□ SSL certificate valid and monitored
□ Uptime monitoring configured
□ Incident response plan documented
□ Team trained on security procedures
□ Contact information up to date
```

### Security Testing Tools

**Run These Scans:**

1. **Mozilla Observatory**
   URL: https://observatory.mozilla.org/
   Target Score: A (80+)

2. **Security Headers**
   URL: https://securityheaders.com/
   Target Score: A+ (if possible with GitHub Pages limitations)

3. **SSL Labs**
   URL: https://www.ssllabs.com/ssltest/
   Target Score: A or A+

4. **OWASP ZAP**
   Run automated scan
   Review all alerts

5. **HTML Validator**
   URL: https://validator.w3.org/
   Fix all errors

6. **Lighthouse (Chrome DevTools)**
   Check Security audit
   Target Score: 100

7. **Manual Testing**
   - XSS injection attempts
   - CSRF testing
   - Cookie manipulation
   - localStorage tampering
   - Form validation bypass
   - URL parameter injection

---

## 11. Ongoing Security Maintenance

### Monthly Tasks

```
□ Review security scanner results (Mozilla Observatory, SSL Labs)
□ Check for GitHub Dependabot alerts
□ Review uptime monitoring logs
□ Verify SSL certificate validity (60+ days remaining)
□ Check for security advisories (NIST, CISA)
□ Review access logs for anomalies
□ Test backup restoration
□ Update security documentation
```

### Quarterly Tasks

```
□ Full security audit (run all testing tools)
□ Review and update incident response plan
□ Conduct incident response tabletop exercise
□ Review user access permissions
□ Audit third-party services
□ Update security training materials
□ Review privacy policy for accuracy
□ Penetration testing (if budget allows)
```

### Annual Tasks

```
□ Comprehensive security assessment
□ Penetration testing by third party
□ Full incident response drill
□ Security policy review and update
□ Compliance audit (HIPAA, GDPR)
□ Insurance review (cyber insurance)
□ Vendor security assessment
□ Team security training renewal
```

---

## 12. Budget Considerations

### Security Costs (Annual Estimates)

| Item | Free Option | Paid Option | Recommended |
|------|-------------|-------------|-------------|
| **SSL Certificate** | Let's Encrypt (Free) | OV/EV Cert ($100-$500) | Let's Encrypt for now |
| **DNS Security** | Cloudflare Free | Cloudflare Pro ($20/mo) | Cloudflare Free |
| **Uptime Monitoring** | UptimeRobot Free | StatusCake ($15/mo) | UptimeRobot Free |
| **Web Firewall (WAF)** | Cloudflare Free | Cloudflare Pro ($20/mo) | Cloudflare Free |
| **Analytics** | Plausible ($9/mo) | Fathom ($14/mo) | Plausible |
| **Penetration Testing** | N/A | $2,000-$10,000 | Annually |
| **Security Scanning** | Free tools | Burp Suite Pro ($449/yr) | Free tools initially |
| **Incident Response** | DIY | Retainer ($1,000+/mo) | DIY + consulting |
| **Cyber Insurance** | N/A | $1,000-$5,000/yr | Recommended after launch |
| **Compliance Audit** | Self-assessment | $5,000-$15,000 | As needed |

**Total First Year (Minimal Budget):** $0-$200
**Total First Year (Recommended):** $3,000-$8,000
**Total First Year (Comprehensive):** $10,000-$25,000

---

## 13. Compliance Summary

### Current Compliance Status

| Regulation | Status | Priority to Fix |
|------------|--------|-----------------|
| **GDPR** | ❌ Non-Compliant | HIGH |
| **HIPAA** | ⚠️ Partial (Marketing site) | MEDIUM |
| **ADA/WCAG 2.1** | ⚠️ Partial | MEDIUM |
| **FTC (Healthcare Marketing)** | ✅ Generally Compliant | LOW |
| **Montana DPC Statute** | ✅ Compliant | N/A |
| **CCPA** | ⚠️ Limited applicability | MEDIUM |
| **PCI DSS** | N/A (No payment processing) | N/A |

**Key Compliance Gaps:**
1. Google Fonts creates GDPR violation
2. No privacy policy published
3. No cookie consent mechanism
4. Form lacks HIPAA safeguards
5. Accessibility improvements needed

---

## 14. Conclusion and Next Steps

### Executive Summary

The Onevia website redesign presents a **MEDIUM overall security risk**. The site is a well-structured static website with minimal attack surface, but lacks fundamental security controls expected of a healthcare organization.

**Strengths:**
- No external JavaScript dependencies (reduced risk)
- No backend (limited attack surface)
- Clean HTML structure
- No exposed PHI or sensitive data collection

**Weaknesses:**
- Missing security headers (CSP, HSTS, X-Frame-Options)
- GDPR non-compliance (Google Fonts, cookie consent)
- XSS vulnerability in JavaScript
- Sensitive files in Git repository
- No incident response plan
- No monitoring or alerting

**Business Impact:**
- **Reputation Risk:** Healthcare site must maintain higher security standards
- **Legal Risk:** GDPR violations carry fines up to €20M or 4% of revenue
- **Patient Trust:** Security issues could undermine credibility
- **Operational Risk:** No incident response capability

### Immediate Actions (This Week)

1. ✅ **Remove sensitive files from Git** (30 minutes)
2. ✅ **Add Content Security Policy meta tag** (1 hour)
3. ✅ **Fix XSS vulnerabilities in JavaScript** (2 hours)
4. ✅ **Set up Cloudflare for security headers** (1 hour)

**Total Time:** 4.5 hours
**Total Cost:** $0

### 30-Day Plan

1. Self-host Google Fonts (GDPR compliance)
2. Implement cookie consent banner
3. Create privacy policy page
4. Configure DNS security (DNSSEC, CAA records)
5. Set up uptime and SSL monitoring
6. Enable GitHub branch protection
7. Add form disclaimer for PHI

**Total Time:** 20-30 hours
**Total Cost:** $0-$200

### 90-Day Plan

1. Complete all MEDIUM priority items
2. Implement input validation
3. Create incident response plan
4. Set up security monitoring
5. Conduct security awareness training
6. Implement backup procedures
7. Privacy-friendly analytics

**Total Time:** 40-60 hours
**Total Cost:** $500-$1,500

### Long-Term Roadmap (6-12 Months)

1. Penetration testing
2. WCAG 2.1 Level AA compliance
3. Comprehensive security audit
4. Cyber insurance policy
5. Third-party security certification
6. Advanced threat monitoring
7. Regular security drills

**Total Cost:** $5,000-$15,000 annually

---

## Appendix A: Security Resources

### Documentation & Standards
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- HIPAA Security Rule: https://www.hhs.gov/hipaa/for-professionals/security/
- GDPR Full Text: https://gdpr-info.eu/
- Montana DPC Law: MCA 33-22-1821

### Security Testing Tools
- Mozilla Observatory: https://observatory.mozilla.org/
- Security Headers: https://securityheaders.com/
- SSL Labs: https://www.ssllabs.com/ssltest/
- OWASP ZAP: https://www.zaproxy.org/
- Hardenize: https://www.hardenize.com/

### Monitoring Services
- UptimeRobot: https://uptimerobot.com/
- Cloudflare: https://www.cloudflare.com/
- Certificate Transparency: https://crt.sh/
- Have I Been Pwned: https://haveibeenpwned.com/

### Learning Resources
- PortSwigger Web Security Academy: https://portswigger.net/web-security
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- Google Web Fundamentals: https://developers.google.com/web/fundamentals/security

---

## Appendix B: Contact Information

**For questions about this security audit:**
- Email: security-audit@onevia.health
- Document Version: 1.0
- Last Updated: February 12, 2026

**Recommended Security Contacts to Establish:**
- Security Officer: [Assign]
- Incident Response Lead: [Assign]
- Compliance Officer: [Assign]
- Technical Lead: [Assign]

---

**END OF SECURITY AUDIT REPORT**

This report should be reviewed quarterly and updated after any significant changes to the website or infrastructure.