const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/test", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

app.get("/cep/:cep", async (req, res) => {
    const { cep } = req.params;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.erro) {
            return res.status(404).json({ error: "CEP não encontrado." });
        }
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Erro ao buscar o CEP. Tente novamente mais tarde.",
        });
    }
});

app.post("/city/:city", async (req, res) => {
    const { city } = req.params;
    const url = "https://api.openai.com/v1/chat/completions";

    try {
        const response = await axios.post(
            url,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Você é um assistente útil." },
                    {
                        role: "user",
                        content: `Descreva a cidade ${city} em 50 palavras. Não minta.`,
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
        const data = response.choices[0].message.content;
        res.json({ data });
    } catch (error) {
        console.log("Erro na solicitação:", error);
        res.status(500).send("Erro ao processar a solicitação");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
