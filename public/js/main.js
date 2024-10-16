import { createHourForecastGraph, createWeekForecastGraph } from "./graphs.js";
import { getDate } from "./getDate.js";

// CEP areas
const dateArea = document.getElementById("date");
const logradouroArea = document.getElementById("logradouro-area");
const bairroArea = document.getElementById("bairro-area");
const localidadeArea = document.getElementById("localidade-area");
const estadoArea = document.getElementById("estado-area");
const regiaoArea = document.getElementById("regiao-area");
const ibgeArea = document.getElementById("ibge-area");
const dddArea = document.getElementById("ddd-area");
const ufArea = document.getElementById("uf-area");
const cityDescriptionArea = document.getElementById("city-description");
const localArea = document.getElementById("local");

// Weather areas
const humidityArea = document.getElementById("humidity");
const feelsLikeArea = document.getElementById("feels-like");
const pressureArea = document.getElementById("pressure");
const sunsetArea = document.getElementById("sunset");
const sunriseArea = document.getElementById("sunrise");
const maxTempArea = document.getElementById("max-temperature");
const minTempArea = document.getElementById("min-temperature");
const currentTemperature = document.getElementById("current-temperature");

async function fetchCep(cep) {
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Erro na solicitação");

        const data = await response.json();
        return data.erro ? null : data;
    } catch (error) {
        console.error("Erro ao buscar o CEP:", error.message);
        return null;
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`/currentWeather/${city}`);

        if (!response.ok) throw new Error("Erro ao buscar o clima da cidade");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar o clima da cidade");
        return null;
    }
}

// Search the city description using the endpoint to call the OpenAI API
async function getCityDescription(city) {
    try {
        const response = await fetch(`/city/${city}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok)
            throw new Error("Erro ao buscar a descrição da cidade");

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Erro ao buscar a descrição da cidade");
        return null;
    }
}

// Handle the submit form event
async function handleSearch(event) {
    event.preventDefault();
    const cep = document.getElementById("cep").value;
    const data = await fetchCep(cep);

    if (!data) return;
    fillLocationInfo(data);

    const weather = await fetchWeather(data.localidade);
    fillWeatherInfo(weather);
    createHourForecastGraph(weather.hourlyForecast);
    createWeekForecastGraph(weather.fiveDayForecast);
}

// Fill the location info into the DOM
async function fillLocationInfo(data) {
    logradouroArea.textContent = data.logradouro;
    bairroArea.textContent = data.bairro;
    localidadeArea.textContent = data.localidade;
    estadoArea.textContent = data.estado;
    regiaoArea.textContent = data.regiao;
    ibgeArea.textContent = data.ibge;
    dddArea.textContent = data.ddd;
    ufArea.textContent = data.uf;

    localArea.textContent = `${data.cep}, ${data.localidade} - ${data.uf} 🌎`;

    const cityDescription = await getCityDescription(data.localidade);

    if (!cityDescription) {
        cityDescriptionArea.textContent = "Descrição não disponível.";
        return;
    }

    cityDescriptionArea.textContent = cityDescription;
}

function fillWeatherInfo(weather) {
    console.log(weather);
    console.log(weather.currentWeather.weather[0]);

    const formattedSunriseSunset = formatSunriseSunset(
        weather.currentWeather.sys.sunrise,
        weather.currentWeather.sys.sunset
    );
    sunriseArea.textContent = formattedSunriseSunset.sunrise;
    sunsetArea.textContent = formattedSunriseSunset.sunset;

    currentTemperature.textContent =
        weather.currentWeather.main.temp.toFixed(1) + "°C";
    maxTempArea.textContent =
        weather.currentWeather.main.temp_max.toFixed(1) + "°C";
    minTempArea.textContent =
        weather.currentWeather.main.temp_min.toFixed(1) + "°C";
    feelsLikeArea.textContent =
        weather.currentWeather.main.feels_like.toFixed(1) + "°C";

    humidityArea.textContent = weather.currentWeather.main.humidity + "%";
    pressureArea.textContent = weather.currentWeather.main.pressure + "hPa";
}

function formatSunriseSunset(sunrise, sunset) {
    // Format unix to utc-3
    const formatTime = (timestamp) => {
        // Unix to milliseconds
        let date = new Date(timestamp * 1000);

        // Brasília/São Paulo (UTC-3)
        let offset = -3;
        let hours = (date.getUTCHours() + offset).toString().padStart(2, "0");
        let minutes = date.getUTCMinutes().toString().padStart(2, "0");

        // Case hour is negative
        if (parseInt(hours) < 0) {
            hours = (24 + parseInt(hours)).toString().padStart(2, "0");
        }

        return `${hours}:${minutes}`;
    };

    return {
        sunrise: formatTime(sunrise),
        sunset: formatTime(sunset),
    };
}

window.addEventListener("DOMContentLoaded", async () => {
    document.querySelector("form").addEventListener("submit", handleSearch);
    dateArea.textContent = getDate();

    // Set the default data to display in the page
    const defaultData = await fetchCep("01001000");

    if (!defaultData) return;
    fillLocationInfo(defaultData);

    const weather = await fetchWeather(defaultData.localidade);
    fillWeatherInfo(weather);

    createHourForecastGraph(weather.hourlyForecast);
    createWeekForecastGraph(weather.fiveDayForecast);
});

// mudar a cor da temperatura mais alta e mais baixa nos gráficos

function resizeCanvas() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // Define o tamanho real do canvas baseado no tamanho visual do CSS
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Aqui você pode redesenhar o conteúdo do canvas
    // ctx.fillRect(0, 0, canvas.width, canvas.height); // Exemplo de desenho
}

// Chama a função de redimensionamento quando a janela for redimensionada
window.addEventListener("resize", resizeCanvas);

// Chama a função inicialmente para definir o tamanho correto
resizeCanvas();
