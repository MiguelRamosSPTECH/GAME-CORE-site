let limiteUso1;
let limiteUso2;
const limiteTemp1 = 80
const limiteTemp2 = 90

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
                        limiteUso1 = Number(config.alertaLeve);
                        limiteUso2 = Number(config.alertaGrave);
                    }

                    if (config.nomeComponente == 'CPU_FREQ') {
                        // console.log(config.nomeComponente)
                        // console.log(config.alertaLeve)
                        // console.log(config.alertaGrave)
                        // console.log(typeof config.alertaGrave)
                    }

                });

                // if (layout[0].abc != null) {
                //     console.log("aa")
                // }
            }
        })
}



// S3 ---------------------------------------------
async function buscarArquivoPedroProc() {
    const resposta = await fetch(`/dashTemperatura/dados_pedro/dados_processos.csv`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(async resposta => {
            var processos = await resposta.json();
            if (resposta.ok) {
                // console.log(resposta);
                // console.log(processos);
                // console.log(processos[0].timestamp);
                // const dateObj = new Date(processos[0].timestamp.replace(" ", "T"));
                // console.log(dateObj);
                // console.log(typeof dateObj);
                // const atual = new Date();
                // console.log(atual);
                // console.log(typeof atual);
                // console.log(top5ProcessosCpu(processos))

                // return processos;
            }
        })
}

async function buscarArquivoPedroMed() {
    const resposta = await fetch(`/dashTemperatura/dados_pedro/medicoes.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(async resposta => {
            var medicoes = await resposta.json();
            if (resposta.ok) {

                // console.log(resposta);
                console.log(medicoes);

                // atualizarKpis(medicoes);
                Chart.defaults.color = '#ddddddff';
                plotarTemperatura(medicoes);
                plotarUsoCPU(medicoes);

                // return medicoes;
            }
        })
}
// S3 ---------------------------------------------

function top5ProcessosCpu(allProcessos) {
    const dataAtual = new Date();
    // const data30MinAtras = new Date(dataAtual.getTime() - 30*60*1000); // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    const data30MinAtras = new Date("2025-11-28T10:15:30"); // data fixa para teste

    console.log(data30MinAtras)
    const processosFiltrados = allProcessos.filter(p => {
        return new Date(p.timestamp.replace(" ", "T")) >= data30MinAtras;
    })
    return processosFiltrados;
}

function atualizarKpis(allMedicoes) {
    const dataAtual = new Date();


    // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    const data30MinAtras = new Date("2025-11-19T21:03:30"); // data fixa para teste 


    const medicoesFiltradas = allMedicoes.filter(m => {
        return new Date(m.timestamp.replace(" ", "T")) >= data30MinAtras;
    })

    // console.log(medicoesFiltradas[0].cpu_porcentagem, medicoesFiltradas[medicoesFiltradas.length - 1].cpu_porcentagem);
    const usoPrimeiraMedicao = medicoesFiltradas[0].cpu_porcentagem;
    const usoAtualMedicao = medicoesFiltradas[medicoesFiltradas.length - 1].cpu_porcentagem;
    const variacaoUso = (usoAtualMedicao - usoPrimeiraMedicao).toFixed(1);
    // console.log(variacaoUso);
    // return medicoesFiltradas;

    console.log(medicoesFiltradas);

    if (variacaoUso >= 0) {
        stringVariacaoUso = `+${variacaoUso}`;
    } else {
        stringVariacaoUso = `-${variacaoUso}`;
    }

    document.getElementById('variacaoCpu').innerHTML = stringVariacaoUso;

    document.getElementById('atualCpu').innerHTML = usoAtualMedicao.toFixed(1);

    const valorKpiUso = document.getElementById('atualCpu');
    const simboloUso = document.getElementById('atualCpuPorcent');
    valorKpiUso.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    simboloUso.classList.remove('cor1', 'cor2', 'cor3', 'cor4');

    const limiteUsoA1 = parseFloat(document.getElementById('uso-a1').textContent);
    const limiteUsoA2 = parseFloat(document.getElementById('uso-a2').textContent);

    if (usoAtualMedicao <= limiteUsoA1) {
        valorKpiUso.classList.add('cor1');
        simboloUso.classList.add('cor1');
    } else if (usoAtualMedicao <= limiteUsoA2) {
        valorKpiUso.classList.add('cor3');
        simboloUso.classList.add('cor3');
    } else {
        valorKpiUso.classList.add('cor4');
        simboloUso.classList.add('cor4');
    }

    // ---------------------------------------------
    const tempPrimeiraMedicao = medicoesFiltradas[0].temperatura_cpu;
    const tempAtualMedicao = medicoesFiltradas[medicoesFiltradas.length - 1].temperatura_cpu;
    const variacaoTemp = (tempAtualMedicao - tempPrimeiraMedicao).toFixed(1);

    // console.log(medicoesFiltradas)
    // console.log(medicoesFiltradas[medicoesFiltradas.length -1].temperatura_cpu)
    // console.log(medicoesFiltradas[medicoesFiltradas.length -1].timestamp)
    // console.log(medicoesFiltradas[0].temperatura_cpu)
    // console.log(medicoesFiltradas[0].timestamp)
    if (variacaoTemp >= 0) {
        stringVariacaoTemp = `+${variacaoTemp}`;
    } else {
        stringVariacaoTemp = `-${variacaoTemp}`;
    }
    document.getElementById('variacaoTemp').innerHTML = stringVariacaoTemp;

    document.getElementById('atualTemp').innerHTML = tempAtualMedicao.toFixed(1);

    const valorKpiTemp = document.getElementById('atualTemp');
    const simboloPorcent = document.getElementById('atualTempPorcent')
    valorKpiTemp.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    simboloPorcent.classList.remove('cor1', 'cor2', 'cor3', 'cor4');

    if (tempAtualMedicao <= limiteTemp1) {
        valorKpiTemp.classList.add('cor1');
        simboloPorcent.classList.add('cor1');
    } else if (tempAtualMedicao <= limiteTemp2) {
        valorKpiTemp.classList.add('cor3');
        simboloPorcent.classList.add('cor3');
    } else {
        valorKpiTemp.classList.add('cor4');
        simboloPorcent.classList.add('cor4');
    }


    // -----------------------------
    const tempoAcimaLimite = calcularTempoAcimaLimite(medicoesFiltradas, limiteTemp1);
    // console.log(tempoAcimaLimite);

    document.getElementById('limite-temp-crit').innerHTML = limiteTemp1;
    document.getElementById('tempo-acima-limite').innerHTML = tempoAcimaLimite + ' min';

    const tempoAcumulado = document.getElementById('tempo-acima-limite');
    tempoAcumulado.classList.remove('cor1', 'cor2', 'cor3', 'cor4');

    if (tempoAcimaLimite < 2) {
        tempoAcumulado.classList.add('cor1');
    } else if (tempoAcimaLimite <= 5) {
        tempoAcumulado.classList.add('cor2');
    } else if (tempoAcimaLimite <= 12) {
        tempoAcumulado.classList.add('cor3');
    } else {
        tempoAcumulado.classList.add('cor4');
    }

    // ---------------------------------------------

    const freqMinDisponivel = medicoesFiltradas[medicoesFiltradas.length - 1].cpuFrequenciaMin;
    const freqAtual = medicoesFiltradas[medicoesFiltradas.length - 1].cpuFrequencia;
    const freqMaxDisponivel = medicoesFiltradas[medicoesFiltradas.length - 1].cpuFrequenciaMax;

    document.getElementById('freq-min').textContent = freqMinDisponivel.toFixed(1);
    document.getElementById('freq-atual').textContent = freqAtual.toFixed(1);
    document.getElementById('freq-max').textContent = freqMaxDisponivel.toFixed(1);

}

function calcularTempoAcimaLimite(medicoesFiltradas, limiteTemperatura) {
    let tempoAcumulado = 0;

    for (let i = 0; i < medicoesFiltradas.length - 1; i++) {
        const medicaoAtual = medicoesFiltradas[i];
        const proximaMedicao = medicoesFiltradas[i + 1];

        if (medicaoAtual.temperatura_cpu > limiteTemperatura) {

            const tempoAtual = new Date(medicaoAtual.timestamp.replace(" ", "T"));
            const tempoProximo = new Date(proximaMedicao.timestamp.replace(" ", "T"));
            const diferenca = (tempoProximo - tempoAtual) / 1000;

            tempoAcumulado += diferenca;
        }
    }

    return Math.round(tempoAcumulado / 60);
}





function plotarUsoCPU(allMedicoes) {

    // const dataAtual = new Date(); // DATA PARA FUNCIONAR NORMALMENTE
    const dataAtual = new Date("2025-11-15T21:33:30"); // data fixa para teste


    const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE


    const medicoesFiltradas = allMedicoes.filter(m => {
        return new Date(m.timestamp.replace(" ", "T")) >= data30MinAtras;
    })
    // console.log(allMedicoes);
    // console.log(medicoesFiltradas);
    // console.log(medicoesFiltradas.map(m => m['timestamp']));
    // console.log(medicoesFiltradas.map(m => m.timestamp.substring(11, 16)));





    const graphUso = document.getElementById('myChartUso');

    const labelsUso = medicoesFiltradas.map(m => m.timestamp.substring(11, 16));
    const dataMedicoes = medicoesFiltradas.map(m => m.cpu_porcentagem);
    // console.log(dataMedicoes);

    const dataUso = {
        labels: labelsUso,
        datasets: [{
            label: 'CPU (%)',
            data: dataMedicoes,
            fill: false,
            borderColor: 'rgba(169, 63, 218, 1)',
            borderWidth: 1.8,
            tension: 0.1,
            pointRadius: 1.5,
            pointHoverRadius: 3
        },
        {
            label: 'Moderado',
            data: linhaHorizontal(limiteUso1, labelsUso.length),
            borderColor: 'rgba(163, 119, 54, 1)',
            borderWidth: 1.6,
            borderDash: [10, 8],
            pointRadius: 0,
        },
        {
            label: 'Grave',
            data: linhaHorizontal(limiteUso2, labelsUso.length),
            borderColor: 'rgba(161, 50, 50, 1)',
            borderWidth: 1.6,
            borderDash: [10, 8],
            pointRadius: 0,
        }
        ]
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
                    text: 'Uso de CPU (%)'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0)',
            scales: {
                x: {
                    ticks: {
                        callback: function (value, index, ticks) {
                            return index % 5 === 0 ? this.getLabelForValue(value) : '';
                        }
                    },
                    border: {
                        display: true,
                        color: 'rgba(134, 134, 134, 1)',
                        width: 1
                    },
                    grid: {
                        display: true,
                        color: 'rgba(139, 139, 139, 0.27)'
                    }
                },
                y: {
                    border: {
                        display: true,
                        color: 'rgba(134, 134, 134, 1)',
                        width: 1
                    },
                    grid: {
                        display: true,
                        color: 'rgba(139, 139, 139, 0.27)'
                    }
                }
            }
        },
    };

    new Chart(graphUso, configUso);
}



function plotarTemperatura(allMedicoes) {

    // const dataAtual = new Date(); // DATA PARA FUNCIONAR NORMALMENTE
    const dataAtual = new Date("2025-11-15T21:33:30"); // data fixa para teste


    const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE


    const medicoesFiltradas = allMedicoes.filter(m => {
        return new Date(m.timestamp.replace(" ", "T")) >= data30MinAtras;
    })
    // console.log(allMedicoes);
    // console.log(medicoesFiltradas);
    // console.log(medicoesFiltradas.map(m => m['timestamp']));
    // console.log(medicoesFiltradas.map(m => m.timestamp.substring(11, 16)));



    const graphTemp = document.getElementById('myChartTemp');

    const labelsTemp = medicoesFiltradas.map(m => m.timestamp.substring(11, 16));
    const dataMedicoes = medicoesFiltradas.map(m => m.temperatura_cpu);
    // console.log(dataMedicoes);

    const dataTemp = {
        labels: labelsTemp,
        datasets: [{
            label: 'CPU (°C)',
            data: dataMedicoes,
            fill: false,
            borderColor: 'rgba(169, 63, 218, 1)',
            borderWidth: 1.8,
            tension: 0.1,
            pointRadius: 1.5,
            pointHoverRadius: 3
        },
        {
            label: `Moderado`,
            data: linhaHorizontal(limiteTemp1, labelsTemp.length),
            borderColor: 'rgba(163, 119, 54, 1)',
            borderWidth: 1.6,
            borderDash: [10, 8],
            pointRadius: 0,
        },
        {
            label: 'Grave',
            data: linhaHorizontal(limiteTemp2, labelsTemp.length),
            borderColor: 'rgba(161, 50, 50, 1)',
            borderWidth: 1.6,
            borderDash: [10, 8],
            pointRadius: 0,
        }
        ]
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
                    text: 'Temperatura de CPU (°C)'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0)',
            scales: {
                x: {
                    ticks: {
                        callback: function (value, index, ticks) {
                            return index % 5 === 0 ? this.getLabelForValue(value) : '';
                        }
                    },
                    border: {
                        display: true,
                        color: 'rgba(134, 134, 134, 1)',
                        width: 1
                    },
                    grid: {
                        display: true,
                        color: 'rgba(139, 139, 139, 0.27)'
                    }
                },
                y: {
                    border: {
                        display: true,
                        color: 'rgba(134, 134, 134, 1)',
                        width: 1
                    },
                    grid: {
                        display: true,
                        color: 'rgba(139, 139, 139, 0.27)'
                    }
                }
            }
        },
    };

    new Chart(graphTemp, configTemp);
}


function linhaHorizontal(valor, quantidade) {
    return Array(quantidade).fill(valor);
}