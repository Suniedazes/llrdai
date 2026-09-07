# LLRD production readiness — 7 September 2026

PRODUCTION READINESS: READY FOR OWNER CONFIGURATION

This means the assessment and preparation are complete, not that the site is approved or configured for launch. No hosting adapter has been installed or tested on a host.

PUBLIC DEPLOYMENT: NOT AUTHORIZED  
LIVE AI: NOT AUTHORIZED  
CONTACT COLLECTION: NOT AUTHORIZED UNTIL DELIVERY + PRIVACY ARE READY  
OWNER FINAL REVIEW: PENDING

## 1. Incorporated owner facts
`content/company.ts` centralizes LLRD.AI LLC (legal entity), LLRD LLC (public brand), Tennessee, USA, llrd.ai and contactus@llrd.ai. Existing LLRD Technologies visual identity remains. About/Legal, footer copyright and homepage Organization metadata now identify the legal entity appropriately. No address, phone, registration, leadership, customers or other unsupported claims were added.

## 2. Contact destination and privacy
Approved recipient: contactus@llrd.ai. This is an intended destination, not verified mailbox infrastructure. `lib/contact-delivery.ts` records provider=null, privacyApproved=false and collectionEnabled=false. Public requests fail before body parsing. Local preview still exercises validation and returns an honest not-sent 503; no provider or persistence is connected. No successful-delivery response exists.

The Privacy page remains an unfinished shell. The owner must supply the final notice covering actual fields/purposes, processors, retention, deletion/rights procedure, security practices, contact details and applicable jurisdictions. None were invented. Before activation, replace the final route failure with a server-only adapter, and return `{ok:true}` only after validated durable provider acceptance (including a provider message ID). Acceptance is not a guarantee of inbox delivery; bounces require operational monitoring.

## 3. Email provider assessment
**Recommend Resend, subject to owner selection.** Its HTTP interface fits the existing fetch-based server architecture and can avoid SMTP/socket dependencies across hosts. Use a verified company sender, fixed approved recipient, validated visitor email as Reply-To, bounded timeout, idempotency and explicit response validation. A provider failure or ambiguous timeout must not produce success. Integration can remain a small server module; no SDK, subscription or credential is needed now. [Next.js integration](https://resend.com/docs/send-with-nextjs)

Resend requires sending-domain verification with the exact records it issues, including SPF/DKIM and applicable return-path records. Prefer a dedicated sending subdomain after owner approval; it does not replace the receiving mailbox. Cost category: low-volume free tier or modest monthly transactional plan plus overages; confirm current plan limits at selection. [Domain verification](https://resend.com/docs/dashboard/domains/introduction), [pricing](https://resend.com/pricing)

Postmark is a reasonable alternative when dedicated transactional-email operations and support are prioritized, with a monthly plan cost. Amazon SES has very low usage-based sending cost but adds AWS identity/IAM, sandbox/production-access and deliverability administration. Neither provides a reason to add that operational complexity before the host/provider decision. [Postmark pricing](https://postmarkapp.com/pricing), [SES pricing](https://aws.amazon.com/ses/pricing/)

Future configuration must contain the selected provider's server-only API credential, approved verified sender and fixed recipient. Provider-specific variable names are intentionally deferred until selection. Visitor acknowledgements should be a later, separately approved feature after inbound delivery, abuse controls and approved privacy/copy are in place.

## 4. Product destinations
Existing `content/products.ts` already supports ID/name, stage, launch visibility, per-channel availability, webAppUrl/websiteUrl, supportUrl and CTA label. `lib/platforms.ts` only supplies launch links for eligible statuses with valid destinations; this is the existing public-access gate, so no duplicate registry was introduced.

SONIE remains Active Development / Pilot Preparation, Coming Soon. ElseSide™ remains In Development, Coming Soon, with the approved tagline and supplied artwork. Both lack verified web/store URLs and expose no invented launch destinations. Insert verified URLs and explicitly enable the appropriate registry channel later. Support destinations can be added centrally. Screenshots, native-store listings, gameplay footage and release dates are not assessment blockers.

## 5. AI and social
AI remains off by default: LLRD_AI_ENABLED=false, no key/model configured by this task, no live provider request. Existing server integration, registry-only IDs, input bounds, same-origin checks, timeout and fail-closed behavior remain. Future activation requires separate approval of account/project, model, monthly budget, alerts, shared usage controls and disclosure.

Local studio continues create → preview → copy/download → owner review → manual posting. Facebook, Instagram and TikTok APIs are not connected. No social credentials were requested or stored.

## 6. Repository requirements
- Installed Next.js 16.3.4; package range ^16.0.0, React 19.2, App Router, TypeScript. Production build succeeds locally. Preserve the lockfile and select a host-supported Node version in deployment configuration.
- Server routes: contact, AI discovery and local studio posts. Dynamic pages include Updates, individual updates, sitemap and product/campaign routes. Static-only hosting does not satisfy this application.
- Contact/AI use Request, Response, bounded streams and fetch; studio uses node:fs/promises, node:path, node:crypto and Buffer. Local launcher uses child_process and is not a production service.
- No middleware/proxy file found. No existing hosted database, queue, scheduled job or WebSocket dependency.
- Local SVG/PNG/JPEG assets, Next Image handling, and client Canvas Earth animation. No server GPU requirement. Host-specific image limits/optimization need a preview check.
- Indexing is disabled unless SITE_INDEXABLE=true. This is not authentication. API replies must remain no-store; never cache inquiry/AI responses. Review public page/cache invalidation when selecting the publication workflow.

## 7. Hosting comparison
| Concern | Cloudflare Workers | Vercel | AWS Amplify |
|---|---|---|---|
| Current compatibility | Conditional: needs exact-version adapter proof; not a drop-in deployment | Best architectural fit for Next.js/Node; host preview still required | Current Next 16.3.4 is outside documented SSR 12–15 support |
| Required changes | Isolated OpenNext/Workers build, compatibility flags/config, FS publication handling, image setup | Platform project/build/env setup, public content snapshot handling | Resolve supported-version gap with AWS first; build/SSR/env configuration; content handling |
| Complexity | Moderate adapter/runtime work | Lowest relative setup complexity | Highest here due to version gap and AWS operations |
| Persistence | Worker virtual FS is not durable studio storage | Do not rely on function-local disk | Do not rely on SSR compute-local disk |
| Secrets | Workers secret bindings; separate environments | Server environment secrets scoped by environment | AWS secret store/IAM and explicit SSR access; build env is not a secret vault |
| Domain/HTTPS | Custom domain and managed TLS; follow account DNS requirements | Custom domain and managed TLS verification | Custom domain/certificate verification |
| Workflow | Reviewed build → adapter output → Wrangler/CI, only after authorization | Reviewed source → preview → approved production promotion | Reviewed source → branch build/deploy after compatibility proof |
| Rollback | Retain prior Worker version and redeploy/rollback; content separately versioned | Prior deployment rollback; verify env/content compatibility | Redeploy prior known-good build/source; retain artifacts/config |
| Monitoring | Worker logs/metrics, errors and usage alerts | Build/runtime logs, errors and usage alerts | Build logs and SSR CloudWatch monitoring |
| Cost category | Low base plus metered requests/CPU, images/storage | Commercial monthly plan plus usage | Pay-as-you-go build/SSR/bandwidth/storage and related AWS services |
| Main limit | Adapter/runtime divergence; no durable local JSON | Commercial use needs appropriate plan; ephemeral disk | Documented framework version gap; feature limitations |

Cloudflare was assessed first. Its current guidance directs new projects toward vinext and retains OpenNext for existing Next builds. Do not change this application framework simply to fit the host. OpenNext supports relevant App Router features but requires compatibility testing; a local Next build does not prove a Worker build. [Cloudflare OpenNext guidance](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)

Cloudflare's filesystem is memory-based, with bundled read-only files and temporary writable storage, not durable content persistence. [Workers filesystem](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/)

**RECOMMENDED HOST: Vercel, using an appropriate commercial plan.** This recommendation follows from the repository's existing Next.js architecture and minimizes migration work. **FALLBACK HOST: Cloudflare Workers, conditional on successful exact-version adapter and content/image testing.** No adapter migration was made. [Vercel Next.js support](https://vercel.com/docs/frameworks/full-stack/nextjs)

Amplify's published support matrix lists Next.js 12–15 and excludes some advanced SSR features. Obtain explicit support confirmation for 16.3.4 before considering it; do not downgrade to force compatibility. [Amplify support matrix](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)

Rollback does not replace data/configuration recovery. For example Vercel rollback restores a previous deployment rather than applying newly edited environment settings. [Vercel rollback](https://vercel.com/docs/instant-rollback). Amplify requires deliberate handling of server-runtime environment access; do not blindly copy all build variables into artifacts. [Amplify SSR environment guidance](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html)

Confirm current quotas, log retention and service costs before purchase: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Vercel plans](https://vercel.com/docs/plans/pro-plan), [Amplify pricing](https://aws.amazon.com/amplify/pricing/). No service was purchased or configured.

## 8. Persistence finding and simplest path
`lib/post-store.ts` writes data/posts.json through an exclusive lock and temporary-file rename. The local owner studio performs these writes. This file includes drafts and social copies as well as published posts and is gitignored; no data files are tracked.

Public /updates, /updates/[slug] and sitemap read this file. Therefore public content has a read dependency even though visitors do not write to it. A missing file yields no posts; malformed/unreadable data can fail routes. Deploying source alone will not carry local posts, and bundling the entire studio file risks distributing drafts.

Recommended launch workflow: export only reviewed published website fields to a versioned, sanitized snapshot; make the public reader use that snapshot; build and redeploy when publication changes. Keep draft/social source local with owner backups. Implement and verify the export/reader after the host/publication choice, before launch. This task does not migrate storage. No production database is necessary for that workflow.

If the owner later needs hosted editing without redeployment, choose a managed object store for simple versioned publication or a CMS/database when editing/concurrency requirements justify it. Add access controls, backups, validation and cache invalidation then. Current lock files are single-filesystem coordination, not a distributed database or stale-lock recovery system.

## 9. Provider-neutral domain and email checklist
1. Identify llrd.ai registrar/DNS administrator and authorize the eventual changes separately. Export current DNS before changes.
2. Choose apex llrd.ai as canonical or approve another choice; decide whether www is used and redirect the alternate. Add only the selected host's exact apex and www records, preserving existing mail records.
3. Complete hosting ownership verification and managed HTTPS; test certificate renewal/redirects and review CAA if present. Use a private/staging preview for configuration before public authorization.
4. Verify contactus@llrd.ai mailbox provisioning, access/reply owner and external receive/send tests. Verify actual MX records; do not assume they exist. Website transactional sending and mailbox hosting are separate services.
5. Add only provider-issued sending verification records. Maintain one valid SPF policy per name, merging authorized senders rather than creating duplicate SPF records. Publish issued DKIM selectors and any dedicated return-path records without overwriting mailbox MX.
6. Have the email administrator review DMARC alignment and reporting. Consider monitoring first, with an authorized reporting destination, then tighten enforcement after legitimate senders are verified. No DMARC policy or reporting mailbox has been invented here.
7. Put credentials into the selected host's server secret controls; separate preview/production, restrict access and document rotation. Never place keys in source, NEXT_PUBLIC, logs or screenshots.
8. Test controlled delivery, timeout/retry/idempotency, bounce handling and contact failure/success behavior after privacy and provider readiness; only then seek collection activation approval.

## 10. Security review and remaining launch work
Preserved: same-origin validation, JSON-only parsing, 24KB bounded contact stream, server field limits and enum checks, honeypot, no inquiry-body logging/storage, and no inquiry values in URLs. Public collection now fails before parsing. These controls are not a complete abuse defense.

Before public collection: configure strict production origin/proxy trust, shared/distributed rate limits, suitable bot controls, bounded provider timeout and durable idempotency/deduplication where retries warrant it. Require durable accepted-message evidence before success; define ambiguous-timeout recovery. Review retention/access and deletion with the final privacy implementation. Keep logs redacted and monitor status/error counts, delivery failures and provider costs without message bodies.

Before public launch: dependency/security review, hosting preview tests, production security-header/CSP review, asset and cache behavior, studio inaccessible with LLRD_LOCAL_STUDIO=false and no studio token, rollback rehearsal and operational ownership. Noindex does not protect a deployed preview; use access control when needed.

Before future AI activation: shared limits, project budget/spend alerts, abuse controls and consent/disclosure review; existing 20/minute and 100/day counters are per-process, reset on restart and cannot enforce an account-wide budget. The existing provider timeout is 20 seconds; responses are validated against public registry IDs. No live AI test occurred.

## 11. Environment configuration
.env.example contains safe defaults: SITE_INDEXABLE=false, LLRD_LOCAL_STUDIO=false, LLRD_AI_ENABLED=false, empty OPENAI_API_KEY and LLRD_AI_MODEL. No real credentials were added. Do not configure a production studio token. Contact recipient is centralized company metadata, while provider/privacy/collection remain locked in lib/contact-delivery.ts. Only add selected-provider variable names after owner selection. Indexing, collection and AI activation each need their own review; they are not consequences of a successful build.

## 12. Verification and Git safety
Typecheck PASS; lint PASS; production build PASS on Next.js 16.3.4; automated tests 32/32 PASS. Three additional readiness tests cover approved facts/dormant configuration, public contact rejection before parsing, and unavailable product channels. No remaining test/build failures were observed; existing accumulated changes were included in these checks.

`npm audit --omit=dev --json` could not reach npm's advisory endpoint and exited 1. This is an incomplete external dependency check, not a reported vulnerability or a clean audit. Re-run with network access before launch. No dependency upgrades were made to mask it.

This task changed: .env.example; content/company.ts; content/pages.ts; components/Footer.tsx; app/page.tsx; app/api/contact/route.ts; lib/contact-delivery.ts; tests/production-readiness.test.ts; docs/OWNER_INFORMATION_NEEDED.md; docs/CONTACT_AND_AI.md; this report; docs/PRODUCTION_BASELINE_GIT_STATUS.txt; docs/PRODUCTION_FINAL_GIT_STATUS.txt.

The baseline status artifact records the accumulated modifications/untracked files before this task. The final status artifact records the complete resulting status. Some files modified here already had changes; those were preserved, not reverted. No reset, discard, commit, push, deployment, DNS mutation or account creation occurred.

## 13. Exact owner actions still required
1. Select the host and authorize its future setup; choose Vercel or request a separate isolated Cloudflare proof first.
2. Select the email provider; approve sender identity and verify mailbox operation and reply ownership for contactus@llrd.ai.
3. Identify registrar/DNS and hosting/secret administrators; authorize exact provider-issued records later.
4. Supply and approve the final Privacy Notice and remaining legal/security/support statements based on actual operations, without assumed facts.
5. Approve the local-studio published-snapshot workflow so its export/public reader can be implemented before deployment; decide backup ownership.
6. After service setup authorization, configure secrets privately and complete delivery, abuse-control, dependency audit and host-specific staging checks. Reassess collection readiness then.
7. Supply verified product web/support destinations when available; Coming Soon may remain at launch. Store listings, testimonials, gameplay and final screenshots are not assessment blockers.
8. Review desktop, tablet and mobile: homepage, Products, Find My App, Contact, About, Impact, Updates, Support, Privacy, Security, Legal; check external destinations, contact behavior, responsive layout and motion/accessibility. Automated checks do not constitute owner approval.
9. Separately authorize any commit, push and public deployment after reviewing this work. Live AI and direct social publishing remain future decisions, not prerequisites for the current assessment.
