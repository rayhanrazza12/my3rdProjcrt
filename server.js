import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static("."));

app.post("/api/study", async (req, res) => {
  const { question, mode = "explain" } = req.body ?? {};

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "Please write a topic or question first." });
  }

  if (question.length > 3_000) {
    return res.status(400).json({ error: "Please keep your question under 3,000 characters." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set on the server yet." });
  }

  const modeInstructions = {
    explain: "Explain the topic simply, using a small example when useful.",
    summarize: "Give a clear, short study summary with the most important points.",
    quiz: "Create 5 short quiz questions. Do not give answers until the student asks."
  };

  const instruction = modeInstructions[mode] ?? modeInstructions.explain;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: `You are a kind study helper. ${instruction} Use plain language. Reply in the same language as the student's question.`,
      input: question.trim()
    });

    res.json({ answer: response.output_text || "I could not create an answer. Please try again." });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    res.status(500).json({ error: "The AI request failed. Please try again in a moment." });
  }
});

app.listen(port, () => {
  console.log(`AI Study Helper is running on port ${port}`);
});
