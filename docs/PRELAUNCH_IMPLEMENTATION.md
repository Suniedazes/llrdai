# Remaining pre-launch implementation status

## COMPLETED
Privacy Request Center route /privacy-requests with all ten requested choices, applicability wording, Privacy Appeal category, single mailbox and footer/legal links. Shared four-field form and category validation. Contact categories include General, Product Support, SONIE, ElseSide, Privacy Request, Privacy Appeal, Legal / Copyright / DMCA, Security, Accessibility, Business / Partnership and Other (existing business-service topics retained).

Server delivery interface is wired into contact endpoint with an unconfigured adapter. A configured adapter must confirm accepted=true and a provider ID before success and case ID are returned. IDs are generated server-side with UUIDs; no case is persisted or falsely acknowledged while adapter is null. Provider idempotency/durable case recovery must be implemented with the actual provider. The form retains failed values, does not log bodies or put them in URLs. Privacy Appeal emails can also be sent directly to contactus@llrd.ai with that subject; receipt is not verified by this website.

DMCA telephone added alongside existing supplied agent/address/email. No government registration claim. Privacy request placeholder is replaced by the real local route. Original source extract remains historical evidence, not active website content.

Vendor inventory: VENDOR_DATA_FLOW_INVENTORY.md. Only Microsoft 365 mailbox hosting is owner-confirmed. Groq is approved for controlled testing but not enabled/verified. Hosting, website sending, analytics/error providers remain unselected.

## READY FOR OWNER ACTION / BLOCKED BY EXTERNAL CONFIGURATION
- Verify contactus@llrd.ai receipt on Microsoft 365; choose website sending adapter and verified sender/security configuration. No extra mailboxes required.
- Configure free-only Groq server key privately; verify account limits/billing status and controlled requests. Never assume an environment flag prevents paid billing on a paid account.
- AI: replaceable WebsiteAIProvider service, approved fact selection, no private data/tools/uploads/search, timeout and graceful failure. Existing local counters: five/client/minute, twenty/global/minute, hundred/global/day. Contact adds ten/client/minute. These are process-wide, not distributed. Trusted proxy IP header and shared host-specific rate limiter remain required for public multi-instance deployment. No paid limiter service chosen. Screening cannot guarantee recognition of all sensitive text.
- Privacy/cookies final reconciliation with actual vendor inventory and legal review remain launch gates. Future effective date October 12, 2026 preserved.
- Complete U.S. Copyright Office DMCA designated-agent registration before applicable UGC safe-harbor reliance; confirm Tennessee registered agent from official filing separately. Neither performed.

Required variable names (no values/secrets): LLRD_AI_ENABLED, LLRD_AI_PROVIDER, LLRD_AI_MODEL, GROQ_API_KEY, LLRD_AI_FREE_PLAN_CONFIRMED, LLRD_AI_TRUSTED_IP_HEADER, SITE_INDEXABLE, LLRD_LOCAL_STUDIO. Sending-provider secrets only after selection.

## NOT AUTHORIZED
Paid APIs/infrastructure, automatic paid fallback, production deployment, DNS changes, SONIE/ElseSide/Health AI, advertising/behavioral tracking, or product data sharing. No accounts activated, no credentials created or exposed.

## Hosting handoff
Existing PRODUCTION_READINESS.md comparison remains the starting assessment: Vercel recommended for native Next.js fit; Cloudflare conditional on adapter validation; Amplify version support needs confirmation. Hosting remains unselected. Confirm current commercial plan costs before owner approval. Prepare provider-issued apex/www DNS, TLS verification, server secrets, reviewed published-content snapshot, backups of local studio data, redacted logs, shared abuse controls and prior-version rollback. No DNS/hosting operations performed.

Owner visual review still required on staging: desktop/tablet/mobile, navigation, products/SONIE/ElseSide, AI, Contact, Privacy Request Center, legal/footer and accessibility basics. Technical checks are not acceptance.

## Git
Earlier uncommitted AI/contact work preserved. This task adds privacy request route, categories, navigation/sitemap/legal links, delivery interface/route wiring and documentation/tests. No commit or push requested/performed.

Verification: final production build, lint, typecheck, diff whitespace check and all 38 automated tests passed. This includes every privacy category, case-ID acceptance with a mocked adapter, unavailable delivery, existing AI quota/registry controls and regression coverage. No live email/Groq test or staging visual review performed in this task.
