import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `
Jesteś oficjalnym chatbotem firmy AI DLA BIZNESU.
Odpowiadasz po polsku, zgodnie z prawdą.
Jeśli czegoś nie wiesz – kieruj do kontaktu.
`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
