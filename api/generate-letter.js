// Vercel Serverless Function (Node.js runtime)
// POST /api/generate-letter
// Body: { company, role, jobDescription, resumeBullets }
// Calls Google's Gemini API server-side so the API key is never exposed to the browser.

const SYSTEM_PROMPT = `You are a career-writing assistant for Pakistani computer science students and new grads applying to software engineering, QA, and data/analytics internships and jobs.

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
- Output ONLY the letter text. No preamble, no notes, no markdown formatting, no quotation marks around it.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing GEMINI_API_KEY. Add it in Vercel → Project → Settings → Environment Variables, then redeploy." });
    return;
  }

  const { company, role, jobDescription, resumeBullets } = req.body || {};

  if (!resumeBullets || !resumeBullets.trim()) {
    res.status(400).json({ error: "No resume bullets provided." });
    return;
  }
  if (!jobDescription || !jobDescription.trim()) {
    res.status(400).json({ error: "This application has no job description attached." });
    return;
  }

  const userMessage = `Company: ${company || "Unknown"}
Role: ${role || "Unknown"}

Job description:
${jobDescription}

My resume bullet points:
${resumeBullets}

Write the cover letter now.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 700,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const message = data?.error?.message || `Gemini request failed (${geminiRes.status})`;
      res.status(502).json({ error: message });
      return;
    }

    const letter = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();

    if (!letter) {
      res.status(502).json({ error: "Gemini returned an empty response. Try regenerating." });
      return;
    }

    res.status(200).json({ letter });
  } catch (err) {
    res.status(500).json({ error: "Unexpected server error: " + err.message });
  }
};
