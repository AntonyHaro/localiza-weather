export function createHourForecastGraph() {
    const ctx = document.getElementById("hour-graph").getContext("2d");
    if (window.hourForecast) {
        window.hourForecast.destroy();
    }
    window.hourForecast = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["02:00", "04:00", "06:00"],
            datasets: [
                {
                    label: "Temperatura (°C)",
                    data: [12, 21, 19],
                    backgroundColor: "rgba(75, 192, 192, 0.1)",
                    borderColor: "gray",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            plugins: {
                datalabels: {
                    anchor: "end",
                    align: "end",
                    formatter: (value) => {
                        return value + "°C";
                    },
                    color: "white",
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    // beginAtZero: true,
                    display: false,
                    grid: {
                        display: false,
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: true,
        },
        plugins: [ChartDataLabels],
    });
}

export function createWeekForecastGraph() {
    const ctx = document.getElementById("week-graph").getContext("2d");
    if (window.weekForecast) {
        window.weekForecast.destroy();
    }
    window.weekForecast = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
            datasets: [
                {
                    label: "Temperatura (°C)",
                    data: [12, 21, 19, 30, 25],
                    backgroundColor: "rgba(75, 192, 192, 0.1)",
                    fill: true,
                    borderColor: "gray",
                    borderWidth: 3,
                },
            ],
        },
        options: {
            plugins: {
                datalabels: {
                    anchor: "end",
                    align: "end",
                    formatter: (value) => {
                        return value + "°C";
                    },
                    color: "white",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            responsive: true,
            maintainAspectRatio: true,
        },
        plugins: [ChartDataLabels],
    });
}
