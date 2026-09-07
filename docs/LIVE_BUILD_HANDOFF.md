# Live build and remaining configuration

Live website: https://llrd.ai. Cloudflare Free Worker: llrdai. Deployment repository: https://github.com/Suniedazes/llrdai (Cloudflare created a copy of Suniedazes/LLRD). Deploy from main, root /, build npm run build:vinext, deploy npm run deploy:vinext. The apex custom domain is now recorded in wrangler.jsonc. Historical prelaunch reports describe earlier states.

## Microsoft 365 setup required
Owner selected Microsoft Graph. Adapter is implemented but collection remains disabled. An administrator must register a single-tenant Entra application and authorize sending ONLY as contactus@llrd.ai, using Exchange application RBAC or a reviewed mailbox-scoped access policy. Do not grant unrestricted mailbox access or read permissions just for this form. Confirm the existing Microsoft 365 licensing permits the chosen setup.

Configure MS_GRAPH_TENANT_ID and MS_GRAPH_CLIENT_ID and store MS_GRAPH_CLIENT_SECRET as an encrypted Cloudflare Worker secret. Set LLRD_CONTACT_PROVIDER=microsoft-graph. Never share secrets in chat or Git. Arrange credential expiry/rotation. No real credentials have been created or installed by this code change.

Run a controlled server-side inquiry with administrator authorization, verify the message arrives and can be replied to, review Sent Items/message trace and failure behavior. Graph 202 means accepted for processing, not delivered; request-id is diagnostic correlation, not a mailbox message ID. Adapter requires both 202 and request-id, does not retry uncertain sends, and uses a ten-second total timeout. Do not enable public collection until shared abuse controls, privacy/vendor review and receipt testing are complete. Current limiter is process-local; distributed limits remain outstanding.

Sources: https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0 and https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow

## AI and final review
Groq remains disabled. Requires privately installed GROQ_API_KEY, verified free-only account, shared quotas, approved disclosure/vendor inventory and controlled tests before activation. No SONIE AI or paid fallback is authorized. SITE_INDEXABLE remains false pending final owner review. Review desktop/mobile, legal effective date, privacy policy against actual vendors, and Microsoft 365 DNS (previous inspection found proxied DKIM/Autodiscover; correction remains unverified). No email DNS changes made here.
