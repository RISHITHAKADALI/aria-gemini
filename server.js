const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.get("/", (req, res) => {
  res.json({ status: "ARIA server is running!" });
});
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { history, message, systemPrompt } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.choices?.[0]?.message?.content || "I couldn't process that request.";
    res.json({ text });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✦ ARIA server running on http://localhost:${PORT}`);
  console.log(`🔑 API Key loaded: ${process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.slice(0,8) + "..." : "NOT FOUND"}`);
});