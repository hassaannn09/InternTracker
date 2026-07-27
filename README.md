# InternTrack

An application tracker for CS students, with an AI feature that writes a tailored cover letter for each job — using only your own resume, never invented facts.

## a. The problem

Applying for internships and jobs as a CS student in Pakistan means juggling applications across WhatsApp chats, random notes, and half-updated spreadsheets — it's easy to lose track of what stage an application is at, and to follow up too late or not at all. On top of that, writing a fresh, genuinely tailored cover letter for every posting takes real time, so most students either skip it or send the same generic paragraph everywhere, which recruiters can spot instantly.

**Who it's for:** CS/SE students and new grads applying to internships and entry-level roles — built around my own application process, but usable by anyone.

**What InternTrack solves:**
- One place to track every application and its stage (Applied → OA/Assessment → Interview → Offer/Rejected)
- One saved copy of your real resume bullet points
- An AI feature that turns any job description into a tailored cover letter built strictly from those bullet points, in seconds

## b. Live URL

**[https://interntrack.vercel.app](https://interntrack.vercel.app)** ← replace with your actual deployed URL after `vercel --prod`

## c. Features

- **Kanban board** with 5 stages: Applied, OA/Assessment, Interview, Offer, Rejected
- **Add / edit / delete** applications: company, role, job link, date applied, job description, notes
- **Live stats bar** showing total applications and a count per stage
- **Resume bullets panel** — paste your resume's experience/skills bullets once, reused for every AI cover letter
- **AI-generated cover letters** — one click per application (when a job description is attached) generates a tailored, ready-to-send cover letter
- **Copy to clipboard** and **regenerate** for any AI letter
- **Persistent storage** — everything is saved in the browser via `localStorage`, so your data survives refreshes and closing the tab
- **Fully responsive** — usable on mobile

## d. The AI feature

**What it does:** given a job description and the user's own saved resume bullet points, the AI writes a 180–260 word cover letter tailored to that specific role — picking the 2–3 most relevant bullets and explaining the fit in plain language, instead of a generic template.

**Model used:** Google Gemini (`gemini-2.5-flash`), called from a server-side Vercel function (`/api/generate-letter.js`) so the API key is never exposed in the browser.

**System prompt used (verbatim, from `api/generate-letter.js`):**

```
You are a career-writing assistant for Pakistani computer science students and new grads applying to software engineering, QA, and data/analytics internships and jobs.

You will be given:
1. The applicant's own resume bullet points (their real experience and skills).
2. A specific company, role, and job description they are applying to.

Write a tailored, professional cover letter of 180-260 words that:
- Opens with one specific line about why this role/company (inferred honestly from the job description, not generic flattery).
- Highlights the 2-3 resume bullets that most directly match what the job description asks for. Reference them naturally, don't just copy-paste them.
- Uses plain, confident, first-person language. No cliches like "I am a highly motivated individual" or "team player with excellent communication skills."
- Ends with a short, direct call to action (e.g. offering to discuss further, mentioning availability).

Hard rules:
- Never invent skills, experience, companies, degrees, or achievements that are not present in the resume bullets provided. If the resume bullets don't have a strong match for something the job asks for, do not fabricate one — just don't mention it.
- Do not use em dashes.
- Do not include a letterhead, date, or "Dear Hiring Manager" boilerplate block — start directly with the opening line of the letter body.
- Output ONLY the letter text. No preamble, no notes, no markdown formatting, no quotation marks around it.
```

The "never invent facts" rule is the important design decision here: the letter is grounded only in what the user actually put in their resume bullets, so it can't fabricate experience the student doesn't have.

## e. Tools, services, and models used

- **Frontend:** plain HTML, CSS, JavaScript (no framework, no build step)
- **Font:** Poppins (Google Fonts)
- **Backend:** a single Vercel Serverless Function (`api/generate-letter.js`, Node.js runtime)
- **AI model:** Google Gemini (`gemini-2.5-flash`) via the Gemini API
- **Storage:** browser `localStorage` (no database)
- **Hosting/deployment:** Vercel

## f. Screenshots

> Add at least 3 screenshots here before submitting, e.g.:

![Kanban board](screenshots/board.png)
![Add application form](screenshots/add-application.png)
![AI cover letter generated](screenshots/ai-letter.png)

## g. How to run this project

### Run locally
```bash
git clone https://github.com/<your-username>/interntrack.git
cd interntrack
npm install -g vercel   # if you don't already have it
vercel dev
```
Create a `.env` file (see `.env.example`) with:
```
GEMINI_API_KEY=your_key_here
```
Then open the local URL Vercel prints (usually `http://localhost:3000`).

### Deploy your own copy
1. Push this repo to your own public GitHub account.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. In the project's **Settings → Environment Variables**, add `GEMINI_API_KEY` with your own Gemini API key (get one at [aistudio.google.com](https://aistudio.google.com/apikey)).
4. Deploy. Vercel automatically detects the `/api` folder as serverless functions and serves `index.html` as the static site — no build configuration needed.

---
Built by Muhammad Hassaan.
