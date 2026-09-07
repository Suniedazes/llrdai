# Posting studio

User scope update: add website posting and Facebook, Instagram and TikTok social-post preparation. The no-deployment instruction remains in force.

Run npm run build, then npm run studio. Open http://127.0.0.1:3000/studio. Write title, URL name, summary and article; save a draft or publish to the local website. Published updates appear at /updates. Move a published item back to draft to withdraw it. Captions for each social platform are saved with the draft and can be copied or downloaded. No social accounts are connected and no automatic social publication is claimed.

Posts are saved atomically in data/posts.json, outside Git. Back up this directory independently; the source archive intentionally excludes private drafts. Version checks prevent an older browser tab from overwriting newer edits. A filesystem write lock protects concurrent writes. This is durable local storage, not browser storage. For hosting, replace the storage boundary with a managed database and configure authenticated author access before enabling writes.

The editor is disabled in ordinary npm start. The studio launcher binds Next to loopback and creates an ephemeral secret for the local editor API. The page and API reject non-loopback Host values; writes require the token and a matching Origin, reject cross-site requests, bound request size and validate fields. Do not proxy or expose this local authoring server to the internet. This is not a multi-user authentication system.

Public pages render plain text with React escaping, exclude draft social content and show published articles only. No raw HTML/Markdown execution. The social text export does not invent a public llrd.ai link while the site remains local. Social media attachments and direct account connections are not implemented; use each platform's own posting tools with the prepared captions.
