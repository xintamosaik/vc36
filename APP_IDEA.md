# Local CV workbench — app idea

Discussion captured on 7 November 2026. This document records the intended workflow and design direction. Examples and suggested implementation details are proposals unless explicitly marked as decisions.

## Purpose

A personal, locally run app for turning professional experience into reviewed, reusable CV material and connecting that material to job requirements.

The main problem is the cost of tailoring. Writing a carefully tailored CV takes time; generating an entire CV with AI produces something approximately 85% satisfactory, but still requires reading and checking everything. Repeated generation discards editorial work already done.

The app should help accumulate that editorial work: create useful wording once, review it, connect it to relevant requirements, and reuse it deliberately.

It is primarily for its author. Another user could clone the repository and run it locally, but shared hosting, accounts, collaboration, and a commercial product are outside the initial scope.

## Existing document workflow

Direct editing of a working HTML document and CSS has been more effective than previous CV builders. Changes in content often require small manual adjustments to preserve a good page layout.

Preserve that workflow. The initial output should be an editable content draft in a format easy to transfer or convert to HTML or Typst. Markdown is the proposed intermediate format. Typst is a possible final authoring format, not a requirement.

Automatic pagination and regeneration of the final HTML layout are not the central problem this app needs to solve.

## Decisions and current direction

| Area | Direction |
| --- | --- |
| Language | TypeScript |
| UI framework | SvelteKit, scaffolded with `sv create` |
| Styling | Tailwind CSS; preference for styling close to the markup |
| Tailwind plugins | Typography and forms |
| Tooling | Prettier, ESLint, Vitest for unit and component testing |
| Package manager | pnpm |
| Runtime | Node.js LTS is the current proposed baseline; no requirement for Bun or Deno APIs |
| Stored facts | Readable JSON files |
| Stored narrative | Markdown, with metadata where useful |
| Relationships | Stable IDs |
| Database | None initially |
| Execution | Local server with a browser interface |
| History | Git plus saved application snapshots |
| AI | Assistance with analysis and drafting; accepted material remains under human control |

Java and Ruby are excluded; PHP is not preferred. Vue was considered and rejected as a preference. Stack discussion should not become the main project.

The setup selections above record the choices discussed, not verification that every dependency has been installed.

## Domain model

### Timeline chapters

Professional history is anchored in timeline entries, called chapters. Usually these are jobs. They may also be periods of study or projects, especially for someone with little employment history.

Each entry has an ID from the start. It holds relatively stable information such as organisation, role, dates, and context.

Illustrative employment entry:

```json
{
  "id": "chapter-example-company",
  "type": "employment",
  "organisation": "Example Company",
  "title": "Software Engineer",
  "start": "2024-01",
  "end": null
}
```

IDs are stable identities, not derived afresh from filenames, dates, or display titles. A readable ID is fine, but renaming the organisation or correcting a date should not change it. Exact field names and date conventions remain to be finalised.

### Experiences within a chapter

A chapter can contain accounts of particular pieces of work: a migration, a new feature, a debugging effort, a reporting system, or a tooling improvement.

These accounts provide context and factual boundaries: what happened, the individual's contribution, collaborators, constraints, whether the work shipped, and what outcomes are known.

An experience can initially be a named section within a chapter's material. A separate experience ID is useful when several spins refer to the same work, but should not be compulsory for every short account.

### Spins

A spin is a deliberate presentation of experience: an emphasis, interpretation, wording, or level of detail intended to communicate something relevant to an employer.

Different spins can draw on the same work. A permissions migration could support wording about end-to-end delivery, modelling business rules, collaboration, or changing an existing system.

Each spin has its own ID and references its timeline chapter. It can optionally reference a particular experience.

```markdown
---
id: spin-permissions-delivery
chapter: chapter-example-company
experience: experience-permissions-migration
codes:
  - end-to-end-delivery
  - collaboration
status: draft
---

Delivered a permissions migration with another engineer,
covering backend logic, frontend UI, tests, and production rollout.
```

This is illustrative wording, not an approved factual claim. A spin can change the emphasis without changing who did the work, what was implemented, or its actual adoption status.

Concise and expanded wording can be retained as separate spins or explicit variants. The best representation should be tested in use.

### Codes and job requirements

Codes connect language in job descriptions to relevant experience and spins. Examples include end-to-end delivery, collaboration, migration, business-rule modelling, and debugging.

Keep the original job-description passages. A code is an interpretation of a passage, not a replacement for it. Give codes stable IDs, short definitions, and examples so their meanings do not drift into interchangeable labels.

The app should allow codes to be created, revised, merged, and reused. Changing a code must preserve or deliberately update references.

The relationship is:

```text
Job-description passage → code → candidate spins → experience / chapter
```

A proposed match should explain why the evidence is relevant. It may be direct, adjacent, missing, or unresolved. A single numerical match score is not necessary for the initial version.

### Applications and CV drafts

An application records its opportunity/job description and the chapters and spins selected for the draft, including their order.

Save the exact selected wording and relevant chapter facts as a snapshot, in addition to references. Updating a spin or correcting a chapter later must not silently rewrite the record of a previously sent CV.

The exact boundary between an application record and a reusable CV draft remains open: a draft may be useful for a recruiter or broader profile without a specific vacancy.

## Main workspaces

### 1. Timeline and story work

Select a chapter and inspect its facts and experience accounts. View source material alongside derived spins. Create or revise wording, assign codes, record qualifications, and mark wording reviewed.

Avoid forcing every useful note into a complicated schema before it can be saved. Narrative accounts can stay as Markdown while the stable facts live in JSON.

### 2. Opportunity analysis

Paste a job description, select passages, and assign codes. Retrieve relevant spins with their source context. Compare alternatives, reject weak matches, and identify where a new account or wording is needed.

This is inspired by qualitative coding workflows: interpreting passages and making explicit connections, rather than merely checking whether keywords occur.

### 3. Draft assembly

Select chapters, choose and order spins under each, and inspect the resulting emphasis and length. Show reviewed wording separately from new or changed wording. Help identify repetition or unsupported requirements.

Export a clean Markdown draft for final editing in HTML or Typst. Layout remains an editable finishing step.

## Review and AI behaviour

- Reusing reviewed wording should preserve it exactly unless a change is explicitly requested.
- Editing reviewed wording produces an unreviewed revision; do not silently carry approval over to changed text.
- AI can suggest codes, retrieve candidates, propose connections, draft wording, and ask targeted questions about missing information.
- Suggested material remains distinguishable from accepted analysis and reviewed wording.
- New generated claims must not be treated as facts merely because they appear in a draft.
- Source changes should flag potentially affected spins for review where a connection is known. Exact invalidation behaviour remains to be designed.
- No particular AI provider or integration mechanism has been selected. Manual workflows should remain usable without an AI service.

The intended improvement is that a new CV mostly reuses wording already checked, leaving the user to review selection, coherence, and a small amount of new material.

## Files and storage

JSON and Markdown are the source of truth. The app reads them, builds an in-memory index, provides editing/search/selection interfaces, validates changes, and writes them back.

A possible organisation, not a required schema:

```text
data/
  chapters/       # JSON: employment, study, and project entries
  stories/        # Markdown: experience accounts and context
  spins/          # Markdown: reusable wording and metadata
  codes/          # Code definitions with IDs
  opportunities/  # Original job descriptions and annotations
  applications/   # Selections, ordering, and frozen snapshots
```

No database is needed initially. A disposable search index can be added later if querying becomes cumbersome, without introducing a second authoritative store.

The app should validate unique IDs and references, report broken relationships, and prevent silent loss of connected material. External file edits should not be overwritten without detecting that the content changed.

Git provides history, but app edits should not depend on automatic commits. Application snapshots preserve exactly what was used without requiring the user to reconstruct a historical checkout.

## Profiles

Profiles can be selections of related claims and spins, sharing the same history. They need not become separate professional identities.

For example, the same experience may support a profile focused on delivering business features, changing existing systems, or improving developer tools. Domain experience and technologies help explain fit; they do not have to define the whole profile.

## First useful milestone

Build one complete path through the workflow:

1. Create a job chapter with an ID and JSON facts.
2. Add one experience account.
3. Create and review three spins with different emphases.
4. Add one job description and code its requirements.
5. Find and select the relevant spins.
6. Assemble a draft grouped under timeline chapters.
7. Export Markdown and save the exact draft snapshot.
8. Reuse a reviewed spin for a second opportunity without rewriting it.

The test is whether this reduces repeated reading and editorial work compared with searching notes and editing HTML directly.

Unit tests should cover meaningful parsing, reference validation, selection, and snapshot behaviour. Component tests can cover editing and review interactions. Browser-level tests can follow once there is a complete workflow worth exercising.

## Deferred work and open questions

- How should annotations remain attached to passages when source text changes? IDs alone do not solve passage anchoring.
- How much structure should experience accounts have before it becomes burdensome?
- Should wording variants be separate spins or variants within a spin?
- Which operations genuinely benefit from AI?
- What minimal metadata makes a draft easy to convert to HTML or Typst?
- Final pagination, a full document designer, hosting, accounts, multi-user features, and broad automatic repository ingestion are outside the first milestone.

Start with selected source material. Do not automatically ingest every historical CV and AI discussion as equally reliable evidence.
