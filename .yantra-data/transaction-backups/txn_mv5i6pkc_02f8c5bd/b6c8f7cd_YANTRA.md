# YANTRA.md — standing instructions for this project

Every run of the Coding Agent reads this file. Edit or remove anything here.

## Rules the person stated
- we never mark Uber itself up as a LocalBusiness at a city address it doesn't have. (Scope: Task #2, the SEO Agent's uber.com City Hub pages. Those pages are not built in this Nexora repo; building them needs the uber.com site repo linked here.)
- Never leave them indexed with stale dates. (Scope: Task #2 City Hub; "them" means expired event pages.)
- Never rename it. (Scope: Task #2 City Hub; "it" means the live uber.com city slug. Child pages take the live slug exactly as it is.)

## Build holds (team decisions, 2026-10-12)
- Task #4, AI Solutions landing page: build nothing until the CMO Agent hands over the approved frames and copy. Order: Designer Agent renders the frames, then Writer Agent writes the final copy, then the CMO Agent reviews it against Brand Voice, then Coding Agent builds. No scaffolding or placeholder-copy build in the meantime. UGC Concept 5 can't go live until this page is live. When the page is live, the Coding Agent tags UGC Video Agent in the team channel with the live URL so it can point Concept 5's CTA at it (UGC Video Agent's request, 2026-10-12).
- Task #1, NBA engine (nba-engine-technical-spec-v1.docx): build nothing until a person on the Growth Product side signs off the spec. Confirmed by the CMO Agent.

## Pending (gated: the formal Task #2 check runs only after the SEO Agent posts that the xlsx is regenerated to match v3)
- Task #2, City Hub (uber.com): the SEO Agent submitted v3 in the team channel on 2026-10-12, and the CMO Agent accepted it the same day ("Task #2 v3: accepted"). Option (a): every child page goes under the existing /global/en/r/cities/{slug}/ (no /travel/ tree), every page has a self-referencing canonical, hreflang applies only to locale pages that already exist, and no prices go in schema or meta descriptions. The CMO Agent's order: only after the xlsx is regenerated, the Coding Agent confirms (1) the live city URL pattern and London's exact slug, (2) any locale prefixes or hreflang already in place, (3) the full text of the sample-price disclaimer. Nothing gets built; this is research only.
- Read-only pre-check, already run on 2026-10-12, before that gate. The live pages were fetched with browser-like request headers (a plain fetch had returned "Not Acceptable"). Re-run it when the gate opens, in case anything changed, then report to the channel. Results:
  - URL pattern and slug: /global/{lang}/r/cities/{slug}/. London's live slug is london-eng-gb. /global/en/r/cities/london-eng-gb/ returns 200 with a self-referencing canonical. /global/en/r/cities/london/ and /gb/en/r/cities/london-eng-gb/ both return 404, so there is no bare "london" slug and no /gb/en/ city page.
  - Locales: by language under /global/{lang}/, not by country. 42 hreflang tags, all on the same slug, no x-default. Four codes each point at two URLs: es (/global/es/ and /global/es-es/), fr (/global/fr/ and /global/fr-ca/), pt (/global/pt-pt/ and /global/pt-br/), zh-Hant (/global/zh-hk/ and /global/zh-tw/).
  - Disclaimer, full text as served in the page HTML (3 times on the London page): "*Sample rider prices are average UberX prices only and do not reflect variations due to geography, traffic delays, promotions, or other factors. Flat rates and minimum fees may apply. Actual prices for rides and scheduled rides may vary."
- Limits: this repo has no uber.com code. The pre-check shows only what is publicly served. Whether new pages can go under /r/cities/{slug}/ needs the uber.com web repo linked here, or a named person on Uber's web team.
- Status (2026-10-12, later): the SEO Agent posted checklist items 3 to 11 for the CMO Agent to review as new, because it can't open the v1 xlsx (doc 278ab4a0) to prove what carried over from v2. It asked the CMO Agent to choose: the owner re-attaches doc 278ab4a0 (option 1), or the SEO Agent rebuilds sections 2 and 4 (option 2). The xlsx (city-hub-seo-foundation-v3) waits on that answer, so the gate above hasn't moved.
