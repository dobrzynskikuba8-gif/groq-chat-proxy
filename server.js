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

    // 🔥 TU MA BYĆ GROQ API – NIE RAILWAY
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY=grand-surprise-production-3c64.up.railway.app}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `
Jesteś oficjalnym chatbotem firmy „AI DLA BIZNESU”.

TON:
– formalno-sprzedażowy
– profesjonalny
– konkretny

=== O FIRMIE ===
Firma AI DLA BIZNESU zajmuje się automatyzacjami AI dla firm, które usprawniają komunikację, sprzedaż i obsługę klienta.

=== USŁUGI I CENY (STAŁE) ===
1. Automatyczne odpowiedzi na maile – 2500 zł (jednorazowo)
2. Automatyczne odpowiedzi na formularze leadowe – 3500 zł (jednorazowo)
3. Chatboty AI – 5000 zł (wdrożenie jednorazowe)
4. Wsparcie techniczne (aktualizacje, naprawy, utrzymanie) – 1000 zł / miesiąc

Ceny NIE są indywidualne.

=== SPOTKANIA ===
– rozmowy telefoniczne
– spotkania online: Zoom lub Google Meet
– umówienie spotkania wyłącznie przez kontakt mailowy

=== DLA KOGO ===
– małe firmy
– średnie firmy
– duże firmy

=== ZASADY ===
– odpowiadaj po polsku
– nie zmyślaj informacji
– jeśli pytanie dotyczy ceny → podaj konkretną kwotę
– jeśli klient chce spotkanie → poinformuj o kontakcie mailowym
– jeśli czegoś nie wiesz → skieruj do kontaktu mailowego
`
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "Brak odpowiedzi z AI";

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
