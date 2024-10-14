const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// test endpoint
app.get("/test", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

// endpoint to generate the description from the param city using the openAI api
app.post("/city/:city", async (req, res) => {
    const { city } = req.params;
    const url = "https://api.openai.com/v1/chat/completions";
    const apiKey = process.env.OPENAI_API_KEY;

    try {
        const response = await axios.post(
            url,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Você é um assistente útil." },
                    {
                        role: "user",
                        content: `Descreva a cidade ${city} em 70 palavras. Não minta.`,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.log("Erro na solicitação:", error);
        res.status(500).send("Erro ao processar a solicitação");
    }
});

app.get("/weather/:city", async (req, res) => {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.log("Erro na solicitação:", error);
        res.status(500).send("Erro ao processar a solicitação");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
