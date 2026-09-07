# LLRD
LLRD AI website

# LLRD Technologies website

Independent Next.js App Router implementation. Local review only; not deployed.

## Run

```sh
npm install
npm run dev
```

## Validate

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Use `npm start` after building for local production preview. The checked-in lockfile records installed versions. No external fonts or live tracking are used.

Read `../LLRD_BUILD_REPORT.md` for validation and outstanding content. The product and campaign registries intentionally start empty. Do not publish fixture data as real products. See `tests/fixtures.ts` for a complete example product.

Master logo/artwork is configured in `content/brand.ts`. No final brand image has been approximated. Contact, support and legal shells make their status explicit. Preview indexing defaults off; reviewed deployment can set `SITE_INDEXABLE=true`.
