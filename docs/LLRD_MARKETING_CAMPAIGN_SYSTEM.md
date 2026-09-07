# Campaign system

`content/campaigns.ts` is a separate typed registry. No live campaigns were supplied, so no invented campaigns are published. Public campaigns must be ACTIVE, within their optional UTC dates, and reference a published product. Unknown, draft and expired campaigns return 404 and are omitted from the sitemap.

The landing template shares the product's independently configured platform choices. Campaign headline, subheadline, media and theme are isolated data. Destination overrides must be approved HTTPS URLs. Incoming UTM fields are allowlisted and length-limited, and forwarded only to destinations explicitly approved for attribution in configuration. No local storage, cookies, analytics network calls or identifiers are added by default.

Provider-neutral events cover campaign/product views, channel, waitlist and support clicks. Collection requires explicit consent and an installed adapter. Campaign copy must be approved before activation.
