# PicMagic Phase A — creative review, 11 September 2026

**Phase A is complete; the proposed concepts await approval.** The recommendation is twelve discovery previews: **ten new outputs and two existing images retained**, spanning personal, couple/family, art, product and fashion uses. No preview images or videos were generated, no content was activated, and no application edits, purchases, pushes or deployments were made during this phase. New contact sheets are review documents derived from existing local assets.

Start with the [ranked shortlist](shortlist.md), then the [twenty proposal cards](proposals.md). The next checkpoint is approval or revision of those specific selections, not approval of another implementation plan.

## Reconciled current state

| Inventory | Verified state |
|---|---|
| Working branch | `content/identity-and-collection-audit` |
| HEAD | `374fe7fe72b80c1c090af50757d418fded7aa651` |
| Local unique prompts | 162: 86 photo, 5 photo-edit, 71 reel |
| Local flags | 43 published, 119 draft; these are not production status |
| Production public content snapshot | 50 published prompts, 7 active collections, 16 categories; read-only public Supabase GET, 11 September 2026 |
| Production/local overlap | All 50 production IDs have local records and one audit entry each. All 50 local prompt texts differ from production. 28 are locally marked published; 22 locally draft. Another 15 local additions are marked published locally. |
| Collections | 39 local collections reviewed, including styles, seasonal and photo/reel additions |
| Referenced local image paths | 102 unique; 33 files present, 69 absent. All 43 locally published records reference a present image; presence alone does not prove alignment. |
| Actual full-size preview files | 86 inspected across six contact sheets, including originals, replacements, unused assets and the square friends source |
| Historical image queues | 70 entries, 69 awaiting generation and one integrated; the approved manifest duplicates that same queue, not another 70 jobs |
| Historical video selection | 8 planned primary reels await posters; older manifest contains two generated clips and one blocked Runway request. No new playback/identity QA is claimed. |

The public snapshot is the published-content source of truth for this audit, not a fresh HTTP journey test of every production URL. [Inventory and source hashes](inventory.json) · [public snapshot](production-public-snapshot.json). Existing uncommitted application work was preserved; the baseline changed-path inventory is recorded. Production was not used as a test or editing environment.

## Fresh audit conclusions

| Recommendation | Concepts |
|---|---:|
| KEEP | 80 |
| UTILITY | 40 |
| REWORK | 35 |
| MERGE, proposed | 3 |
| DEFEATURE, proposed | 4 |
| **Total** | **162** |

Scores: **1: 0 · 2: 8 · 3: 54 · 4: 80 · 5: 20**. These are reassessed editorial judgments, not measured popularity. Eight score-2 concepts are not recommended for prominent discovery. Eighty KEEP and forty UTILITY recommendations preserve useful intent; this does not mean every associated asset or generator edge case is release-ready. REWORK includes both creative improvements and narrow correctness fixes. **Zero** merges, unpublishes or prompt rewrites have actually been applied in Phase A.

The most material findings are:

- Production's demographic caveat still precedes fixed model descriptions, including the African-couple regression. Local reference-first wording is substantially better and must not be confused with live completion.
- Local car/driver concepts use product-only persona policy. Salt-road defaults say friends while the scene shows one rider. Newsroom team count conflicts with background staff.
- A park reel contradicts its own posture; some reels inherit static frozen-particle/exposure instructions; exact-product titles sometimes promise unseen angles.
- Narrow photo edits should preserve the source crop unless explicitly changed. Keep the useful edit, fix the conflict rather than rewrite everything.
- Krishna's copyable prompt and existing image already include the necessary styling. Retain both; update stale regeneration metadata later, because its older brief omits tilak/curls.
- Too many historical assets illustrate older ordinary scenes rather than the newly rewritten stories. Reusing a good-looking photograph is wrong when its scene does not match.

[Complete 162-record audit and all collection orders](complete-audit.md) · [structured record audit](prompt-audit.json) · [39 collection records](collection-audit.json) · [assembled generator/identity findings](generator-review.md).

## Asset review and representation

All **86** existing full-size image files were visually inspected on contact sheets generated from the actual files. **79** are human-focused; **7** are non-human product/vehicle views. Full-resolution follow-up was performed on the two first-batch reuse candidates: Krishna and the rain couple. Other retention entries are recommendations subject to final full-resolution/crop QA, not new release approvals. No before/after identity proof is implied by a standalone output.

For the entire local file inventory, current provenance records explicitly specify Indian/South Asian personas for **53 of 79 human-focused files**. Thirteen have a recorded brief without that explicit default; thirteen lack a matching current provenance record. Those are not automatically classified as non-Indian. Old production asset paths can outlive revised local provenance. [All asset observations/provenance](asset-review.json) · [contact sheets](contact-sheets/).

For the **production** set, public record briefs explicitly specify Indian/South Asian personas for **22 of 47 human-focused previews**. The other 25 include other specified or unspecified personas; this is a lower-bound count from declarations, **not an ethnicity inference from pixels**. [Production asset provenance](production-asset-provenance.json). Do not use the local inventory's 53/79 figure as a claim about live homepage representation.

The proposed batch explicitly briefs fictional Indian people for its human concepts and retains two provenance-supported India-first examples. Its future success/representation cannot be reported as achieved until generated outputs exist and are reviewed. No universal after-replacement percentage is claimed today.

## Research and creative direction

Inspected **20 examples across all three sites**, with **18 complete image/result and full-prompt pairs**. Canghe worked through Chrome despite empty text-only access. Two YouMind limitations are explicit. Repeated mixed-media examples count as one broad mechanism, not independent validation of popularity. [Traceable research report](research.md) · [exact examples and observations](research.json).

The twenty proposals evaluate all supplied directions. Three retain/develop existing PicMagic originals; several reserve proposals should become variants instead of new public records. The first batch uses ten selected proposals plus Krishna and rain-romance reuses. Its ten new outputs are a scope recommendation, **not ten guaranteed tool calls**: controlled product fixtures and multi-panel identity trials may require staged work.

Four reel candidates are documented with hook/progression/payoff. **Video remains deferred.** The square four-friends photograph remains a source reference, not a finished Ladakh poster or film. Do not resume provider submissions from historical approvals.

[Conditional homepage, canonical and model direction](homepage-and-architecture.md) · [freeze ledger, dependencies and resumable handoff](handoff.md).

## Validation and scope boundaries

Run `python3 docs/audits/creative-upgrade-2026-09-11/validate.py` from the repository. [Validation result](validation.json) checks exact audit coverage, classification totals, merge targets, collection coverage, proposal slug collisions, evidence links, shortlist scores/diversity, asset existence and unchanged source hashes. The scripts in this directory write planning reports only; they do not import seed data or mutate application content.

No fresh app lint/type/unit/E2E/build/Lighthouse or production smoke-test results are claimed. Historical tests remain historical. Those gates apply to later implementation, after approved assets exist. No deploy identifier exists for Phase A, and no production rollback is needed because nothing was deployed.

**Next decision: approve or revise the twelve ranked concept/asset selections.** All earlier media queues remain frozen. Later image production must use the accessible ChatGPT workflow only, with no automatic Codex/Astra fallback; costs stay zero.
