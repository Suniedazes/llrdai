# LLRD production operations

This is a monitoring service inside the existing `llrdai` Worker, not a second website or an AI agent with write access. It recommends; it never changes DNS, permissions, billing, products, legal copy, production flags, or models.

## Schedule and costs

- Worker Cron: every 30 minutes UTC. Each run checks the current America/Chicago clock.
- Daily email: first run at/after **08:00 America/Chicago** each local day. Normally 13:00 UTC during CDT, 14:00 UTC during CST. Scheduling can be delayed by the platform; this is not an exact-delivery SLA.
- One installation report: first scheduled run, protected by a durable one-time ID. A retry cannot duplicate an ambiguous send.
- GitHub independent watchdog: hourly at :17 UTC; dependency audit Monday 12:43 UTC.
- No paid service introduced. Same Cloudflare Free Worker, with an additional SQLite Durable Object class in the existing account; usage consumes existing free allowances. No upgrades or automatic paid fallback. The 30-minute health schedule adds approximately 336 public GET requests/day before daily sampling.
- GitHub standard runners run only if the repository is public, or the owner explicitly confirms a private-repository free budget with OPS_GITHUB_FREE_BUDGET_CONFIRMED=true. Never set that variable without checking spending controls. GitHub can disable inactive scheduled workflows after 60 days; owner must keep schedules enabled.

## Data and private reporting

`config/operations-monitoring.ts` centralizes URLs, schedule, thresholds and retention. Product URLs supplied by the owner are monitored, but registry availability/launch CTAs are unchanged.

The Worker records only kind (AI/contact), HTTP status and bounded duration. It does not read or store inquiry bodies, prompts, passwords, tokens, email addresses, visitor identifiers or raw IP addresses for operations. Existing quota protection remains separate. Metrics are recorded asynchronously; telemetry failure cannot reject an otherwise successful contact submission. Therefore counts are best-effort, not a billing ledger.

- Half-hour aggregate buckets: two days; daily reports summarize the previous 24-hour window to half-hour resolution.
- Health samples: two days. Summarized daily reports: 93 days, allowing 7/30/90-day trends.
- Storage: private OperationsMonitor Durable Object. No public dashboard or public report-content endpoint.
- Owner-readable dashboard: daily email, with explicit GREEN/YELLOW/RED checks, evidence and approval-required recommendations.
- Generated local/CI reports live in ignored reports/operations/generated. No telemetry is committed to Git.
- Weekly/monthly trend views are included in the daily report, not extra duplicate emails. Search trend windows are 7/28/90 days when GSC is connected.
- History accumulates prospectively. There is no invented historical baseline or migration of visitor data.

`/api/health/operations` exposes only HTTP 204/503 and no report data. It tests monitor recency, critical health, daily email acceptance and overdue reporting. It is no-store/noindex. Anyone can GET it; it does not run jobs or send email. The GitHub watchdog uses it to detect Graph/reporting outages independently. Until the first report is accepted this endpoint deliberately returns 503.

## Email delivery

Reports go only to **contactus@llrd.ai**, directly from a separate server-side Graph notification adapter. The contact form is never invoked. Existing scoped application credentials are reused; no extra Mail.Send permission or mailbox is required. Graph 202 plus request-id establishes acceptance, not final inbox delivery. Status persists before and after the send. Delivery verification is **NOT AVAILABLE** automatically; the app does not gain Mail.Read permission.

An explicit 429 with a Retry-After of 1–5 seconds is retried once. Timeouts, network disconnects and ambiguous responses are not retried, to prevent duplicates. A failed send remains visible through the independent heartbeat/Actions failure. The daily email cannot serve as its own sole failure alarm.

Independent notification delivery is **PARTIAL** until the owner enables GitHub Actions failure notifications on their account. The workflow failure remains visible in Actions regardless of email settings. No unapproved webhook or paid channel is configured.

## Working collectors

- Homepage, contact, products, robots, sitemap, SONIE and ElseSide URLs: HTTP status, measured duration, unexpected redirect, repeated failures, validated HTTPS response. Homepage requires two failed samples before CRITICAL.
- Daily DNS-over-HTTPS: MX, SPF, DKIM selector CNAMEs, DMARC and nameservers. Compares public record values against the previous report. This detects missing records/changes, not proof that outbound mail is DKIM-signed. A proxied DKIM CNAME no longer resolving as expected is warned about.
- Daily bounded same-origin sitemap sample: metadata, canonical, noindex, Open Graph, duplicate titles and non-200 pages. This is a bounded sample, not a complete orphan-page/external-anchor crawl.
- Contact/AI aggregate attempts, accepted HTTP responses, validation statuses, 5xx, throttling and total elapsed time. Graph auth vs timeout vs acceptance-failure breakdown is not yet instrumented separately. Inbox delivery failures are NOT AVAILABLE.
- Groq daily models endpoint: current model access without inference. Configured model remains openai/gpt-oss-20b. No auto-switching. Token usage, account-wide quota remaining and advance deprecation announcements are not yet collected.
- Microsoft credential expiry: owner-supplied ISO date, warning thresholds 90/60/30/14/7/1 days. Does not retrieve secrets or silently grant application-directory access.
- Independent Node HTTPS/TLS probe checks certificate expiration and public health; weekly npm production dependency audit fails on high/critical findings. Does not auto-upgrade or merge.

## Optional integrations prepared, not connected

Cloudflare secret variables:

| Name | Purpose |
|---|---|
| OPS_CF_ANALYTICS_TOKEN | Account Analytics read permission only, for Worker invocation/error totals |
| GSC_CLIENT_ID / GSC_CLIENT_SECRET / GSC_REFRESH_TOKEN | Authorized Google Search Console read-only OAuth access |
| GSC_PROPERTY | Non-secret verified property: https://llrd.ai/ or sc-domain:llrd.ai |
| BING_WEBMASTER_API_KEY | Owner-authorized Bing Webmaster account access |
| MS_GRAPH_SECRET_EXPIRES_AT | Non-secret ISO timestamp copied from Entra credential metadata |

Never place values in source, NEXT_PUBLIC variables, workflow logs, or chat. Search adapters do not submit sitemaps. Missing authorization produces explicit YELLOW/OWNER AUTH REQUIRED, not zero traffic. GSC aggregate query results cover 7/28/90 days, ending three days ago to allow data lag. Query/page/country/device details and specific ranking-opportunity analysis remain follow-up work after access is available. Bing returns rank/traffic totals. Cloudflare adapter collects sampled Worker totals, not all geography/cache/bandwidth/unique-visitor datasets.

Outstanding visibility: account analytics credentials; GSC/Bing ownership and submissions; secret expiration metadata; Entra permission drift (requires separately approved read access); registrar expiry; DNSSEC validation; full broken-link/anchor/orphan crawl; PageSpeed/CrUX/Lighthouse; GitHub Dependabot/secret-scanning alert API access; Groq account-wide quota/deprecation history. These are explicitly not claimed healthy.

## Owner actions (one checklist)

1. **GitHub account Settings → Notifications → Actions**: enable email or web notifications for failed workflows, and verify this repository's Actions schedules are enabled. SECRET: No. Independent failure alerts need the owner's subscription; expected result is a notification when the watchdog fails.
2. **Entra → App registrations → LLRD Website Contact → Certificates & secrets**: copy ONLY the expiration date into Cloudflare variable MS_GRAPH_SECRET_EXPIRES_AT (ISO timestamp). SECRET: No for this date. Expected result: accurate expiry countdown without granting new Microsoft permissions.
3. **Google Search Console**: add/verify llrd.ai (DNS TXT verification requires owner-controlled DNS approval). Submit https://llrd.ai/sitemap.xml after verifying live indexing remains enabled. Authorize read-only OAuth and install GSC secrets in Cloudflare. SECRET: Yes for OAuth credentials, never share in chat. Expected result: actual search metrics and verified sitemap receipt. SITE_INDEXABLE currently remains true; no submission has been made by this implementation.
4. **Bing Webmaster Tools**: verify/import the verified Google property, submit the sitemap, and configure the Bing API key as a Cloudflare secret. SECRET: Yes. Expected result: Bing traffic data; owner confirms sitemap receipt. Never invent verification records.
5. **Cloudflare profile → API Tokens**: authorize a least-privilege Analytics read token for the existing account and store it as OPS_CF_ANALYTICS_TOKEN. SECRET: Yes. Expected result: automated Worker analytics; plan-limited datasets stay unavailable. No paid analytics or browser beacon is required.
6. **Outlook contactus@llrd.ai**: confirm the first operations email arrives. SECRET: No. Graph acceptance alone cannot verify final delivery; do not grant Mail.Read just for this test.
7. **Owner review**: choose whether to authorize PageSpeed/CrUX and additional read-only Entra/GitHub security metadata access. SECRET: Possibly, depending on provider. These expand visibility and are not prerequisites for the installed basic monitor. Review legal/vendor inventory before any new visitor analytics technology; none was installed here.

## Commands and operational controls

- `npm test` / `npm run lint` / `npm run typecheck`
- `node scripts/operations-check.mjs` runs public read-only checks and writes an ignored JSON report. It sends no email.
- OPS_ENABLED=false disables monitoring, without changing contact, AI or indexing. Cron configuration is version controlled.
- No automatic legal/content rewrites, DNS mutations, rotation, billing changes or model changes.

## Sources used

- https://developers.cloudflare.com/workers/configuration/cron-triggers/
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/analytics/graphql-api/tutorials/querying-workers-metrics/
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- https://developers.google.com/webmaster-tools/v1/sitemaps/submit
- https://learn.microsoft.com/en-us/bingwebmaster/getting-access
- https://docs.github.com/en/actions/concepts/workflows-and-actions/notifications-for-workflow-runs
- https://docs.github.com/en/actions/concepts/billing-and-usage
