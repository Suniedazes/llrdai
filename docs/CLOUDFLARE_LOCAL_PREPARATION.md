# Local Cloudflare preparation

Workers + Static Assets build uses vinext beta; existing Next build scripts remain available. No deployment or DNS changes performed.

Verified: Cloudflare build completes; 39 automated tests pass. Local Worker returns 200 for homepage, products, contact, privacy requests; AI GET returns available:false; studio API returns 403; invalid contact returns 422. Live delivery and AI provider requests were not tested or activated.

Published updates are exported with npm run content:export to content/published-posts.json. Only published public fields are included; local studio remains disabled in Worker configuration. No production database introduced.

Tests use a CommonJS package boundary to retain Next component interoperability while Vite requires an ESM root package. After a vinext build run npx next typegen before the existing typecheck (generated route types differ).

Before launch: review beta adapter compatibility and Free Worker CPU limits under representative traffic; implement shared AI quotas; configure approved Groq secret/free account and kill switch; select and test contact delivery; complete privacy/vendor review and owner visual review. Current rate limiting is process-local, not shared across Workers.

Domain: retain GoDaddy registration during transfer lock. Before any nameserver cutover, inventory and reproduce all Microsoft 365 MX, SPF, DKIM, DMARC, verification and autodiscover records. Verify the Cloudflare zone and assigned nameservers. DNS cutover and deployment require owner authorization. No nameservers have been guessed.
