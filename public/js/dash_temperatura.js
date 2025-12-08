const tempoIntervalo = 2 * 60 * 1000; // 2 minutos
let graficoTempReiniciar = null;
let graficoUsoReiniciar = null;

let limiteUso1 = 80;
let limiteUso2 = 90;
const limiteTemp1 = 80;
const limiteTemp2 = 90;
let limiteCpuFreq1 = 0;
let limiteCpuFreq2 = 0;

// S3_BUCKET_PEDRO="pedro-teste-bucket-01-12"


let diaDeHoje = new Date()
let mes = diaDeHoje.getMonth() + 1;
let dia = diaDeHoje.getDate() < 10 ? `${0}${diaDeHoje.getDate()}` : diaDeHoje.getDate();
let ano = diaDeHoje.getFullYear();
// let timestamp = `${ano}-${mes}-${dia}`;
let timestamp = `2025-12-01`;
let nomeServidorMockado = "00-D7-6D-98-56-34";



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

                        limiteCpuFreq1 = Number(config.alertaLeve);
                        limiteCpuFreq2 = Number(config.alertaGrave);
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
    const ARQUIVO_HOST = 'dados_processos.json';
    const URL_API_HOST = `/s3Route/dados/${timestamp}/${nomeServidorMockado}/${ARQUIVO_HOST}`;
    // const resposta = await fetch(URL_API_HOST, {
    // const resposta = await fetch(`/dashTemperatura/dados_pedro/processos.json`, {
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

                console.log(processos)
                top5ProcessosCpu(processos)

                // return processos;
            }
        })
}


async function buscarArquivoPedroMed() {
    const ARQUIVO_HOST = 'dados_capturados.json';
    const URL_API_HOST = `/s3Route/dados/${timestamp}/${nomeServidorMockado}/${ARQUIVO_HOST}`;
    // const resposta = await fetch(URL_API_HOST, {
    // const resposta = await fetch(`/dashTemperatura/dados_pedro/dados_capturados.json`, {
    const resposta = await fetch(`/dashTemperatura/dados_pedro/dados_capturados.json`, {
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

                Chart.defaults.color = '#ddddddff';
                plotarTemperatura(medicoes);
                plotarUsoCPU(medicoes);
                atualizarKpis(medicoes);

                // return medicoes;
            }
        })
}
// S3 ---------------------------------------------

function top5ProcessosCpu(allProcessos) {
    // const dataAtual = new Date();
    // const data30MinAtras = new Date(dataAtual.getTime() - 30*60*1000); // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    // const data30MinAtras = new Date("2025-11-28T10:15:30"); // data fixa para teste

    // // console.log(data30MinAtras)
    // const processosFiltrados = allProcessos.filter(p => {
    //     return new Date(p.timestamp.replace(" ", "T")) >= data30MinAtras;
    // })
    // return processosFiltrados;

    const ultimaData = allProcessos[allProcessos.length - 1].timestamp.replace(" ", "T");
    // console.log("Última data disponível:", ultimaData);
    const processosUltimaMedicao = allProcessos.filter(p => {
        return p.timestamp.replace(" ", "T") === ultimaData;
    });
    // console.log(processosUltimaMedicao);
    // console.log(processosUltimaMedicao.nome_processo);
    // console.log(processosUltimaMedicao.cpu_porcentagem);
    // processosUltimaMedicao.forEach(p => {
    //     console.log(p.nome_processo, p.cpu_porcentagem);
    // });

    for (let i = 0; i < processosUltimaMedicao.length - 1; i++) {
        let maxIndex = i;
        for (let j = i + 1; j < processosUltimaMedicao.length; j++) {
            if (processosUltimaMedicao[j].cpu_porcentagem > processosUltimaMedicao[maxIndex].cpu_porcentagem) {
                maxIndex = j;
            }
        }
        if (maxIndex !== i) {
            let aux = processosUltimaMedicao[i];
            processosUltimaMedicao[i] = processosUltimaMedicao[maxIndex];
            processosUltimaMedicao[maxIndex] = aux;
        }
    }

    // console.log("order by cpu",processosUltimaMedicao);

    for (let k = 0; k < 5; k++) {
        document.getElementById(`n${k + 1}`).innerHTML = processosUltimaMedicao[k].nome_processo;
        document.getElementById(`p${k + 1}`).innerHTML = processosUltimaMedicao[k].cpu_porcentagem + '%';
    }
}


function atualizarKpis(allMedicoes) {
    const dataAtual = new Date();
    // console.log(allMedicoes)


    // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    const data30MinAtras = new Date("2025-11-30T20:00:00"); // data fixa para teste 


    const medicoesFiltradas = allMedicoes.filter(m => {
        return new Date(m.timestamp.replace(" ", "T")) >= data30MinAtras;
    })

    // console.log(medicoesFiltradas[0].cpu_porcentagem, medicoesFiltradas[medicoesFiltradas.length - 1].cpu_porcentagem);
    const usoPrimeiraMedicao = medicoesFiltradas[0].cpu_porcentagem;
    // const usoAtualMedicao = medicoesFiltradas[medicoesFiltradas.length - 1].cpu_porcentagem;
    const usoAtualMedicao = medicoesFiltradas[medicoesFiltradas.length - 1].cpu_porcentagem.toFixed(1);
    const variacaoUso = (usoAtualMedicao - usoPrimeiraMedicao).toFixed(1);
    // console.log(variacaoUso);
    // return medicoesFiltradas;

    // console.log(medicoesFiltradas);

    if (variacaoUso >= 0) {
        stringVariacaoUso = `+${variacaoUso}`;
    } else {
        stringVariacaoUso = `${variacaoUso}`;
    }

    document.getElementById('variacaoCpu').innerHTML = stringVariacaoUso;

    document.getElementById('atualCpu').innerHTML = usoAtualMedicao;

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
    // const tempAtualMedicao = medicoesFiltradas[medicoesFiltradas.length - 1].temperatura_cpu;
    const tempAtualMedicao = medicoesFiltradas[medicoesFiltradas.length - 1].temperatura_cpu.toFixed(1);
    const variacaoTemp = (tempAtualMedicao - tempPrimeiraMedicao).toFixed(1);

    // console.log(medicoesFiltradas)
    // console.log(medicoesFiltradas[medicoesFiltradas.length -1].temperatura_cpu)
    // console.log(medicoesFiltradas[medicoesFiltradas.length -1].timestamp)
    // console.log(medicoesFiltradas[0].temperatura_cpu)
    // console.log(medicoesFiltradas[0].timestamp)
    if (variacaoTemp >= 0) {
        stringVariacaoTemp = `+${variacaoTemp}`;
    } else {
        stringVariacaoTemp = `${variacaoTemp}`;
    }
    document.getElementById('variacaoTemp').innerHTML = stringVariacaoTemp;

    document.getElementById('atualTemp').innerHTML = tempAtualMedicao;

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

    document.getElementById('limite-temp-crit').innerHTML = limiteTemp2;
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

    // const freqMinDisponivel = medicoesFiltradas[medicoesFiltradas.length - 1].cpuFrequenciaMin;
    // const freqAtual = medicoesFiltradas[medicoesFiltradas.length - 1].cpuFrequencia;
    // const freqMaxDisponivel = medicoesFiltradas[medicoesFiltradas.length - 1].cpuFrequenciaMax;
    // console.log(medicoesFiltradas[0])
    const freqMinDisponivel = medicoesFiltradas[medicoesFiltradas.length - 1].cpu_freq_min_mhz.toFixed(0);
    const freqAtual = medicoesFiltradas[medicoesFiltradas.length - 1].cpu_freq_mhz.toFixed(0);
    const freqMaxDisponivel = medicoesFiltradas[medicoesFiltradas.length - 1].cpu_freq_max_mhz.toFixed(0);

    document.getElementById('freq-min').textContent = freqMinDisponivel;
    document.getElementById('freq-atual').textContent = freqAtual;
    document.getElementById('freq-max').textContent = freqMaxDisponivel;

    const porcentagemFreq = (freqAtual / freqMaxDisponivel) * 100;

    const txtResumo = document.getElementById('freq-resumo');

    txtResumo.innerHTML = 'Utilizando ' + porcentagemFreq.toFixed(0) + '% do máximo';
    txtResumo.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    if (porcentagemFreq <= 30 || porcentagemFreq >= 90) {
        txtResumo.classList.add('cor3');
    } else {
        txtResumo.classList.add('cor1');
    }


    // ----------------------------------------------

    resumoFinal(usoAtualMedicao, tempAtualMedicao, freqMinDisponivel, freqAtual, freqMaxDisponivel);
    deixarRuim()

}

function resumoFinal(uso_cpu, temperatura_cpu, freqMin_cpu, freqAtual_cpu, freqMax_cpu) {
    // const temperatura = temperatura_cpu >= 90 ? "alta" : temperatura_cpu >= 80 ? "quente" : "normal";
    // const uso = uso_cpu >= limiteUso2 ? "alto" : uso_cpu >= limiteUso1 ? "moderado" : "normal";
    // const freq = freqAtual_cpu > freqMax_cpu * 0.9 ? "alta" : freqAtual_cpu < freqMin_cpu * 1.1 ? "baixa" : "normal";
    const porcentagemFreq = (freqAtual_cpu / freqMax_cpu) * 100;

    const isTempCritica = temperatura_cpu >= 90;
    const isTempAlta = temperatura_cpu >= 80 && temperatura_cpu < 90;
    const isTempNormal = temperatura_cpu < 80;

    const isUsoAlto = uso_cpu >= limiteUso2;
    const isUsoBaixo = uso_cpu <= limiteUso1;

    const isFrequenciaBaixa = porcentagemFreq < 60;
    const isFrequenciaAlta = porcentagemFreq > 85;

    const resumo = document.getElementById('resumo-txt');
    const resumoBloco = document.getElementById('resumo');



    // thermal throttling 
    if (isTempCritica && isFrequenciaBaixa) {
        resumo.innerHTML = "Possível limitação térmica. CPU superaquecida reduzindo a frequência.";
        resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
        resumoBloco.classList.add('cor4');
        return;
    }

    // fallha de refrigeração
    if (isTempCritica && isUsoBaixo) {
        resumo.innerHTML = "Possível falha de refrigeração. Temperatura crítica com baixo uso.";
        resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
        resumoBloco.classList.add('cor4');
        return;
    }

    //
    if (isTempCritica && !isFrequenciaBaixa) {
        resumo.innerHTML = "Provavelmente entrará em limitação térmica em breve. Temperatura e frequência altas.";
        resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
        resumoBloco.classList.add('cor3');
        return;
    }

    //
    if (isUsoAlto && !isFrequenciaAlta && isTempNormal) {
        resumo.innerHTML = "Uso de CPU acima do limite. Frequência e temperatura controladas. Sistema operando em alto desempenho.";
        resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
        resumoBloco.classList.add('cor2');
        return;
    }

    if (isTempAlta && isUsoAlto && isFrequenciaAlta) {
        resumo.innerHTML = "Estresse performático. Temperatura e uso acima dos limites. Frequência elevada.";
        resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
        resumoBloco.classList.add('cor3');
        return;
    }


    if (isUsoAlto && isFrequenciaAlta && isTempNormal) {
        resumo.innerHTML = "Alto desempenho. Uso e frequência elevados com temperatura controlada.";
        resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
        resumoBloco.classList.add('cor1');
        return;
    }

    if (isUsoBaixo && isTempNormal) {
        resumo.innerHTML = "Sistema ocioso e estável em economia de energia."
        resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
        resumoBloco.classList.add('cor1');
        return;
    }

    resumo.innerHTML = "Operação normal do sistema. Sem anomalias detectadas.";
    resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    resumoBloco.classList.add('cor1');
    return;

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

    // // const dataAtual = new Date(); // DATA PARA FUNCIONAR NORMALMENTE
    // const dataAtual = new Date("2025-11-30T21:51:15"); // data fixa para teste


    // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    const dataAtual = new Date();
    // console.log(allMedicoes)


    // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    const data30MinAtras = new Date("2025-11-30T20:00:00"); // data fixa para teste 

    const medicoesFiltradas = allMedicoes.filter(m => {
        return new Date(m.timestamp.replace(" ", "T")) >= data30MinAtras;
    })
    // console.log(allMedicoes);
    // console.log(medicoesFiltradas);
    // console.log(medicoesFiltradas.map(m => m['timestamp']));
    // console.log(medicoesFiltradas.map(m => m.timestamp.substring(11, 16)));


    if (graficoUsoReiniciar) {
        graficoUsoReiniciar.destroy();
    }
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

    graficoUsoReiniciar = new Chart(graphUso, configUso);
}


function plotarTemperatura(allMedicoes) {

    // // const dataAtual = new Date(); // DATA PARA FUNCIONAR NORMALMENTE
    // const dataAtual = new Date("2025-11-30T21:51:15"); // data fixa para teste


    // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    const dataAtual = new Date();
    // console.log(allMedicoes)


    // const data30MinAtras = new Date(dataAtual.getTime() - 30 * 60 * 1000); // DATA PARA FUNCIONAR NORMALMENTE
    const data30MinAtras = new Date("2025-11-30T20:00:00"); // data fixa para teste 

    const medicoesFiltradas = allMedicoes.filter(m => {
        return new Date(m.timestamp.replace(" ", "T")) >= data30MinAtras;
    })
    // console.log(allMedicoes);
    // console.log(medicoesFiltradas);
    // console.log(medicoesFiltradas.map(m => m['timestamp']));
    // console.log(medicoesFiltradas.map(m => m.timestamp.substring(11, 16)));


    if (graficoTempReiniciar) {
        graficoTempReiniciar.destroy();
    }
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


    graficoTempReiniciar = new Chart(graphTemp, configTemp);
}


function linhaHorizontal(valor, quantidade) {
    return Array(quantidade).fill(valor);
}

async function atualizarDashboard() {
    buscarParametrosDashTemp();
    buscarArquivoPedroMed();
    buscarArquivoPedroProc();
}

async function iniciarDashboard() {
    await atualizarDashboard();
    setInterval(atualizarDashboard, tempoIntervalo);
}

window.onload = iniciarDashboard();

function deixarRuim() {
    document.getElementById('atualCpu').innerHTML = 95;
    document.getElementById('variacaoCpu').innerHTML = "+12.3";
    document.getElementById('atualCpu').classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    document.getElementById('atualCpu').classList.add('cor4');
    document.getElementById('atualCpuPorcent').classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    document.getElementById('atualCpuPorcent').classList.add('cor4');

    abc = document.getElementById('atualTemp');
    abcd = document.getElementById('variacaoTemp');

    abc.innerHTML = 97;
    abcd.innerHTML = "+20.3";
    abc.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    abc.classList.add('cor4');
    // abcd.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    // abcd.classList.add('cor4');
    document.getElementById('atualTempPorcent').classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    document.getElementById('atualTempPorcent').classList.add('cor4');

    document.getElementById('freq-min').innerHTML = 800
    document.getElementById('freq-max').innerHTML = 5200
    document.getElementById('freq-atual').innerHTML = 1650
    const porcentagemFreq = (1650 / 5200) * 100;

    const txtResumo = document.getElementById('freq-resumo');

    txtResumo.innerHTML = 'Utilizando ' + porcentagemFreq.toFixed(0) + '% do máximo';

    const resumoBloco = document.getElementById('resumo');
    const resumoTxt = document.getElementById('resumo-txt');
    resumoTxt.innerHTML = "Possível limitação térmica. CPU superaquecida reduzindo a frequência.";
    resumoBloco.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    resumoBloco.classList.add('cor3');
    resumoTxt.classList.remove('cor1', 'cor2', 'cor3', 'cor4');
    resumoTxt.classList.add('cor3');
}