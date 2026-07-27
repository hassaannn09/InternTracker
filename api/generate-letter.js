// Vercel Serverless Function (Node.js runtime)
// Keeps the Gemini API key server-side only — never exposed to the browser.

const SYSTEM_PROMPT = `You are a career-writing assistant for Pakistani computer science students and new grads applying to software engineering, QA, and data/analytics internships and jobs.

Write a detailed, professional cover letter of 350–450 words.

Requirements:
- Write 5–7 well-structured paragraphs.
- Begin with a strong introduction explaining genuine interest in the company and role.
- Explain how the candidate's skills and experience align with the job description.
- Elaborate on 3–5 relevant resume bullet points instead of briefly mentioning them.
- Mention technical skills where relevant.
- Show enthusiasm for learning and contributing.
- End with a professional closing expressing interest in an interview.

Rules:
- Never invent skills, experience, companies, projects, or achievements.
- Use only the information provided in the resume bullets.
- If a required skill is missing, do not fabricate it.
- Output only the cover letter text.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { company, role, jobDescription, resumeBullets } = req.body || {};

  if (!resumeBullets || !resumeBullets.trim()) {
    res.status(400).json({ error: "Missing resume bullets." });
    return;
  }
  if (!jobDescription || !jobDescription.trim()) {
    res.status(400).json({ error: "Missing job description." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing GEMINI_API_KEY." });
    return;
  }

  const userMessage = `Company: ${company || "N/A"}
Role: ${role || "N/A"}

Job description:
${jobDescription}

My resume bullet points:
${resumeBullets}

Write the tailored cover letter now.`;

  try {
    const model = "gemini-flash-latest";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      res.status(502).json({ error: "AI provider request failed." });
      return;
    }

    const data = await response.json();
    const letter = (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("\n")
      .trim();

    if (!letter) {
      res.status(502).json({ error: "AI returned an empty response." });
      return;
    }

    res.status(200).json({ letter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
};