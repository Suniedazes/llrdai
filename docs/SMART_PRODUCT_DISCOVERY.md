# Smart Product Discovery — LLRD-WEB-PD-001

## Architecture review

KEEP: App Router pages, shared header/Home navigation, footer, green/gold tokens, product cards, product detail/trust templates, status-gated platform links, campaign records, and consent-gated analytics.

EXTEND: the existing `content/products.ts` registry with `discoverable`, `launchStatus`, `discoveryCategories`, `discoveryTopics`, and `discoveryPriority`. Public-product filtering also protects direct routes, metadata, campaigns, related cards, and the sitemap. Existing channel fields and URLs are unchanged.

ADD: configuration, deterministic matching, a reusable accessible dialog, portfolio entry points, session-frequency handling, and recommendation components. No CMS, second registry, AI service, profile, account, or email capture is introduced.

## Configuration and matching

`content/discovery.ts` controls categories, optional contextual topics, enablement, minimum engagement time, and visibility threshold. The automatic homepage prompt requires the visitor to scroll beyond 100 pixels, reach 35% visibility of the portfolio section, and spend at least 12 seconds on the page. It never opens on initial render. Manual Find My App buttons are in the homepage portfolio, Products page, and shared footer.

Only records with `discoverable: true` and a `PUBLISHED` or `COMING_SOON` launch status enter discovery. Private, internal, unannounced, disabled, and unspecified launch states fail closed for discovery. Legacy public records continue to work on existing pages. Set an explicit private launch status before adding any unpublished record.

Matching filters by category and optional topic, then ranks by descending discovery priority, ascending display order, and product ID as a stable tie-breaker. A follow-up appears only when configured answers distinguish at least two products. With the current single-product portfolio, Family & Memories leads directly to SONIE; asking another question would not improve the match. Other interests produce a no-match explanation and an Explore All Products link. Multiple matches use the same result cards.

To add a future product, add one record to the existing registry, fill its real channel statuses and destinations, opt into public discovery, and assign category/topic IDs and priority. Add new categories or follow-up copy in discovery configuration only when needed.

## Channels and attribution

Recommendations reuse `ProductPlatformCTA`. Available and beta channels require validated HTTPS destinations. Testing, coming-soon, not-offered, missing, and unsafe links remain inactive. Device presentation orders iOS first on iPhone/iPad, Android first on Android, and web first on desktop; all three channel statuses remain visible. Device information is not persisted or sent to analytics.

Internal recommendation and campaign handoffs preserve only bounded UTM fields and campaign ID. External UTM forwarding remains opt-in by destination origin. Analytics campaign context is resolved against public campaign records, never inferred from arbitrary visitor query text. Current production campaign inventory is empty; fixture tests exercise the templates.

## Accessibility, privacy, and failure behavior

The native dialog has an accessible name, focus entry, explicit Tab wrapping, Escape/close/dismiss controls, and focus restoration without changing scroll position. It uses the existing contrast-checked palette, 44-pixel controls, responsive scrolling, and reduced-motion rules.

Only the seen/dismissed flag is stored in sessionStorage; a memory fallback handles blocked storage on the current document. Answers remain in component memory and never enter analytics, URLs, or storage. Interest analytics record the event only. Recommendation/channel analytics use product IDs and vetted campaign IDs through the existing consent gate. No analytics provider or consent is enabled by this change.

A client error boundary removes a failed discovery UI while preserving the underlying site; manual entry falls back to Products when no discovery listener is available. The existing Products navigation is always available.

## Separate globe request

The user's earlier request for continuous globe rotation is implemented separately in `EarthCanvas.tsx`. It preserves the hero text/navigation and sunrise direction, uses local Earth textures, and rotates eastward over 180 seconds without reversing. A software sphere projection replaces a WebGL prototype that crashed the preview browser. The original generated hero remains a loading/error fallback. Rendering pauses offscreen/in hidden tabs and respects reduced motion. No public deployment has been performed.
