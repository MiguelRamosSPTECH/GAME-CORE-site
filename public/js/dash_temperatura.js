function buscarParametrosDashTemp() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/dashTemperatura/buscarParametros/${idEmpresa}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(async resposta => {
            var layout = await resposta.json();
            if (resposta.ok) {
                // console.log(layout);

                layout.forEach(config => {
                    // console.log(config);

                    if (config.nomeComponente == 'CPU') {
                        // console.log(config.nomeComponente)
                        // console.log(config.alertaLeve)
                        // console.log(config.alertaGrave)
                        document.getElementById('uso-a1').innerHTML = Number(config.alertaLeve).toFixed(0);
                        document.getElementById('uso-a2').innerHTML = Number(config.alertaGrave).toFixed(0);
                    }

                    if (config.nomeComponente == 'CPU_FREQ') {
                        // console.log(config.nomeComponente)
                        // console.log(config.alertaLeve)
                        // console.log(config.alertaGrave)
                        // console.log(typeof config.alertaGrave)
                        document.getElementById('temp-a1').innerHTML = Number(config.alertaLeve).toFixed(0);
                        document.getElementById('temp-a2').innerHTML = Number(config.alertaGrave).toFixed(0);
                    }

                });

                // if (layout[0].abc != null) {
                //     console.log("aa")
                // }
            }
        })
}



















const ctxTemp = document.getElementById('myChartTemp');
const labelsTemp = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
const dataTemp = {
    labels: labelsTemp,
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};
const configTemp = {
    type: 'line',
    data: dataTemp,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Temperatura'
            }
        }
    },
};

new Chart(ctxTemp, configTemp);

const ctxUso = document.getElementById('myChartUso');
const labelsUso = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
const dataUso = {
    labels: labelsUso,
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};
const configUso = {
    type: 'line',
    data: dataUso,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Uso'
            }
        }
    },
};

new Chart(ctxUso, configUso);
