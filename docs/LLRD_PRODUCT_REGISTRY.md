# Product registry

`content/products.ts` owns strictly typed products. No confirmed product inventory, approved product copy, launch URLs or channel statuses were supplied. The public registry therefore starts empty; it does not assert a launch for SONIE or any other product. Test fixtures demonstrate multiple independent channels without becoming public products.

Each channel has AVAILABLE, BETA, TESTING, COMING_SOON or NOT_OFFERED status. Available and beta links require an approved HTTPS URL. Testing is informational. Unavailable channels never generate store links. Waitlist links require both explicit enablement and an approved HTTPS destination. Web remains a first-class channel. Add product records to publish pages and cards; no page redesign is needed.

Product detail templates include overview, features, separate media, platform choices, campaign and trust links, related products, and optional waitlist. Product trust subroutes have conservative forthcoming content until reviewed policy/support content is supplied.
