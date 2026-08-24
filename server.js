import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static("."));

app.post("/api/study", async (req, res) => {
  const { question, mode = "explain" } = req.body ?? {};

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Please write a topic or question first." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server yet." });
  }

  const modes = {
    explain: "Explain the topic simply, using a small example when useful.",
    summarize: "Give a clear, short study summary with the most important points.",
    quiz: "Create 5 short quiz questions. Do not give answers until the student asks."
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a kind study helper. ${modes[mode] || modes.explain} Reply in the same language as the student.\n\nStudent's question: ${question.trim()}`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Gemini could not answer right now. Please try again." });
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    res.json({ answer: answer || "I could not create an answer. Please try again." });
  } catch {
    res.status(500).json({ error: "The AI request failed. Please try again in a moment." });
  }
});

app.listen(port, () => {
  console.log(`AI Study Helper is running on port ${port}`);
});
