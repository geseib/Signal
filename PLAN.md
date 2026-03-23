# Signal - Interview Workshop Design Plan

## Overview
An interactive, web-based workshop for learning better interview techniques, modeled after the design patterns in [geseib/iknowgenai](https://github.com/geseib/iknowgenai). Deployed on **Vercel**. Built with **React + Vite**.

---

## Tech Stack
- **React 19** + **Vite 7** (matching iknowgenai pattern)
- **Phosphor Icons** for iconography
- **Inline CSS / CSS Modules** (no heavy framework)
- **Vercel** for deployment (static site, zero backend)
- Fully client-side, no API dependencies

---

## Content Architecture

### Foundational Framework: Amazon Interview Methodology
The workshop builds on proven Amazon interviewing techniques as scaffolding, then broadens to universal skills.

### Group 1 — Foundations (The "Why")
1. **Why Interviews Fail** — Common pitfalls for both interviewers and candidates; the cost of bad hires
2. **The Bar Raiser Philosophy** — What it means to raise the bar with every hire; calibration thinking
3. **Behavioral vs. Technical** — Understanding the two dimensions and why behavioral matters more than most think

### Group 2 — The STAR Method Deep Dive
4. **Situation** — Setting the scene: context, constraints, stakes
5. **Task** — Defining your specific role and responsibility (not the team's)
6. **Action** — The core: what YOU did, decisions YOU made, how YOU influenced
7. **Result** — Quantifiable outcomes, learnings, what you'd do differently
8. **STAR Practice Lab** — Interactive: break down sample stories, build your own, get structured feedback prompts

### Group 3 — Leadership Principles as Interview Lenses
9. **Principles Overview** — The 16 Amazon Leadership Principles as a thinking framework (applicable beyond Amazon)
10. **Mapping Stories to Principles** — Interactive: match your experiences to principles; one story can demonstrate multiple
11. **Probing & Follow-ups** — The art of going deeper: "Tell me more", "What would you do differently?", "What was the hardest part?"

### Group 4 — Interviewer Skills
12. **Writing Great Questions** — Open-ended, behavioral, principle-aligned question design
13. **Active Listening & Note-Taking** — Capturing signal vs. noise during an interview
14. **Avoiding Bias** — Structured evaluation to reduce bias; calibration techniques
15. **The Debrief** — How to present your assessment, defend your vote, and make a hire/no-hire decision

### Group 5 — Putting It Together
16. **Mock Interview Walkthrough** — Animated/interactive walkthrough of a full interview loop
17. **Self-Assessment & Checklist** — Knowledge check quiz + personal readiness assessment

---

## Interactive Modes (matching iknowgenai pattern)

| Mode | Description |
|------|-------------|
| **Workshop Mode** | Facilitator-led pacing with discussion prompts and group exercises |
| **Solo Mode** | Self-directed learning at your own pace |
| **Presentation Mode** | Full-screen slides, keyboard navigation, optimized for projection |
| **Focus Mode** | Minimal UI, content-only view |

---

## Interactive Components

- **STAR Builder** — Guided form to construct STAR stories; saves locally
- **Principle Matcher** — Drag-and-drop matching stories to leadership principles
- **Question Generator** — Given a principle, generates example behavioral questions
- **Interview Simulator** — Step-through a mock interview with decision points
- **Signal Strength Meter** — Rate interview answers on data/specificity/ownership dimensions
- **Glossary** — Key terms (Bar Raiser, Loop, Debrief, Writeup, etc.)
- **Knowledge Check** — Quiz with scenario-based questions and feedback

---

## Project Structure

```
Signal/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                    # Main app with routing/mode management
│   ├── main.jsx                   # Entry point
│   ├── components/
│   │   ├── Navigation.jsx         # Section navigation sidebar
│   │   ├── ModeSelector.jsx       # Workshop/Solo/Presentation/Focus toggle
│   │   ├── Header.jsx             # App header with branding
│   │   └── ProgressBar.jsx        # Section progress indicator
│   ├── sections/
│   │   ├── S01_WhyInterviewsFail.jsx
│   │   ├── S02_BarRaiserPhilosophy.jsx
│   │   ├── S03_BehavioralVsTechnical.jsx
│   │   ├── S04_Situation.jsx
│   │   ├── S05_Task.jsx
│   │   ├── S06_Action.jsx
│   │   ├── S07_Result.jsx
│   │   ├── S08_STARPracticeLab.jsx
│   │   ├── S09_PrinciplesOverview.jsx
│   │   ├── S10_MappingStories.jsx
│   │   ├── S11_ProbingFollowups.jsx
│   │   ├── S12_WritingQuestions.jsx
│   │   ├── S13_ActiveListening.jsx
│   │   ├── S14_AvoidingBias.jsx
│   │   ├── S15_TheDebrief.jsx
│   │   ├── S16_MockInterview.jsx
│   │   └── S17_SelfAssessment.jsx
│   ├── interactive/
│   │   ├── STARBuilder.jsx
│   │   ├── PrincipleMatcher.jsx
│   │   ├── QuestionGenerator.jsx
│   │   ├── InterviewSimulator.jsx
│   │   ├── SignalStrengthMeter.jsx
│   │   └── KnowledgeCheck.jsx
│   ├── data/
│   │   ├── leadershipPrinciples.js
│   │   ├── sampleQuestions.js
│   │   ├── sampleStories.js
│   │   ├── glossary.js
│   │   └── quizQuestions.js
│   └── utils/
│       ├── animations.js
│       └── localStorage.js
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## Vercel Deployment

- `vercel.json` with SPA rewrite rules
- Build command: `npm run build`
- Output directory: `dist`
- Zero-config deployment via Vercel CLI or GitHub integration

---

## Implementation Phases

### Phase 1 — Scaffold & Core Shell
- Vite + React project setup
- App shell with mode selector, navigation, header
- Vercel config
- First 3 sections (Group 1) with content

### Phase 2 — STAR Deep Dive (Group 2)
- Sections 4-8
- STAR Builder interactive component
- Practice Lab with guided exercises

### Phase 3 — Leadership Principles (Group 3)
- Sections 9-11
- Principle Matcher interactive
- Leadership principles data

### Phase 4 — Interviewer Skills (Group 4)
- Sections 12-15
- Question Generator
- Signal Strength Meter

### Phase 5 — Capstone (Group 5)
- Mock Interview walkthrough
- Knowledge Check quiz
- Self-Assessment checklist
- Glossary

---

## Design Principles (from iknowgenai)
- **Big, clear, visible** — Optimized for projection and group settings
- **Content-first** — No unnecessary chrome; content drives the UI
- **Interactive scaffolding** — Modes adapt to context (workshop vs. self-study)
- **Zero friction** — No login, no backend, no setup; just open and learn
- **Factually grounded** — Real interview methodology, not generic advice
