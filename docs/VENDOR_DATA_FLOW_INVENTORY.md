# Production vendor and data-flow inventory

Status: development inventory; reconcile with selected production services before launch. Unknown means not verified, not no retention or no processing. Owner correction: all correspondence uses contactus@llrd.ai.

| Field | Microsoft 365 | Groq | Hosting / sending / monitoring |
|---|---|---|---|
| Selection/status | Owner confirms mailbox host; receipt untested | Approved corporate AI testing only; disabled/unverified | Providers not selected; none invented |
| Function | Email mailbox for all communications | Public website question-to-approved-fact matching | Add each selected provider before launch |
| Information | Sender, email content, attachments sent independently by email, mail metadata | If enabled: visitor question + public fact catalog; no product records | To be determined from actual deployment |
| Purpose | Respond to inquiries and rights requests | Explain/navigate public company/product content | Document before configuration |
| Storage location | Tenant region unknown | Unknown/account review required | Unknown |
| Retention | Tenant policies unknown | Unknown/account review required | Unknown |
| Training/own use | Contract review pending | Contract/account settings review pending; no no-training claim | Unknown |
| Subprocessors | Microsoft contractual list review pending | Groq contractual list review pending | Unknown |
| Website cookies/storage | No Microsoft scripts/cookies installed by this site | Server-only API; no Groq browser SDK/storage | None selected |
| Sensitive data | General form prohibits sensitive records; handling of unsolicited mail needs owner procedure | Prohibited; screening is best effort, not a guarantee | Define before launch |
| Contract/DPA | Owner review/confirmation needed | Owner review/confirmation needed | Pending selection |
| Deletion | Mailbox deletion/retention capability depends on tenant policies; verify | Verify provider deletion/retention terms | Pending selection |
| Security | Verify mailbox access/MFA, receipt, reply ownership and retention | Server secret, bounded inputs, timeout, no tools/uploads; shared rate limits pending | Review host/proxy/secrets/logging |
| Disclosure | Contact, Privacy, Request Center | AI notice and Privacy; finalize before live use | Add actual vendors/policies |

Actual flow today: browser → local Next.js site. Public contact collection fails closed; local validation sends no email and stores no inquiry. Mailto opens the visitor's email client; no website delivery confirmation. AI disabled until configured. Studio writes local JSON (owner tooling); it is not a third-party processor. Website public Updates still read that local source; publication snapshot work remains before hosting.

Browser storage: first-party sessionStorage llrd.discovery.seen.v1, value 1, remembers discovery prompt for the tab session. No inquiry/question stored. No analytics adapter configured; no advertising pixels/tags, cross-site tracking, behavioral advertising or advertising data sale/sharing. Browser/provider access logs outside application code require host review.

For every future vendor add: function, transmitted data/purpose, location, retention, training/own-use, subprocessors, storage names, sensitive-data rules, contract/DPA, deletion, security, disclosure, approval owner/date. Reconcile policies before production. SONIE/ElseSide/Health inventories and AI approvals are separate.
