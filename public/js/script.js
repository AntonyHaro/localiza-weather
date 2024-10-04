const form = document.querySelector("form");

async function handleSearch(event) {
    event.preventDefault();
    try {
        const response = await fetch("/test");
        const data = await response.json();
        window.alert(data.message);
    } catch (error) {
        console.error("Erro:", error);
    }
}

form.addEventListener("submit", handleSearch);
