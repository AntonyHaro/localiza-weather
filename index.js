import express from "express";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// endpoint to get the city description from the openAI API
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
                        content: `Descreva a cidade ${city} em 60 palavras. Não minta.`,
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

// endpoint to get the current weather and the forecast
app.get("/currentWeather/:city", async (req, res) => {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;
    const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        const currentResponse = await axios.get(currentWeatherUrl);
        const currentData = currentResponse.data;

        const forecastResponse = await axios.get(hourlyForecastUrl);
        const forecastData = forecastResponse.data;

        const hourlyForecast = forecastData.list
            .slice(0, 12)
            .map((forecast) => ({
                time: forecast.dt_txt,
                temperature: forecast.main.temp,
            }));

        const fiveDayForecast = forecastData.list.map((forecast) => ({
            time: forecast.dt_txt,
            temperature: forecast.main.temp,
        }));

        res.json({
            currentWeather: currentData,
            hourlyForecast: hourlyForecast,
            fiveDayForecast: fiveDayForecast,
        });
    } catch (error) {
        console.log("Erro na solicitação:", error);
        res.status(500).send("Erro ao processar a solicitação");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
