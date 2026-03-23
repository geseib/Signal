# Signal - Interview Workshop Design Plan

## Overview
An interactive, web-based workshop for learning better interview techniques, modeled after [geseib/ibuildwithgenai](https://github.com/geseib/ibuildwithgenai). Deployed on **Vercel**. Built with **Docusaurus 3.7 + React + TypeScript** — the same stack as ibuildwithgenai.

---

## Tech Stack (matching ibuildwithgenai)
- **Docusaurus 3.7** (static site generator with MDX content)
- **React 18 + TypeScript**
- **Zustand** (localStorage-based progress tracking, XP/badges)
- **Framer Motion** (animations)
- **Vitest + Playwright** (testing)
- **Vercel** for deployment
- **Optional**: Anthropic API via serverless function for AI-powered evaluation (ComprehensionCheck pattern)

### Design System (inherited from ibuildwithgenai)
- **Fonts**: Fredoka (headings), Inter (body), JetBrains Mono (code)
- **Color DNA**: Cyan (#00bbf9), Pink (#f15bb5), Purple (#9b5de5), Green (#06d6a0), Yellow (#fee440)
- **Glass-morphism** surfaces with blur/transparency
- **Responsive** font scaling via CSS `clamp()`
- **Dark mode** enabled by default

---

## Content Architecture

### Foundational Framework: Amazon Interview Methodology
The workshop builds on proven Amazon interviewing techniques as scaffolding, then broadens to universal skills. Each section follows the **Learn-Do-Check** pattern from ibuildwithgenai:
- **Learn** (2-4 min): Brief conceptual instruction
- **Do** (5-8 min): Hands-on exercises and practice
- **Check**: Interactive Quiz/ComprehensionCheck components

### Workshop 101 — Foundations & the STAR Method (Guided, ~120 min)
| # | Section | Time | Learning Goal |
|---|---------|------|---------------|
| 1 | **Why Interviews Fail** | 15 min | Identify common pitfalls for interviewers and candidates; understand the cost of bad hires |
| 2 | **The Bar Raiser Philosophy** | 15 min | Explain what "raising the bar" means and how calibration thinking improves hiring |
| 3 | **Behavioral vs. Technical** | 15 min | Distinguish behavioral and technical dimensions; explain why behavioral matters |
| 4 | **The STAR Method: Situation** | 10 min | Set context with constraints, stakes, and scope |
| 5 | **The STAR Method: Task** | 10 min | Define YOUR specific role and responsibility (not the team's) |
| 6 | **The STAR Method: Action** | 10 min | Articulate what YOU did, decisions YOU made, how YOU influenced |
| 7 | **The STAR Method: Result** | 10 min | Deliver quantifiable outcomes, learnings, and retrospective thinking |
| 8 | **STAR Practice Lab** | 20 min | Build complete STAR stories from personal experience using the STAR Builder |
| 9 | **Your First Mock Answer** | 15 min | Deliver a full STAR answer and self-evaluate using the Signal Strength Meter |

### Workshop 201 — Leadership Principles & Interviewer Skills (Supported, ~120 min)
| # | Section | Time | Learning Goal |
|---|---------|------|---------------|
| 1 | **Leadership Principles Overview** | 15 min | Understand the 16 Amazon LPs as a thinking framework (applicable beyond Amazon) |
| 2 | **Mapping Stories to Principles** | 20 min | Match personal experiences to principles; demonstrate one story → multiple LPs |
| 3 | **Probing & Follow-ups** | 15 min | Master the art of going deeper: "Tell me more", "What would you do differently?" |
| 4 | **Writing Great Questions** | 15 min | Design open-ended, behavioral, principle-aligned interview questions |
| 5 | **Active Listening & Note-Taking** | 15 min | Capture signal vs. noise during an interview |
| 6 | **Avoiding Bias** | 15 min | Apply structured evaluation to reduce bias; calibration techniques |
| 7 | **The Debrief** | 15 min | Present your assessment, defend your vote, make a hire/no-hire decision |
| 8 | **Capstone: Run a Practice Debrief** | 20 min | Conduct a simulated debrief using provided interview notes |

### Workshop 301 — Advanced & Real-World Application (Independent, ~90 min)
| # | Section | Time | Learning Goal |
|---|---------|------|---------------|
| 1 | **The Full Interview Loop** | 15 min | Understand loop structure, role assignments, and phone screen vs. onsite |
| 2 | **Competency Frameworks Beyond Amazon** | 15 min | Adapt LP-style thinking to Google, Meta, startup, and general frameworks |
| 3 | **Technical Interview Integration** | 15 min | Weave behavioral signals into system design and coding interviews |
| 4 | **Difficult Interview Scenarios** | 15 min | Handle incomplete answers, red flags, nervous candidates, and senior-level ambiguity |
| 5 | **Building an Interview Story Bank** | 15 min | Curate 8-12 versatile stories covering multiple principles |
| 6 | **Capstone: Full Mock Interview** | 30 min | Interactive walkthrough of a complete interview with decision points |

### Specialty Content
- **For Hiring Managers**: Headcount planning, job descriptions, recruiter partnership
- **Interview Ethics**: Fairness, accommodations, legal considerations
- **Self-Assessment & Readiness Check**: Knowledge check quiz + personal readiness scoring

---

## Interactive Components (MDX, globally available)

Matching the ibuildwithgenai pattern of reusable MDX components:

| Component | Description | Inspired By |
|-----------|-------------|-------------|
| **Quiz** | Multiple-choice with explanations and XP rewards | Quiz.tsx |
| **ComprehensionCheck** | Free-response with optional AI rubric evaluation | ComprehensionCheck.tsx |
| **Checklist** | Track completion of multi-step exercises | Checklist.tsx |
| **STARBuilder** | Guided form to construct STAR stories; saves to localStorage | New |
| **PrincipleMatcher** | Drag-and-drop: match stories to leadership principles | New |
| **SignalStrengthMeter** | Rate interview answers on data/specificity/ownership dimensions | New |
| **InterviewSimulator** | Step-through mock interview with branching decision points | New |
| **QuestionGenerator** | Given a principle, surface example behavioral questions | New |
| **LearnDoCheck** | Section wrapper with timing (directly from ibuildwithgenai) | LearnDoCheck |

---

## Progress System (matching ibuildwithgenai)
- **XP points** earned through quizzes, exercises, and completions
- **Badges** for workshop milestones (e.g., "STAR Storyteller", "Bar Raiser Ready", "Debrief Pro")
- **localStorage-based** — no auth required
- **Progress dashboard** page showing completion across all workshops
- Zustand store for state management

---

## Project Structure

```
Signal/
├── api/
│   └── evaluate.ts                  # Vercel serverless: AI evaluation endpoint
├── docs/
│   ├── workshop-101/
│   │   ├── _category_.json
│   │   ├── index.mdx
│   │   ├── 01-why-interviews-fail.mdx
│   │   ├── 02-bar-raiser-philosophy.mdx
│   │   ├── 03-behavioral-vs-technical.mdx
│   │   ├── 04-star-situation.mdx
│   │   ├── 05-star-task.mdx
│   │   ├── 06-star-action.mdx
│   │   ├── 07-star-result.mdx
│   │   ├── 08-star-practice-lab.mdx
│   │   └── 09-first-mock-answer.mdx
│   ├── workshop-201/
│   │   ├── _category_.json
│   │   ├── index.mdx
│   │   ├── 01-leadership-principles-overview.mdx
│   │   ├── 02-mapping-stories-to-principles.mdx
│   │   ├── 03-probing-and-followups.mdx
│   │   ├── 04-writing-great-questions.mdx
│   │   ├── 05-active-listening.mdx
│   │   ├── 06-avoiding-bias.mdx
│   │   ├── 07-the-debrief.mdx
│   │   └── 08-capstone-practice-debrief.mdx
│   ├── workshop-301/
│   │   ├── _category_.json
│   │   ├── index.mdx
│   │   ├── 01-full-interview-loop.mdx
│   │   ├── 02-frameworks-beyond-amazon.mdx
│   │   ├── 03-technical-interview-integration.mdx
│   │   ├── 04-difficult-scenarios.mdx
│   │   ├── 05-building-story-bank.mdx
│   │   └── 06-capstone-full-mock.mdx
│   ├── specialty/
│   │   ├── hiring-managers.mdx
│   │   ├── interview-ethics.mdx
│   │   └── self-assessment.mdx
│   └── guides/
│       ├── facilitator-guide.mdx
│       └── contributor-guide.mdx
├── src/
│   ├── components/
│   │   ├── display/               # Badge, ProgressBar, etc.
│   │   ├── icons/
│   │   ├── interactive/           # Quiz, ComprehensionCheck, Checklist,
│   │   │                          # STARBuilder, PrincipleMatcher,
│   │   │                          # SignalStrengthMeter, InterviewSimulator,
│   │   │                          # QuestionGenerator
│   │   └── navigation/
│   ├── context/                   # Environment/config context
│   ├── css/
│   │   └── custom.css             # Design system (Color DNA, glass-morphism, etc.)
│   ├── data/
│   │   ├── leadershipPrinciples.ts
│   │   ├── sampleQuestions.ts
│   │   ├── sampleStories.ts
│   │   ├── glossary.ts
│   │   └── quizData.ts
│   ├── hooks/                     # Custom React hooks
│   ├── pages/
│   │   ├── index.tsx              # Landing page with hero + workshop cards
│   │   └── progress.tsx           # Progress dashboard
│   ├── stores/
│   │   └── progressStore.ts       # Zustand: XP, badges, completion
│   ├── theme/                     # Docusaurus theme overrides
│   ├── types/
│   └── utils/
├── static/                        # Images, fonts, favicon
├── tests/
│   ├── unit/
│   └── e2e/
├── docusaurus.config.ts
├── sidebars.ts
├── vercel.json
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Vercel Deployment
- `vercel.json`: `{ "buildCommand": "npx docusaurus build", "outputDirectory": "build" }`
- Zero-config via Vercel GitHub integration
- Optional `ANTHROPIC_API_KEY` env var for AI evaluation

---

## Custom Admonitions (matching ibuildwithgenai pattern)
- **:::captain-tip** → **:::interviewer-tip** — Pro tips for interviewers
- **:::ethics-check** → **:::bias-alert** — Prompts to check for bias or fairness issues

---

## Implementation Phases

### Phase 1 — Scaffold & Core Shell
- Docusaurus project init with TypeScript
- Design system CSS (adapted from ibuildwithgenai Color DNA)
- Landing page with hero + workshop cards
- Sidebar navigation config
- Vercel deployment config
- Workshop 101 index + first 3 sections with Learn-Do-Check content

### Phase 2 — STAR Method (Workshop 101 continued)
- Sections 4-9
- STARBuilder interactive component
- SignalStrengthMeter component
- Quiz components with XP

### Phase 3 — Leadership & Interviewer Skills (Workshop 201)
- All 8 sections
- PrincipleMatcher interactive
- QuestionGenerator component
- Leadership principles data file

### Phase 4 — Advanced Workshop (301) & Specialty
- All 6 sections including Full Mock capstone
- InterviewSimulator with branching decisions
- Specialty content (hiring managers, ethics, self-assessment)

### Phase 5 — Progress System & Polish
- Zustand progress store
- XP + badge system
- Progress dashboard page
- ComprehensionCheck with AI evaluation (serverless function)
- Testing (Vitest unit + Playwright e2e)

---

## Design Principles
- **Learn-Do-Check** — Every section follows the same pedagogical pattern
- **Captain, Not Passenger** → **Interviewer, Not Spectator** — You drive the process
- **Content-first** — MDX content drives the UI; no unnecessary chrome
- **Zero friction** — No login, no backend dependency for core features
- **Factually grounded** — Real interview methodology from Amazon, not generic advice
- **Progressive scaffolding** — 101 (guided) → 201 (supported) → 301 (independent)
