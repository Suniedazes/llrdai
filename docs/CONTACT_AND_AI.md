# Contact and AI discovery implementation

> Production-readiness update: approved recipient is contactus@llrd.ai; mailbox/MX are unverified, provider is unselected, and privacy is unapproved. `lib/contact-delivery.ts` records these inactive decisions. Public contact requests fail before body parsing; local preview retains validation-only behavior. AI defaults to disabled. See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) for current decisions and verification; the implementation history below is retained.

## Contact
- `/contact` is a dedicated business-development page; shared navigation/footer unchanged.
- Services select the inquiry dropdown and focus it. Required fields and server/client validation share `lib/contact.ts`.
- `/api/contact` accepts same-origin JSON only, limits the stream to 24KB, validates lengths/choices/email, checks a honeypot and never logs or stores the body.
- No email, CRM or database delivery is configured. Valid submissions return HTTP 503 with `ok:false`. The UI retains entries and explains delivery is unavailable before and after submission.
- Integration point: replace the final 503 in `app/api/contact/route.ts` with a server-only adapter to a chosen provider. Return `{ok:true}` only after durable acceptance. Configure verified recipient/sender and provider secrets in server environment; add shared rate limiting, deduplication and provider timeouts. Update the availability notice when enabled. Never use NEXT_PUBLIC secrets.
- Existing Privacy page is still a policy shell. Finalize retention, processor and contact information before collecting public inquiries.

## AI
- Expand “Tell us what you’re looking for” within Find My App.
- Requires server-only `LLRD_AI_ENABLED=true`, `OPENAI_API_KEY` and `LLRD_AI_MODEL` (a model supporting Responses structured outputs). No credentials are included, read from unrelated apps or sent to the browser.
- Official implementation reference: https://developers.openai.com/api/docs/guides/structured-outputs
- Only the submitted description and public product descriptions go to OpenAI. Contact inquiries never go to AI. Responses use `store:false`; this does not promise zero provider retention.
- The model returns product IDs only; server validates them against the public opt-in registry. Names, descriptions, destinations and availability remain registry-controlled.
- Request size, timeout, same-origin checks, and per-process global caps (20/minute, 100/day) limit exposure. Configure shared abuse controls and provider project budget limits before public activation; counters reset on process restart and are not distributed.
- No live provider request was made. Mocked provider tests cover valid and invented IDs, while unconfigured behavior is tested without credentials.

## Verification
Build/type compilation, lint, automated regression tests and browser checks. No commit or push performed. Other accumulated repository changes predate this task; do not reset them.

## Files changed for this task
- app/contact/page.tsx and contact.css: dedicated page and responsive styling.
- components/ContactInquiry.tsx, lib/contact.ts, app/api/contact/route.ts: form and validated server endpoint.
- lib/request-origin.ts: shared host/origin validation, including local Next.js origin normalization.
- app/[page]/page.tsx: excludes contact from generic static route generation.
- components/AIDiscovery.tsx, app/api/discovery/ai/route.ts: opt-in AI integration.
- components/ProductDiscovery.tsx and app/discovery.css: AI entry within existing discovery.
- tests/contact.test.ts, tests/ai-discovery.test.ts: validation, failure behavior and mocked AI boundary tests.
- docs/CONTACT_AND_AI.md: configuration and handoff.

## Verified outcome
29 tests passed; final build (including TypeScript) and lint passed. Initial syntax and Link lint errors introduced during implementation were fixed. No remaining known build/test failures. Browser checked desktop contact hero, required-field errors, valid form returning honest 503 with values retained, mobile fields/focus, tablet width (805px viewport and scroll width), and AI disabled-state disclosure. Physical devices, screen readers and live provider delivery were not tested.
Git remains uncommitted with existing accumulated changes plus this task's files. No commit or push.
