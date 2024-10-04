const logradouroArea = document.getElementById("logradouro-area");
const bairroArea = document.getElementById("bairro-area");
const localidadeArea = document.getElementById("localidade-area");
const estadoArea = document.getElementById("estado-area");
const regiaoArea = document.getElementById("regiao-area");
const ibgeArea = document.getElementById("ibge-area");
const dddArea = document.getElementById("ddd-area");
const ufArea = document.getElementById("uf-area");
const cityDescriptionArea = document.getElementById("city-description");

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

    const cityDescription = await getCityDescription(data.localidade);
    if (cityDescription) {
        cityDescriptionArea.textContent = cityDescription;
        console.log("Descrição da cidade:", cityDescription);
    } else {
        cityDescriptionArea.textContent = "Descrição não disponível.";
    }
}

document.querySelector("form").addEventListener("submit", handleSearch);
