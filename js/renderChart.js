function renderChart(id, percentages, duration = 0) {
    const data = {
        datasets: [{
            data: percentages,
            backgroundColor: ["#8381A6", "rgba(166, 163, 211, .4)"],
            hoverBackgroundColor: ["#8381A6", "rgba(166, 163, 211, .4)"],
            borderWidth: 0
        }],
    }
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            cutout: "80%",
            plugins: {
                tooltip: {
                    enabled: false,
                }
            },
            animation: {
                duration: duration
            }
        }
    }
    
    return new Chart(
        document.getElementById(id),
        config
    )
}

function updateChart(chart, newPercent, duration) {
    chart.data.datasets.forEach(dataset => {
        dataset.data = newPercent
    })
    chart.config.options.animation.duration = duration
    chart.update();
}

export { renderChart, updateChart }