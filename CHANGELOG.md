# Changelog

All notable changes to this project are recorded here, newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Add new entries under **Unreleased** as you work, then rename that heading to a date when you commit or release.

## [Unreleased]

### Added
- **Week-driven Overview.** `/dashboard/:week` shows the selected week's term, learning activities, sessions and "next action". `/dashboard` still shows the current week (7).
- **`frontend/src/data/courseWeeks.js`**: one data file holding the term, activities, sessions, dates and hero for all 20 weeks. Weeks other than 7 use generated placeholder sessions (08:00 lecture, 10:30 lab, 14:00 consultation) and due dates (Saturday, 11:59 PM PHT); replace them with the real timetable.
- **Week overview** button on the Course Map, next to **Open lesson**.
- **`attention` lesson figure**: query, keys, values, dot products, softmax weights α and the weighted-sum output, computed live. Choose the query word and toggle √d scaling.
- **`equation` lesson figure**: a formula whose symbols can be selected for a plain-language meaning, with an optional worked example.
- Both figures are documented in `docs/LESSON_FORMAT.md` and checked by `tools/validate-lessons.mjs`.
- Week 8 lesson: an equation figure (scaled dot-product attention, worked example for "apple") and an attention diagram for "I am eating an apple".
- **Lab steps are easier to scan.** In lesson plans, numbered lab steps show a large green number badge (the numbering still restarts correctly after each code block) and a bold step title. Code boxes and exercises sit indented under their step.
- **Exercise callouts.** A paragraph that starts with `*Exercise N:*` in a lesson file becomes an amber callout with an "Exercise N" badge, so it stands out when skimming.

### Changed
- **Lesson text width matches Week 7.** In the Markdown lessons the reading column is now 60rem (the page width on narrower screens), the same as the built-in Week 7 lesson, so text runs about as wide as the figures. It was 41rem, which left text noticeably narrower than the figures. Lab steps and exercise callouts follow the same width.
- **Larger type in the Markdown lessons (Weeks 1–6, 8–20).** Body text 17 → 18.5 px, lab steps and lists 16 → 17.5 px, captions and detail text 15 → 16.5 px, subheadings 18.5 → 20.5 px, code 12.5 → 14 px, and 1–2 px more on the interactive figures, tables and quiz. The text column is a little wider (37 → 41 rem). The built-in Week 7 lesson keeps its original sizes.
- Overview page (`Main.jsx`) no longer hardcodes Week 7: header, hero, activities, sessions, schedule pop-up and lesson card all read from the week data.
- Lesson page header shows "Week N of 20" and the term for `/lesson/N`.

### Known gaps
- The Upcoming requirements and Alerts pop-ups on the Overview are still Week 7 content.
- The "You are here" roadmap progress is fixed at Week 7 (`CURRENT_WEEK`).
- The built-in Week 7 lesson (`/lesson`) has no attention diagram yet.

## [0.1.0] - 2026-10-27

### Added
- Initial commit: AI Academy app (React + Vite frontend, Express backend, weekly lesson Markdown content).
