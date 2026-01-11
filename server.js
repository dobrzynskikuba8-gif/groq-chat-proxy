import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Brak wiadomości" });
    }

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

Firma oferuje:
- chatboty AI
- automatyzację procesów
- obsługę klienta
- wsparcie sprzedaży

Zasady:
- odpowiadaj po polsku
- odpowiadaj zgodnie z prawdą
- jeśli nie wiesz → skieruj do kontaktu
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
    const reply = data.choices?.[0]?.message?.content || "Brak odpowiedzi";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
