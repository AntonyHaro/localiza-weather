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

// app.get("/cep/:cep", async (req, res) => {
//     const { cep } = req.params;
//     const url = `https://viacep.com.br/ws/${cep}/json/`;

//     try {
//         const response = await axios.get(url);
//         const data = response.data;

//         if (data.erro) {
//             return res.status(404).json({ error: "CEP não encontrado." });
//         }
//         res.json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Erro ao buscar o CEP. Tente novamente mais tarde.",
//         });
//     }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
