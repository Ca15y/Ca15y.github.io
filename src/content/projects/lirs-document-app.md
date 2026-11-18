---
title: Tax document preparation app
summary: An internal application designed and built for the Lagos State Internal Revenue Service (Iganmu station) that standardises how four types of tax document are prepared.
headlineFacts:
  - 4 document types standardised
  - Batch input to print-ready PDF
stack:
  - TypeScript
  - React
  - Vite
  - react-pdf
  - pdf-lib
  - Zod
  - Vitest
  - Playwright
  - Cloudflare Workers
  - GitHub Actions
status: internal
category: software
order: 1
links:
  code: https://github.com/Ca15y/assessment-desk
# Words only: no screenshots, real documents or internal data. Repository is public (confirmed by owner, 2026-11-15).
problem: Staff at the Iganmu station prepare four kinds of tax document. Each one has to fit on a single portrait A4 page, Demand Notices need the same penalty and interest calculation every time, and the documents carry taxpayer details. I built the app from the staff's requirements so documents come out the same way every time, without sending anything to a server.
architecture:
  caption: Everything runs in the browser. There is no backend or database, and form data is never sent over the network.
  tiers:
    - - label: staff browser
        detail: one form, or an Excel batch
    - - label: validation
        detail: Zod schemas; bad rows block export
        accent: true
    - - label: PDF render
        detail: react-pdf; must be one A4 page
    - - label: download
        detail: PDF, ZIP of PDFs, or project file
# TODO(israel): confirm the "why" lines below. The decisions come from docs/decisions.md and docs/architecture.md.
decisions:
  - decision: Reject a document that overflows one A4 page instead of clipping or shrinking it.
    why: Clipped or shrunken output can look fine on screen and still be wrong on paper. Blocking the download makes the problem visible.
  - decision: No backend, no database and no stored taxpayer data.
    why: Documents are processed in browser memory and only leave as files the user chooses to download.
  - decision: Calculate money in whole kobo with integer arithmetic, rounding each charge up.
    why: Upward rounding was the station's rule, and integers avoid floating-point rounding errors.
  - decision: Make Excel batches all-or-nothing.
    why: A partly generated batch is easy to miss. If any row fails, both exports stay disabled.
  - decision: Promote releases by hand.
    why: A version goes live only after GitHub CI and the Cloudflare build are confirmed to be the same commit.
next:
  - Deploy the hosted staff pilot and verify it.
  - Check the output on the station's printer.
  - Add editor sign-in and template publishing.
note: Built for internal use at the Lagos State Internal Revenue Service, so there are no screenshots, real documents or taxpayer data here.
---

- **Four document forms.** Staff fill in a form, preview the actual generated PDF and download it.
- **Demand Notices** calculate the penalty and interest automatically. The calculation rule is versioned, so a saved project always reopens with the rule it was made with.
- **Excel batches** for Notes to Assessment use a prescribed workbook. Every row is validated and errors are reported with the spreadsheet row number. Output is one combined PDF or a ZIP of individual PDFs.
- **One-page check.** Every PDF is checked for exactly one portrait A4 page before it can be downloaded.
- **Project files.** Work can be saved as a JSON project file and reopened later. Files are validated against a strict schema, and an invalid file leaves the current form untouched.
- **Tests.** Vitest covers the logic. Playwright browser tests cover downloads, saving and reopening projects, invalid imports, overflow blocking, the phone layout and signing out. GitHub Actions runs the checks.
- **Hosting.** Hosting is prepared for Cloudflare Workers Static Assets behind Cloudflare Access, with manual promotion of each release. The hosted pilot itself is still pending.
