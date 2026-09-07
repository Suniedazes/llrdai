# Groq approved-model retest — September 7, 2026

Supersedes the Groq HTTP 404 blocker in FINISHING_DEPLOYMENT_RESULT.md.

Owner approved openai/gpt-oss-20b and another bounded production acceptance run. Cloudflare binding inspection confirmed that model, LLRD_AI_ENABLED=false, SITE_INDEXABLE=false and an encrypted GROQ_API_KEY binding. No secret value was retrieved or logged.

Test deployment commit: 00cfc484e7b64bcabaf6dc963c21ff42882eb0c9. Cloudflare build 9950472c-c616-4b8e-ac3e-09ff3fe62ef0 succeeded.

The once-only Durable Object suite returned:

```json
{"status":"pass","results":[{"name":"sonie","pass":true,"ids":["sonie"]},{"name":"elseside","pass":true,"ids":["elseside"]},{"name":"injection","pass":true,"ids":[]}]}
```

Authentication PASS; model access PASS; provider response PASS; server-side registry/output validation PASS; SONIE PASS; ElseSide PASS; invented-product refusal PASS. Successful provider/validation completion establishes the responses were accepted and were not HTTP 404. Existing Chat Completions JSON integration works with this model; no Responses API migration or registry-validation relaxation was necessary.

Shared quota operational: all three provider requests passed through deployed SITE_QUOTA admissions. Local tests verify 3/client/minute, 4/site/minute and 100/day ceilings across persisted/reloaded counters and UTC resets. This was a bounded functional test, not a load test. All 46 automated tests, lint and application/Worker typechecks passed for the retest.

Repository model configuration, adapter default and .env.example now agree on openai/gpt-oss-20b. Final cleanup disables LLRD_AI_ACCEPTANCE_RUN; the once-only stored report also prevents duplicate requests. No visitor prompt is accepted by the harness. Public AI, Find My App, contact and indexing remain disabled. No paid fallback, credentials, product URL or public activation was added.

READY TO ENABLE FIND MY APP: YES from the technical Groq acceptance perspective. It has NOT been enabled. Existing owner visual/legal/privacy approvals remain separate; contact readiness is unchanged.

Reference: https://console.groq.com/docs/model/openai/gpt-oss-20b documents Chat Completions and JSON support. Evidence above is the actual deployed test, not an inference from provider documentation.
