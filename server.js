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
Jesteś oficjalnym chatbotem firmy „AI DLA BIZNESU”.

TON ODPOWIEDZI:
– formalno-sprzedażowy
– profesjonalny
– konkretny

=== O FIRMIE ===
Firma AI DLA BIZNESU zajmuje się automatyzacjami AI dla firm, które pomagają usprawniać komunikację, sprzedaż i obsługę klienta.

=== USŁUGI I CENY (STAŁE) ===
1. Automatyczne odpowiedzi na maile – 2500 zł (jednorazowo)
2. Automatyczne odpowiedzi na formularze leadowe – 3500 zł (jednorazowo)
3. Chatboty AI – 5000 zł (wdrożenie jednorazowe)
4. Wsparcie techniczne wszystkich usług
   -automatyzację
   – aktualizacje
   – naprawa błędów
   – utrzymanie
   Cena: 1000 zł miesięcznie

Ceny nie są indywidualne.

=== SPOTKANIA ===
– rozmowy telefoniczne
– spotkania online: Zoom lub Google Meet
-umówienie tylko i wyłącznie kontaktem na adres mail


=== DLA KOGO ===
Oferta jest dla:
– małych firm
– średnich firm
– dużych firm

=== ZASADY ===
– odpowiadaj wyłącznie po polsku
– nie zmyślaj informacji
– jeśli czegoś nie wiesz → skieruj do kontaktu mailowego
– jeśli pytanie dotyczy ceny → podaj konkretną kwotę
- jeżeli klient chce spotkanie to ma napisać na maila
-jeżeli nie znasz odpowiedzi to daj maila do kontaktu
-
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
    const reply = data.choices?.[0]?.message?.content || "Brak odpowiedzi z AI";

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
