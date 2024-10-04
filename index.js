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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
