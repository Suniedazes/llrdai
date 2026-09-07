# Architecture

Independent local Next.js App Router repository with strict TypeScript, React, plain CSS and no component framework. This honors the requested Next.js stack instead of the Sites default Vinext scaffold. No hosting registration or deployment is performed. No SONIE files, infrastructure or integration are used.

Data boundaries: company, navigation, footer/trust links, brand manifest, products, campaigns and informational pages live under `content`. Shared presentation lives under `components`; validation, attribution, channel actions and analytics under `lib`. These boundaries support a later CMS adapter without a redesign.

Assumptions: no confirmed product inventory, campaign content, contact address, final legal language or master imagery is available. Public empty states are honest. Contact/support do not collect data or simulate sending messages. No backend, identity, billing, CMS or CRM is present.

Routes: /, /products, /products/[slug], /campaigns/[slug], /about, /impact, /support, /privacy, /security, /legal, /contact and /products/[slug]/{privacy,support,delete-account,legal,security}. Unknown records return 404. Draft/expired campaigns are excluded. Dynamic routing lets future records be added without a redesign. Metadata includes canonicals, Open Graph and Twitter text; master image metadata is added only when supplied. Sitemap uses public records. Preview indexing is disabled unless SITE_INDEXABLE=true is explicitly set after review.

Development: npm install; npm run dev. Validation: npm run typecheck; npm run lint; npm test; npm run build. Production locally: npm start. Deployment and custom-domain changes require separate authorization.

Visual scope update: the supplied brand board now provides the exact interim logo via a viewport onto unmodified source pixels. Generated Earth/network artwork is independent and optimized by Next Image. Product concepts in the board are not treated as an approved public registry. The star within R is preserved. See LLRD_ASSET_PROVENANCE.md.
