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

function getCurrentDate() {
    const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    const daysOfWeek = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
    ];

    const dateTime = new Date();

    const month = String(dateTime.getMonth() + 1).padStart(2, "0"); // Meses começam do 0
    const day = String(dateTime.getDate()).padStart(2, "0");

    const dayOfWeek = dateTime.getDay();

    const formattedDateTime = `${daysOfWeek[dayOfWeek]}, ${day} de ${months[month]}`;
    return formattedDateTime;
}

// Function to fetch the cep data
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

function createHourForecastGraph() {
    const ctx = document.getElementById("hour-forecast").getContext("2d");
    const hourForecast = new Chart(ctx, {
        type: "line", // Gráfico de linha para temperaturas
        data: {
            labels: [
                "00:00",
                "03:00",
                "06:00",
                "09:00",
                "12:00",
                "15:00",
                "18:00",
            ],
            datasets: [
                {
                    label: "Temperatura (°C)",
                    data: [22, 21, 19, 18, 17, 16, 15], // Dados de temperatura
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    document.querySelector("form").addEventListener("submit", handleSearch);

    const defaultLocationData = await fetchCep("01001000");
    fillLocationInfo(defaultLocationData);

    dateArea.textContent = getCurrentDate();
});

createHourForecastGraph();
