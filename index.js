const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/submit-form", async (req, res) => {
    const { cargo } = req.body;

    try {
        const response = await axios.post(
            process.env.API_URL,
            new URLSearchParams({
                cargo,
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        res.redirect("/success.html");
    } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        res.redirect("/error.html");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
