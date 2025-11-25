let dash_cpu = document.getElementById("cpu-agregada");
const limiteMaximo = 70;

const linhaLimite = {
  afterDraw({ctx, chartArea, scales:{y}}) {
    const ypos = y.getPixelForValue(limiteMaximo);
    ctx.strokeStyle = 'red';
    ctx.setLineDash([0]);
    ctx.beginPath();
    ctx.moveTo(chartArea.left, ypos);
    ctx.lineTo(chartArea.right, ypos);
    ctx.stroke();
  }
};

new Chart(dash_cpu, {
    type: 'line',
    data: {
        labels: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
        datasets: [{
            label: 'Consumo de CPU (%)',
            data: [0, 20, 40, 60, 80, 100],
            borderwidth: 2,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true
        }]
    },  
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
    plugins: [linhaLimite]
});





const dash_latencia = document.getElementById("gauge-kpi-latencia")

new Chart(dash_latencia, {
    type: 'doughnut',
    data: {
        labels: ["valor", "falta"],
        datasets: [{
            data: [0.85, 1],
            backgroundColor: ['#f5c800ff', '#ffeb3b'],
            borderWidth: 0,
        }]
    },
    plugins: [{
        afterDraw(c){
            let ctx = c.ctx,
                x = c.width / 2,
                y = c.height / 1.05;
            ctx.font = "bold 20px sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#fff491ff"
            ctx.fillText("230ms", x, y);
        }
    }],
    options: {
        rotation: -90,
        circumference: 180,
        cutout: "70%",
        plugins: {
            legend: {display: false},
            tooltip: {enabled: false}
        }
    }
});


const dash_erro = document.getElementById("gauge-latencia-erro")

new Chart(dash_erro, {
    type: 'doughnut',
    data: {
        labels: ["valor", "falta"],
        datasets: [{
            data: [2, 1],
            backgroundColor: ['#ca331fff', '#ff523bff'],
            borderWidth: 0,
        }]
    },
    plugins: [{
        afterDraw(c){
            let ctx = c.ctx,
                x = c.width / 2,
                y = c.height / 1.05;
            ctx.font = "bold 40px sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#ff9393ff"
            ctx.fillText("70%", x, y);
        }
    }],
    options: {
        rotation: -90,
        circumference: 180,
        cutout: "70%",
        plugins: {
            legend: {display: false},
            tooltip: {enabled: false}
        }
    }
});






const dash_gauge_carga1 = document.getElementById("gauge-carga1")

new Chart(dash_gauge_carga1, {
    type: 'doughnut',
    data: {
        labels: ["valor", "falta"],
        datasets: [{
            data: [0.22, 1],
            backgroundColor: ['#41b8d5', '#6ce5e8'],
            borderWidth: 0
        }]
    },
    plugins: [{
        afterDraw(c){
            let ctx = c.ctx,
                x = c.width / 2,
                y = c.height / 1.05;
            ctx.font = "bold 15px sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#fff"
            ctx.fillText("2.2 procs", x, y);
        }
    }],
    options: {
        rotation: -90,
        circumference: 180,
        cutout: "70%",
        plugins: {
            legend: {display: false},
            tooltip: {enabled: false}
        }
    }
});

const dash_gauge_carga5 = document.getElementById("gauge-carga5")

new Chart(dash_gauge_carga5, {
    type: 'doughnut',
    data: {
        labels: ["valor", "falta"],
        datasets: [{
            data: [1.5, 1],
            backgroundColor: ['#41b8d5', '#6ce5e8'],
            borderWidth: 0
        }]
    },
    plugins: [{
        afterDraw(c){
            let ctx = c.ctx,
                x = c.width / 2,
                y = c.height / 1.05;
            ctx.font = "bold 15px sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#fff"
            ctx.fillText("5.7 procs", x, y);
        }
    }],
    options: {
        rotation: -90,
        circumference: 180,
        cutout: "70%",
        plugins: {
            legend: {display: false},
            tooltip: {enabled: false}
        }
    }
});

const dash_gauge_carga15 = document.getElementById("gauge-carga15")

new Chart(dash_gauge_carga15, {
    type: 'doughnut',
    data: {
        labels: ["valor", "falta"],
        datasets: [{
            data: [100, 1],
            backgroundColor: ['#41b8d5', '#6ce5e8'],
            borderWidth: 0
        }]
    },
    plugins: [{
        afterDraw(c){
            let ctx = c.ctx,
                x = c.width / 2,
                y = c.height / 1.05;
            ctx.font = "bold 15px sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#fff"
            ctx.fillText("10.2 procs", x, y);
        }
    }],
    options: {
        rotation: -90,
        circumference: 180,
        cutout: "70%",
        plugins: {
            legend: {display: false},
            tooltip: {enabled: false}
        }
    }
});
