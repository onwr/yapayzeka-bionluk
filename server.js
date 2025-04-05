// Gerekli Modülleri Dahil Et
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Etik Değerler ve Modelleri Dahil Et
const { ethicalSystemMessage } = require("./etikValues");

// Uygulama Oluştur
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ OpenAI API Anahtarı (Direkt buradan)
const apiKey = process.env.OPENAI_API_KEY;

app.get("/api/brand-tracking/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const brands = await BrandTracking.find({ userId });
    res.json(brands);
  } catch (error) {
    console.error("Marka Takibi Hatası:", error);
    res.status(500).json({ error: "Marka takibi alınırken hata oluştu" });
  }
});

// Chat Endpoint'i
app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          ethicalSystemMessage,
          { role: "user", content: req.body.message },
        ],
        max_tokens: 750,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Chatbot Hatası:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI API hatası" });
  }
});

// ✅ Sunucu Başlat
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu Çalışıyor: http://localhost:${PORT}`);
});
