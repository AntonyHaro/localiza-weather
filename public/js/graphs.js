export function createHourForecastGraph(forecast) {
    const ctx = document.getElementById("hour-graph").getContext("2d");
    if (window.hourForecast) {
        window.hourForecast.destroy();
    }

    let labels = [];
    let data = [];

    // get the time and temperature for each item in the forecast
    forecast.forEach((item) => {
        data.push(item.temperature.toFixed(1));

        // format the time to display only the hour
        const time = item.time.split(" ")[1];
        labels.push(time.slice(0, 5));
    });

    // create the graph with the processed data
    window.hourForecast = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperatura (°C)",
                    data: data,
                    backgroundColor: "#ffff7525",
                    borderColor: "#ffff7546",
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
                    display: false,
                    grid: {
                        display: false,
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: true,
        },
        plugins: [ChartDataLabels], // plugin to display the data labels
    });
}

export function createWeekForecastGraph(forecast) {
    const ctx = document.getElementById("week-graph").getContext("2d");
    if (window.weekForecast) {
        window.weekForecast.destroy();
    }

    let labels = [];
    let data = [];

    // get the time and temperature for each item in the forecast
    forecast.forEach((item) => {
        data.push(item.temperature.toFixed(0));

        // format the time to display only the date
        const time = item.time.split(" ")[0].slice(5);
        labels.push(time);
    });

    window.weekForecast = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperatura (°C)",
                    data: data,
                    backgroundColor: "#ffff7525",
                    fill: true,
                    borderColor: "#ffff7546",
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
