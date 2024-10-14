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

async function getWeather(city) {
    try {
        const response = await fetch(`/weather/${city}`);

        if (!response.ok)
            throw new Error("Erro na solicitação de descrição da cidade");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao fazer a solicitação:", error);
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
            throw new Error("Erro na solicitação de descrição da cidade");

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Erro ao fazer a solicitação:", error);
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

    const weather = await getWeather(data.localidade);
    fillWeatherInfo(weather);
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

    localArea.textContent = `${data.cep}, ${data.localidade} - ${data.uf} 📍`;

    const cityDescription = await getCityDescription(data.localidade);

    if (!cityDescription) {
        cityDescriptionArea.textContent = "Descrição não disponível.";
        return;
    }

    cityDescriptionArea.textContent = cityDescription;
}

function fillWeatherInfo(weather) {
    console.log(weather);

    const formattedSunriseSunset = formatSunriseSunset(
        weather.sys.sunrise,
        weather.sys.sunset
    );

    sunriseArea.textContent = formattedSunriseSunset.sunrise;
    sunsetArea.textContent = formattedSunriseSunset.sunset;
    humidityArea.textContent = weather.main.humidity + "%";
    pressureArea.textContent = weather.main.pressure + "hPa";
    feelsLikeArea.textContent = weather.main.feels_like + "°C";
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

    // set the default data to display in the page
    const defaultData = await fetchCep("01001000");

    if (!data) return;
    fillLocationInfo(defaultData);

    const weather = await getWeather(data.localidade);
    fillWeatherInfo(weather);

    createHourForecastGraph();
    createWeekForecastGraph();
});
