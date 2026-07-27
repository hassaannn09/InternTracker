# InternTrack

InternTrack is an AI-powered internship tracking application designed for Computer Science students. It helps students organize internship applications, monitor their progress, and generate personalized cover letters using AI based only on their own resume information.

---

# Problem Statement

Students often apply for internships through multiple platforms such as LinkedIn, company career pages, and referrals. Managing dozens of applications becomes difficult, making it easy to miss deadlines, interviews, or follow-ups.

InternTrack solves this problem by providing a centralized dashboard where students can track every application and instantly generate tailored cover letters for each opportunity.

**Target Users**
- Computer Science students
- Software Engineering students
- Fresh graduates
- Internship seekers

---

# Live Demo

**Live Application:** [interntrack.vercel.app](https://intern-tracker-seven.vercel.app/)

**GitHub Repository:** [github.com/hassaannn09/InternTracker/](github.com/hassaannn09/InternTracker/)

---

# Features

- Kanban board for internship tracking
- Track applications through multiple stages:
  - Applied
  - OA / Assessment
  - Interview
  - Offer
  - Rejected
- Add, edit, and delete applications
- Store:
  - Company
  - Position
  - Job Link
  - Date Applied
  - Job Description
  - Notes
- Dashboard statistics
- Resume bullet storage
- AI-generated personalized cover letters
- Copy generated letters to clipboard
- Regenerate cover letters
- Browser storage using LocalStorage
- Responsive design for desktop and mobile

---

# AI Feature

InternTrack includes an AI Career Assistant that generates professional cover letters for internship applications.

Instead of creating generic letters, the AI analyzes:

- The student's own resume bullet points
- The selected job description
- Company name
- Position

The generated letter is based **only on the information provided by the student**, ensuring that no experience or skills are fabricated.

### AI Model

Google Gemini 2.5 Flash

### Backend

Vercel Serverless Function (`/api/generate-letter.js`)

### System Prompt

The AI is instructed to:

- Generate professional cover letters
- Use only resume information supplied by the user
- Never invent skills or experience
- Match the cover letter with the job description
- Keep responses concise and professional

---

# Tech Stack

## Frontend

- HTML
- CSS
- JavaScript

## Backend

- Node.js
- Vercel Serverless Functions

## AI

- Google Gemini 2.5 Flash API

## Storage

- Browser LocalStorage

## Deployment

- Vercel

---

# Screenshots

Add screenshots before submission.

Suggested screenshots:

1. Landing Page
2. Internship Dashboard
3. Add Application Form
4. AI Cover Letter Generator
5. Kanban Board

Example:

```
screenshots/
├── dashboard.png
├── add-application.png
├── kanban.png
├── ai-cover-letter.png
```

---

# Running the Project

Clone the repository:

```bash
git clone https://github.com/hassaannn09/InternTracker.git
cd InternTracker
```

Install Vercel CLI:

```bash
npm install -g vercel
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Start the development server:

```bash
vercel dev
```

Open:

```
http://localhost:3000
```

---

# Deployment

Deploy using Vercel.

Add the following Environment Variable:

```
GEMINI_API_KEY
```

No API keys are stored in the repository.

---

# Author

**Muhammad Hassaan**

---

## License

This project was developed as a university Final AI Project.
