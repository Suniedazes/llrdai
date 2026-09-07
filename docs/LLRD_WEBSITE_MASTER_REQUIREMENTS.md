PROJECT: LLRD TECHNOLOGIES CORPORATE WEBSITE
DOMAIN: llrd.ai

PRIMARY OBJECTIVE:
Build LLRD.ai as the parent-company website, product-discovery hub,
marketing destination, and trust center for multiple LLRD applications.

IMPORTANT:
This is a separate repository from SONIE.
Do not touch any SONIE files, repos, deployment settings, or infrastructure.

======================================================================
1. LOCKED LLRD BRAND DIRECTION
======================================================================

Company:
LLRD Technologies

Primary domain:
llrd.ai

Primary tagline:
“Technology that connects what matters.”

Brand pillars:
People • Possibilities • Progress • Purpose

Core visual language:
- deep green / near-black foundation
- rich sunrise gold
- earth green
- earth stone
- horizon sand
- warm ivory
- Earth horizon
- golden sunrise
- star symbol
- premium, sophisticated, modern, human-centered
- cinematic but not flashy
- high-trust corporate feel
- no generic blue SaaS aesthetic

Approved conceptual direction:
Earth + sunrise + star remain part of the corporate visual identity.

Do not approximate or redraw final brand assets if exact master assets
are not yet available. Build the asset system so exact final assets can
be swapped in cleanly.

Master name rule:
Every formal logo must read LLRD.
Never accidentally render LRD.

======================================================================
2. PRODUCT STRATEGY — LOCKED
======================================================================

LLRD will support multiple applications and product categories.

The website must NOT be built around one product.

LLRD.ai must support an expanding portfolio.

Web versions remain active even after native apps launch.

Native mobile apps do NOT replace web versions.

Each product may independently have:
- Web
- iOS
- Android

Each channel must support statuses such as:
AVAILABLE
BETA
TESTING
COMING_SOON
NOT_OFFERED

The website must make it easy for a user to choose:

OPEN ON WEB
DOWNLOAD ON THE APP STORE
GET IT ON GOOGLE PLAY
COMING SOON
JOIN WAITLIST

Never assume all products support the same channels.

======================================================================
3. WEBSITE PURPOSE
======================================================================

LLRD.ai must serve five functions:

1. Corporate identity
2. Product discovery
3. Product launch/distribution
4. Marketing/campaign landing destination
5. Trust/legal/support center

The site should support future Apple App Store and Google Play operations
without becoming dependent on those stores.

======================================================================
4. INITIAL INFORMATION ARCHITECTURE
======================================================================

Create:

/
Homepage

/products
All LLRD products

/products/[slug]
Individual product detail page

/campaigns/[slug]
Reusable campaign landing pages

/about
Company story / mission

/impact
People • Possibilities • Progress • Purpose

/support
Central support entry

/privacy
Corporate privacy center

/security
Security and trust center

/legal
Legal notices / terms shell

/contact
Contact

Future-compatible:

/products/[slug]/privacy
/products/[slug]/support
/products/[slug]/delete-account
/products/[slug]/legal
/products/[slug]/security

Do not implement SSO, billing, subscriptions, or account systems yet.

======================================================================
5. HOME PAGE EXPERIENCE
======================================================================

The homepage should feel premium and cinematic.

Hero should include:

LLRD TECHNOLOGIES
Technology that connects what matters.

Use:
Earth horizon
gold sunrise
deep green / near-black space
subtle star motif

Follow with:
People • Possibilities • Progress • Purpose

Then:
Featured Products
Why LLRD
What We Build
How People Can Access Products
Trust / Privacy / Security
Footer

Avoid:
- generic SaaS dashboard visuals
- excessive gradients
- stock-corporate clichés
- overuse of “future” or “tomorrow”
- crowded home page
- hard-coded product count

======================================================================
6. MODULAR PRODUCT SYSTEM
======================================================================

Create a structured Product registry.

Do NOT hard-code products into the homepage markup.

Use typed data/config.

Suggested fields:

id
name
slug
logo
tagline
shortDescription
longDescription
category
heroImage
brandColors
websiteUrl
webAppUrl
webStatus
appleAppStoreUrl
iosStatus
googlePlayUrl
androidStatus
featured
displayOrder
supportUrl
privacyUrl
legalUrl
campaignLinks
comingSoonMessage
waitlistEnabled
platformNotes

Product cards should render automatically from this registry.

Adding a future product should require data/content updates, not page redesign.

======================================================================
7. PRODUCT PAGE TEMPLATE
======================================================================

Each product detail page should support:

- product logo
- product name
- tagline
- short story/overview
- hero visual
- feature highlights
- screenshots/media placeholders
- web availability
- iOS availability
- Android availability
- trust/privacy links
- support link
- campaign links
- optional waitlist
- related products

Primary CTAs should be dynamic.

Examples:

OPEN ON WEB

DOWNLOAD ON THE APP STORE

GET IT ON GOOGLE PLAY

JOIN WAITLIST

COMING SOON

Device detection may prioritize the most relevant CTA, but never hide
valid alternatives.

======================================================================
8. MARKETING / SOCIAL AD ARCHITECTURE
======================================================================

LLRD will run ads on:
Facebook
Instagram
TikTok

Create reusable campaign landing pages.

Campaign pages should:
- visually continue the campaign creative
- preserve message consistency
- support product-specific campaigns
- support UTM parameters
- preserve attribution where technically appropriate
- offer web / iOS / Android conversion paths
- support future analytics
- avoid sending all ad traffic to a generic homepage

Campaign data should also be modular.

Suggested campaign fields:
id
slug
name
productId
headline
subheadline
heroMedia
campaignTheme
source
medium
campaignCode
ctaType
destination
activeFrom
activeUntil
status

Do not embed social-platform advertisements as the core site experience.

Instead, create native LLRD campaign content that mirrors approved ads.

======================================================================
9. WEB DISTRIBUTION — LOCKED
======================================================================

Web access is a first-class product channel.

Do not treat web versions as temporary.

LLRD.ai should allow users to:
- launch a web app immediately
- install a native version if available
- choose their preferred channel

This must remain true even after App Store and Play Store releases.

======================================================================
10. TRUST / STORE READINESS
======================================================================

Create permanent corporate trust architecture.

Corporate:
- Privacy
- Security
- Legal
- Support
- Contact

Product-level future support:
- privacy
- security
- support
- delete account
- legal

Do NOT invent compliance claims.

Do NOT claim:
- HIPAA compliance
- SOC 2
- ISO certification
- encryption certification
- regulatory approval
- security certification

unless formally documented later.

Pages may clearly state “information forthcoming” or use approved
placeholder language where legal copy is not final.

======================================================================
11. APP STORE / PLAY STORE READINESS
======================================================================

Create:

docs/LLRD_APP_STORE_PLAY_STORE_READINESS.md

Track:
- developer organization setup
- company identity consistency
- privacy policy
- support URL
- account deletion
- data disclosures
- screenshots
- icons
- age rating
- reviewer access
- App Store metadata
- Play Store metadata
- web support
- policy review date
- approval status

Suggested statuses:
NOT_STARTED
REQUIRED
IN_DESIGN
IMPLEMENTED
TESTED
STORE_READY
SUBMITTED
APPROVED

======================================================================
12. BRAND SYSTEM
======================================================================

Create centralized design tokens.

Do not scatter hard-coded colors.

Set up semantic tokens such as:

--llrd-bg-primary
--llrd-bg-elevated
--llrd-green-deep
--llrd-green-earth
--llrd-gold
--llrd-sand
--llrd-stone
--llrd-ivory
--llrd-text-primary
--llrd-text-secondary
--llrd-border
--llrd-focus
--llrd-success
--llrd-warning
--llrd-error

Keep semantic status colors separate from brand colors.

Accessibility takes priority over brand.

Build reusable components:
- Logo
- Header
- Footer
- Button
- Card
- ProductCard
- ProductPlatformCTA
- CampaignHero
- SectionHeader
- Badge
- TrustLink
- Quote/Statement
- MediaPanel

======================================================================
13. BRAND ASSET STRUCTURE
======================================================================

Organize assets so each piece can be changed independently.

Suggested structure:

public/brand/
  llrd-logo-primary/
  llrd-logo-horizontal/
  llrd-logo-stacked/
  llrd-logo-monochrome/
  llrd-star/
  earth-sunrise/
  palette/
  social/
  campaign/
  product-placeholder/

Do not make the whole brand one flattened image.

The website must be able to replace:
- logo
- hero
- star
- product art
- social imagery
independently.

======================================================================
14. CONTENT ARCHITECTURE
======================================================================

Create corporate content from structured files/data rather than embedding
every paragraph directly into page components.

At minimum separate:
- company content
- products
- campaigns
- footer/legal links
- trust links
- navigation

Make it easy to migrate to a CMS later without rewriting the front end.

Do not build the CMS now.

======================================================================
15. TECHNICAL STACK
======================================================================

Use:
- Next.js
- App Router
- TypeScript
- strict typing
- responsive design
- semantic HTML
- reusable components
- centralized tokens
- metadata APIs
- sitemap
- robots
- Open Graph
- structured SEO where appropriate

Keep dependencies conservative.

Do not introduce a large UI framework unless there is a strong reason.

======================================================================
16. RESPONSIVE EXPERIENCE
======================================================================

Test for:
- iPhone-sized mobile
- Android-sized mobile
- tablet
- laptop
- wide desktop

Mobile must not feel like a shrunken desktop.

Hero content must remain readable.
Product CTAs must remain easy to use.
No horizontal scrolling.
No inaccessible overlays.
No tiny touch targets.

======================================================================
17. ACCESSIBILITY
======================================================================

Target strong WCAG-compatible patterns.

Include:
- semantic page structure
- keyboard navigation
- visible focus
- alt text
- sufficient contrast
- reduced-motion consideration
- screen-reader-friendly controls
- accessible buttons and links

======================================================================
18. SEO / SOCIAL SHARING
======================================================================

Set up:
- title templates
- meta descriptions
- canonical URLs
- Open Graph
- Twitter/social metadata
- favicon placeholders
- sitemap
- robots

Each product and campaign page should have independent metadata.

======================================================================
19. ANALYTICS ARCHITECTURE
======================================================================

Create a provider-neutral analytics layer.

Do not hard-wire the application deeply to one analytics vendor.

Track future events such as:
- product viewed
- campaign viewed
- open web clicked
- App Store clicked
- Play Store clicked
- support clicked
- waitlist clicked

Respect future privacy/consent requirements.

Do not add invasive tracking by default.

======================================================================
20. DOCUMENTATION TO CREATE FIRST
======================================================================

Before major implementation create:

docs/LLRD_WEBSITE_MASTER_REQUIREMENTS.md
docs/LLRD_BRAND_SYSTEM.md
docs/LLRD_PRODUCT_REGISTRY.md
docs/LLRD_MARKETING_CAMPAIGN_SYSTEM.md
docs/LLRD_APP_STORE_PLAY_STORE_READINESS.md
docs/LLRD_ARCHITECTURE.md

Record assumptions explicitly.

======================================================================
21. INITIAL BUILD SCOPE
======================================================================

After documentation, build:

1. site shell
2. centralized brand tokens
3. responsive header/footer
4. homepage
5. Products page
6. Product detail template
7. campaign landing-page template
8. About
9. Impact
10. Support
11. Privacy shell
12. Security shell
13. Legal shell
14. Contact
15. modular product registry
16. modular campaign registry
17. platform CTA component
18. SEO foundation
19. analytics abstraction
20. responsive validation
21. accessibility review
22. build/type/lint validation

======================================================================
22. DO NOT BUILD YET
======================================================================

Do not build:
- authentication
- user accounts
- SSO
- payments
- subscriptions
- admin CMS
- full contact CRM
- live chat
- store APIs
- product backend systems
- SONIE integrations
- health integrations

Keep this site cleanly separated from product backends.

======================================================================
23. DEPLOYMENT
======================================================================

Do NOT deploy immediately.

First:
CODE
TEST
REVIEW
FIX
RETEST
REPORT

Then stop and provide the implementation report.

Deployment to llrd.ai will be authorized separately after review.

======================================================================
24. FINAL REPORT
======================================================================

At the end report:

LLRD BUILD REPORT

Repository:
Branch:
HEAD:
Working tree:

Documentation created:

Architecture:

Routes created:

Components created:

Brand-system implementation:

Product registry:

Campaign system:

Responsive validation:

Accessibility:

SEO:

Analytics foundation:

Tests:
Typecheck:
Lint:
Build:

Known gaps:

Items intentionally deferred:

Brand assets still needed:

Legal copy still needed:

Recommended next build:

Do not deploy unless separately authorized.