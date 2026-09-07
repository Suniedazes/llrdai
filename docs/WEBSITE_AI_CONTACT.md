# Corporate website AI and contact update

## Outcome and boundaries
This update supersedes earlier company/email and OpenAI-only configuration instructions. Legal entity: LLRD LLC. Address: 1109 Woodland St, Unit 60552, Nashville, TN 37206, United States. Phone: 615-397-8434. Single receiving address: contactus@llrd.ai. Existing LLRD Technologies visual identity and product descriptions remain. Effective date remains October 12, 2026; Copyright Agent, LLRD LLC remains the supplied designation.

## Architecture
LLRD website → /api/discovery/ai → lib/website-ai service → WebsiteAIProvider → Groq. Nothing imports SONIE backend code, authenticated data, private company systems or uploaded files. No web search or provider tools. The interface returns selected approved fact IDs; server content supplies concise responses and internal links. Unknown questions route to Contact. Arbitrary model prose and invented links are never displayed. This is grounded website assistance rather than open-ended advice/chat. Another approved provider requires a server adapter and configuration, with no website UI redesign; unsupported providers fail closed. There is no paid fallback.

Initial model: llama-3.1-8b-instant. Official references: [Groq model](https://console.groq.com/docs/model/llama-3.1-8b-instant), [API](https://console.groq.com/docs/api-reference), [free-plan limits](https://console.groq.com/docs/rate-limits). Limits and free-plan availability must be verified in the actual account. An environment flag cannot prevent billing on a paid account: use a verified free account and do not enable billing. No API credentials or live calls were made in this task.

## Environment
- LLRD_AI_ENABLED=false: kill switch; explicitly set true only after readiness checks.
- LLRD_AI_PROVIDER=groq
- LLRD_AI_MODEL=llama-3.1-8b-instant
- GROQ_API_KEY: server secret, currently absent from configuration supplied by this task.
- LLRD_AI_FREE_PLAN_CONFIRMED=false: set true only after verifying the account's free-only billing status.
- LLRD_AI_TRUSTED_IP_HEADER: set only to a header the selected host overwrites. Unset groups callers in one conservative bucket, rather than trusting spoofable forwarded headers.
- SITE_INDEXABLE=false and LLRD_LOCAL_STUDIO=false remain safe defaults.
No NEXT_PUBLIC secrets. No automatic activation or paid infrastructure. Secrets must be configured privately in the host environment, not sent in chat.

## Protection and limitations
Same-origin, JSON-only, 4KB request bound, exactly one query field, 5–600 characters, no attachments. Sensitive/advice patterns reject recognized content before provider transmission; this is best-effort screening, not guaranteed personal-data detection. Disclosure tells visitors not to provide personal/sensitive data. Fixed approved answer text prevents advice generation even if screening misses a question. Provider timeout 12 seconds, 180 output tokens, 1000-character provider JSON cap, at most two validated fact IDs and 1600-character answer bound. No retry/fallback to another provider. Quota/provider/timeout failures return the approved friendly unavailable message with Products and Contact navigation.

Rate limiter: 5 requests/client/minute, 20 global/minute, 100 global/day. IPs are HMAC-hashed using an ephemeral process salt and not logged; bounded memory stores counters only. Counters expire, reset on process restart, and are not shared across instances. Before public multi-instance testing, replace the RateLimiter port with a host-appropriate shared limiter and verify proxy/IP handling. No speculative database added. Logs contain status and duration only, no message, IP, provider payload or credential. Host access logs require a separate retention review.

## Contact
Visible fields are Name, Email, Inquiry category and Message. A hidden honeypot remains for abuse detection. Previous organization/phone/preference fields are no longer parsed or forwarded. Sensitive-information notice is adjacent to Message. No marketing opt-in, newsletter or additional collection.

The intended recipient is contactus@llrd.ai, centrally inherited by contact-delivery.ts. Contact page now displays the approved address, phone and mailto link. No email sending provider has been selected or configured; mailbox operation is not assumed. Server still returns honest failure, never false success. Public form collection stays closed until the provider durably accepts messages and operational privacy review is complete. Mailto opens the visitor's own email client; it is not server-side form delivery. Provider selection, verified sender/DNS, mailbox verification, shared contact abuse controls and an end-to-end test remain required.

## Legal and tracking
Updated legal identity/contact information and AI/privacy links. Legal policy dates and DMCA designation preserved. Cookie policy now describes actual corporate sessionStorage behavior; AI policy describes the separate prospective Groq integration without claiming live operation.

Actual browser persistence: llrd.discovery.seen.v1 in first-party sessionStorage, value 1, to suppress repeat discovery prompts, limited to tab session; no message content. No analytics adapter configured; consent-gated analytics hook remains dormant. No advertising cookies, Meta/TikTok pixels, Google advertising tags or behavioral tracking installed. No cross-app data sharing. Any future analytics must document vendor, storage names, purpose, data, retention, vendor own-use, consent requirements and policy changes first.

## Pre-launch items
1. Implement/approve the live Privacy Request Center / Your Privacy Choices and appeal destinations.
2. Complete final production vendor/data-flow inventory, including Groq if enabled and email/hosting providers when selected.
3. Update Privacy/Cookie policies to final production technologies and provider terms/retention.
4. Complete U.S. Copyright Office DMCA agent registration.
5. Confirm Tennessee registered agent separately.
6. Final legal/privacy review before production launch.
7. Configure a free-only Groq account secret privately, trusted proxy handling/shared limits, then controlled provider tests. Live provider access is unverified.
8. Select/configure email delivery and verify contactus@llrd.ai, then controlled acceptance/failure tests.
9. Host selection, deployment approval and owner responsive/visual review remain separate. SONIE AI is not authorized by this selection.

## Files changed
.env.example; app/api/discovery/ai/route.ts; app/contact/page.tsx; components/AIDiscovery.tsx; components/ContactInquiry.tsx; components/LegalCenter.tsx; content/company.ts; content/legal-package.json; lib/contact.ts; lib/website-ai/content.ts, provider.ts, limits.ts, service.ts; tests/ai-discovery.test.ts; tests/contact.test.ts; tests/production-readiness.test.ts; this report.

Verification: typecheck, lint, production build and 37 automated tests passed before the final policy-text documentation update. Tests cover registry validation, sensitive-input no-call behavior, quota failure with no fallback, rate limits, contact validation and existing functionality. No live provider/email test or public deployment. Working changes are left uncommitted for this implementation review; existing commits are preserved.

Owner correction: contactus@llrd.ai is the single address for all website inquiries, privacy, legal, accessibility, security and copyright communications. The owner confirms Microsoft 365 hosts the mailbox. This supersedes the earlier privacy@llrd.ai direction. Mailbox hosting does not configure server-side form sending; its connection and delivery test remain pending. Historical source-document extracts retain their original text.
