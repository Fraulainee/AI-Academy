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

### Changed
- Overview page (`Main.jsx`) no longer hardcodes Week 7: header, hero, activities, sessions, schedule pop-up and lesson card all read from the week data.
- Lesson page header shows "Week N of 20" and the term for `/lesson/N`.

### Known gaps
- The Upcoming requirements and Alerts pop-ups on the Overview are still Week 7 content.
- The "You are here" roadmap progress is fixed at Week 7 (`CURRENT_WEEK`).
- The built-in Week 7 lesson (`/lesson`) has no attention diagram yet.

## [0.1.0] - 2026-10-27

### Added
- Initial commit: AI Academy app (React + Vite frontend, Express backend, weekly lesson Markdown content).
