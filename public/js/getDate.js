export function getDate() {
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