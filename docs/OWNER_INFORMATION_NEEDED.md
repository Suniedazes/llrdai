# LLRD — owner information and activation checklist

> Updated owner decisions and the remaining launch checklist are in [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md). That report supersedes the historical requests below: legal identity, jurisdiction, domain and receiving email have now been supplied. AI and direct social publishing are deferred, not launch requirements. Public studio persistence is not required for the proposed local editing workflow.

## Completed in the local preview
- Original LLRD identity and star-in-R logo, enlarged navigation branding, Home link, hero typography, approved gold and four pillars.
- Continuous rotating Earth, horizon glow, reduced-motion support, offscreen/hidden pause, and user Pause/Resume control.
- SONIE and ElseSide product registry, descriptions, stages, supplied logos/artwork and ElseSide palette. Latest SONIE logo with tagline copied into the site; source application files untouched.
- Product cards before Find My App, shorter descriptions, visually removed duplicate names, balanced image panels, consolidated lower homepage.
- Guided discovery, family follow-up, registry-based explanations, ElseSide entertainment match, inactive unavailable channels.
- AI integration with server-only credentials, ID validation and usage caps; disabled until configured.
- Business contact page with six services, validation, product-support separation, and an honest unconfigured delivery state.
- Local posting studio for website updates and social copy/downloads. Direct social publishing is not connected.

## 1. SONIE product evidence
Please provide 3–6 approved mobile screenshots (onboarding, family/profile, tree/history, memories/stories and collaboration), with captions identifying the screen and whether it is implemented or a prototype. Remove private family data or confirm the pictured records are approved demonstration data.
Provide the verified web app URL, Apple App Store URL, Google Play URL, and actual availability for each: Available, Beta, Testing, Coming Soon or Not Offered. Provide pilot eligibility, invitation/waitlist URL if any, release wording, and product support destination. Current development stage is Active Development / Pilot Preparation. Public access remains Coming Soon.

## 2. ElseSide product evidence
Confirm the exact gameplay/value proposition, intended platforms, audience/age range if relevant, and development milestones that may be published. Provide approved gameplay/UI when ready, clearly identifying concept art versus working gameplay. Provide public launch/store links or keep Coming Soon. Current stage is In Development; existing supplied brand artwork is connected.

## 3. Contact delivery (required before public inquiry collection)
Choose the email, CRM or database provider. Supply the verified receiving mailbox/team, sender address/domain, domain administrator for SPF/DKIM verification, and who owns replies. Decide whether to send visitor acknowledgements and provide approved copy if so. State retention period, deletion process and who may access inquiries.
Configure provider credentials through server environment or the hosting secrets interface, never in chat or NEXT_PUBLIC variables. Connect the adapter in app/api/contact/route.ts, add shared rate limiting and durable acceptance/deduplication, then test delivery with a controlled inquiry. Until then valid inquiries return not-sent and remain in the browser.

## 4. AI activation
Provide the OpenAI project/account administrator, selected Responses-compatible model, approved monthly budget and alert thresholds, and public activation decision. Configure OPENAI_API_KEY, LLRD_AI_MODEL, LLRD_AI_ENABLED=true as server-only environment variables. No key is presently included. Review the visitor disclosure and data processing terms; the query is sent to OpenAI only on explicit submission. Contact form contents never go to AI.
Before public activation add durable/shared abuse controls and provider project spending limits. Current caps are per-process, reset with server restarts, and are not a distributed spending guarantee. Run controlled live matching/refusal/error tests after configuration. Mocked tests do not prove live account access.

## 5. Facebook, Instagram and TikTok
Provide the exact Facebook Page, Instagram account and TikTok profile URLs/IDs, the authorized account administrator, and whether publishing should be draft/approval-based or immediate. Confirm the account types and intended media types (text/image/video). Choose an approved social publishing provider or platform developer apps. Complete OAuth/account authorization through provider interfaces; do not send passwords or tokens in chat. Platform permissions/reviews and a public callback URL may be required. Current studio prepares content/downloads but does not post directly to these accounts.

## 6. Company and partnership facts
Provide legal company name, jurisdiction, registration details intended for publication, public business address if desired, leadership names/roles/bios/photos approved for use, and verified public contact channels. Specify partnership priorities and the receiving team. Provide dated, substantiated milestones, approved demos, pilot results, testimonials and permission to use any partner/customer logos. Nothing should imply unverified certifications, size or customer relationships.

## 7. Privacy, security, legal and support
Provide reviewed corporate and product policies: actual data collected, purposes, processors, storage locations, retention, rights/deletion procedure, support contacts and applicable jurisdictions. Supply verified security practices and only certifications that can be evidenced. Confirm account-deletion procedure for each product. Existing policy shells must be finalized before public collection/launch; a navigation link is not a completed policy.

## 8. Hosting and public launch
Provide hosting provider/project, domain registrar/DNS administrator for llrd.ai, intended canonical domain, deployment environment and server-side secret administrator. Confirm deployment authorization. Configure HTTPS, durable storage for posting (current JSON store needs persistent single-instance storage or migration), backups, monitoring and deployment rollback. Localhost is not publicly accessible.

## 9. Final owner review
Approve copy and visual treatment; verify live external destinations, contact delivery, AI behavior and authorized social posting. Test real iOS/Android devices, slow connections and assistive technology. No physical-device or screen-reader certification has been claimed. Decide analytics provider/consent configuration if desired; no fabricated usage metrics are shown.

## Status and limits
Local implementation is complete for the supplied content and unconfigured integrations. Live email delivery, live AI inference, direct social publishing and public deployment require the above decisions, credentials or account authorization. No commit, push or public deployment performed. Repository contains accumulated uncommitted work from this project.
