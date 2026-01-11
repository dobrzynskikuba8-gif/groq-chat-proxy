import express from "express";

const app = express();
app.use(express.json());

// Endpoint do chat
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Brak wiadomości w żądaniu" });
    }

    // Wywołanie API Groq Chat
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

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    // Zwracamy odpowiedź
    const reply = data.choices?.[0]?.message?.content || "Brak odpowiedzi z API";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
});

// Start serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});
