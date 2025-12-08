
const intervaloMS = 60 * 1000
let dash_latencia_grafico = null;
let dash_cpu_grafico = null;
let erro_kpi = null;
let gauge1 = null;
let gauge5 = null;
let gauge15 = null;
let kpiConfianca = null




let nomeServidorMockado = "00-D7-6D-98-56-34";
let diaDeHoje = new Date();
let mes = diaDeHoje.getMonth() + 1;
let dia = diaDeHoje.getDate();
let ano = diaDeHoje.getFullYear();

//para pegar a pasta correta la no bucket
let timestamp = `2025-12-01`;




const ARQUIVO_CONTAINER = 'dados_containers.json';
const URL_API_CONTAINER = `/s3Route/dados/${timestamp}/${nomeServidorMockado}/${ARQUIVO_CONTAINER}`;
const CHAVE_TPS = 'tps_container';

async function carregarKpiLatencia() {

    const dash_latencia = document.getElementById("gauge-kpi-latencia")
    const carregamento = document.getElementById('area-kpi-latencia');
    carregamento.innerHTML = 'Carregando dados...';
    carregamento.style = "color: #fff; font-size: 20px; font-weight: bold;"

    try {

        const respostaContainer = await fetch(URL_API_CONTAINER);

        if (!respostaContainer.ok) {

            const erroDetalhe = await respostaContainer.text();
            throw new Error(`Erro ${respostaContainer.status}: Falha na API: ${erroDetalhe.substring(0, 100)}`);

        }

        const data = await respostaContainer.json();
        console.log(data)


        carregamento.innerHTML = null;
        carregamento.appendChild(dash_latencia);

        if (!Array.isArray(data) || data.length === 0) {

            console.warn("Erro nos dados recebidos");
            carregamento.innerHTML = `<div style="color: orange; padding: 20px;">⚠️ Dados vazios para plotar o gráfico.</div>`;
            return;

        }

        let tpsArray = data.map(d => d[CHAVE_TPS])
        //A PARTIR DAQUI É A LÓGICA DOS VALORES DE TICK

        for (i in tpsArray) if (tpsArray[i] > 20) tpsArray[i] = 20

        tpsArray.sort((a, b) => b - a);

        console.log(tpsArray);
        let tamanhotpsArray = tpsArray.length;

        function calcularMediana(tpsArray) {

            let valorMediano = 0;

            if (tamanhotpsArray % 2 != 0) {

                let indice = Math.floor(tamanhotpsArray / 2);
                valorMediano = tpsArray[indice];

            }
            else {

                let indice1 = tamanhotpsArray / 2 - 1;
                let indice2 = tamanhotpsArray / 2;
                valorMediano = (tpsArray[indice1] + tpsArray[indice2]) / 2;

                return valorMediano;

            }

        }
        console.log("Mediana: " + calcularMediana(tpsArray))


        function calculoLatenciaP95(tpsArray) {

            const posicao95 = Math.ceil(0.95 * tamanhotpsArray);

            let indexP95 = posicao95 - 1;

            return tpsArray[indexP95];

        }
        console.log("Percentil 95: " + calculoLatenciaP95(tpsArray));


        latencia = Math.round(1000 / calcularMediana(tpsArray));
        console.log("Latência P50: " + latencia);

        let porcentagemLatencia = latencia * 100 / 50

        if (porcentagemLatencia > 100) porcentagemLatencia = 100

        var valorAtual = porcentagemLatencia;
        const valorMaximo = 100 //50ms
        let valorRestante = valorAtual - valorMaximo

        console.log("O quanto que a latência capturada está perto do limite no dash (%): " + porcentagemLatencia)

        let taxaRequisicao = document.getElementById("taxa-requisicao");

        function taxaProcs(tpsArray) {

            let qtdRequisicaoAbaixoLimite = 0;

            for (i in tpsArray) {

                if (1000 / tpsArray[i] <= 50) qtdRequisicaoAbaixoLimite++

            }
            let taxaRequisicaoAbaixoLimite = Math.round((qtdRequisicaoAbaixoLimite / tpsArray.length) * 100);
            return taxaRequisicaoAbaixoLimite;

        }
        console.log("Taxa de procs que estão abaixo ou iguais ao limite de 50ms: " + taxaProcs(tpsArray))

        taxaRequisicao.innerHTML = taxaProcs(tpsArray)

        //A PARTIR DAQUI É O GRÁFICO DE "GAUGE"

        if (dash_latencia_grafico) {

            dash_latencia_grafico.destroy(); //Destruir o gráfico se ele já existir

        }

        Chart.defaults.color = '#FFFFFF'

        dash_latencia_grafico = new Chart(dash_latencia, {
            type: 'doughnut',
            data: {
                labels: ["valor", "falta"],
                datasets: [{
                    data: [valorAtual, valorRestante],
                    backgroundColor: ['#4CAF50', '#E0E0E0'],
                    borderWidth: 0
                }]
            },
            plugins: [{
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 22px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#ffffffff"
                    ctx.fillText(`${latencia}ms`, x, y);
                }
            }],
            options: {
                rotation: -90,
                circumference: 180,
                cutout: "70%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

    } catch (error) {

        console.error("Erro ao carregar ou plotar dados:", error);
        carregamento.innerHTML = `<div style="color: red; padding: 20px;"> Falha ao carregar dados. ${error.message}</div>`;

    }
}
















const ARQUIVO_ERRO = 'dados_processos.json';
const URL_API_ERRO = `/s3Route/dados/${timestamp}/${nomeServidorMockado}/${ARQUIVO_ERRO}`;
const CHAVE_ERRO = 'status';

async function carregarProbErro() {

    let kpi_erro = document.getElementById("taxa-erro");
    kpi_erro.style = "color: #4CAF50; font-size: 70px; font-weight: bold;"
    const carregamento = document.getElementById('prob-falha');
    carregamento.innerHTML = 'Carregando dados...';
    carregamento.style = "color: #fff; font-size: 20px; font-weight: bold;"

    try {

        const respostaErro = await fetch(URL_API_ERRO);

        if (!respostaErro.ok) {

            const erroDetalhe = await respostaErro.text();
            throw new Error(`Erro ${respostaErro.status}: Falha na API: ${erroDetalhe.substring(0, 100)}`);

        }

        const data = await respostaErro.json();

        carregamento.innerHTML = null;
        carregamento.appendChild(kpi_erro);


        if (!Array.isArray(data) || data.length === 0) {

            console.warn("Erro nos dados recebidos");
            carregamento.innerHTML = `<div style="color: orange; padding: 20px;">⚠️ Dados vazios para plotar o gráfico.</div>`;
            return;

        }


        //A PARTIR DAQUI É A LÓGICA DOS VALORES DE ERROS

        const taxaErro = data.map(d => d[CHAVE_ERRO]);
        console.log(taxaErro)

        function calculoProbErro(taxaErro) {

            let qtdProcsErro = 0;

            for (i in taxaErro) if (taxaErro[i] == "Zombie" || taxaErro[i] == "Stopped" || taxaErro[i] == "Uninterruptible Sleep") qtdProcsErro++

            let probFalhaSist = (qtdProcsErro / taxaErro.length) * 100

            return probFalhaSist;

        }
        console.log("Resultado da função que calcula os erros: " + calculoProbErro(taxaErro))
        kpi_erro.innerHTML = calculoProbErro(taxaErro) + "%";

        return calculoProbErro(taxaErro);

    } catch (error) {

        console.error("Erro ao carregar ou plotar dados:", error);
        carregamento.innerHTML = `<div style="color: red; padding: 20px;"> Falha ao carregar dados. ${error.message}</div>`;

    }

}




        var valorAtual = 100;
        const valorMaximo = 100 //50ms
        let valorRestante = valorAtual - valorMaximo



        const dash_erro = document.getElementById("gauge-latencia-erro")

        new Chart(dash_erro, {
            type: 'doughnut',
            data: {
                labels: ["valor", "falta"],
                datasets: [{
                    data: [valorAtual, valorRestante],
                    backgroundColor: ['#4CAF50', '#E0E0E0'],
                    borderWidth: 0,
                }]
            },
            plugins: [{
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 30px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#4CAF50"
                    ctx.fillText("100%", x, y);
                }
            }],
            options: {
                rotation: -90,
                circumference: 180,
                cutout: "70%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });




















const ARQUIVO_AVG = 'dados_capturados.json';
const URL_API_AVG = `/s3Route/dados/${timestamp}/${nomeServidorMockado}/${ARQUIVO_AVG}`;
const CHAVE_AVG = 'cpu_loadavg';

async function procLoadAvg() {

    let dash_gauge_carga1 = document.getElementById("gauge-carga1")
    let dash_gauge_carga5 = document.getElementById("gauge-carga5")
    let dash_gauge_carga15 = document.getElementById("gauge-carga15")

    //let carregamentoC1 = document.getElementById('real-grafico-cargaC1');
    let carregamentoC2 = document.getElementById('real-grafico-cargaC2');
    //let carregamentoC3 = document.getElementById('real-grafico-cargaC3');

    carregamentoC2.innerHTML = 'Carregando dados...';
    carregamentoC2.style = "color: #fff; font-size: 20px; font-weight: bold;"

    try {

        const respostaAVG = await fetch(URL_API_AVG);

        if (!respostaAVG.ok) {

            const erroDetalhe = await respostaAVG.text();
            throw new Error(`Erro ${respostaAVG.status}: Falha na API: ${erroDetalhe.substring(0, 100)}`);

        }

        const data = await respostaAVG.json();
        console.log(data)

        carregamentoC2.innerHTML = null;
        carregamentoC2.appendChild(dash_gauge_carga5);


        if (!Array.isArray(data) || data.length === 0) {

            console.warn("Erro nos dados recebidos");
            carregamentoC2.innerHTML = `<div style="color: orange; padding: 20px;">⚠️ Dados vazios para plotar o gráfico.</div>`;
            return;

        }


        //A PARTIR DAQUI É A LÓGICA DOS VALORES DE AVG

        const loadAvg = data.map(d => d[CHAVE_AVG]);
        console.log("AQUI LOAD AVGGGGGGGGGGGGGGG")
        console.log(loadAvg)



        function loadAvgParaNumerico(loadAvg) {

            let loadAvgCorrigido = []

            for (let i = 0; i < loadAvg.length; i++) {

                let stringLoadAvg = loadAvg[i];

                let partes3LoadAvg = stringLoadAvg.split(',').map(avg => avg.trim());

                if (partes3LoadAvg[0][0] == NaN) {
                    partes3LoadAvg[0][0] = 0.0;
                }

                let avgCorrigido = [


                    parseFloat(partes3LoadAvg[0]), //refere-se ao valor de 1 minuto das 3 partes
                    parseFloat(partes3LoadAvg[1]), //refere-se ao valor de 5 minuto das 3 partes
                    parseFloat(partes3LoadAvg[2]) //refere-se ao valor de 15 minuto das 3 partes

                ];

                loadAvgCorrigido.push(avgCorrigido);

            }

            return loadAvgCorrigido;

        }

        for (let i = 0; i < loadAvg.length; i++) {

            for (let j = 0; j < loadAvg.length; j++) {

                if (loadAvgParaNumerico(loadAvg)[i][j] == NaN) {

                    loadAvgParaNumerico(loadAvg)[i][j] = 0.0;

                }

            }

        }
        console.log(loadAvgParaNumerico(loadAvg));



        if (gauge1) {
            gauge1.destroy();
        }
        if (gauge5) {
            gauge5.destroy();
        }
        if (gauge15) {
            gauge15.destroy();
        }

        gauge1 = new Chart(dash_gauge_carga1, {
            type: 'doughnut',
            data: {
                labels: ["valor", "falta"],
                datasets: [{
                    data: [0.2, 1],
                    backgroundColor: ['#41b8d5', '#6ce5e8'],
                    borderWidth: 0
                }]
            },
            plugins: [{
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 12px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#fff"
                    ctx.fillText("2 procs", x, y);
                }
            }],
            options: {
                rotation: -90,
                circumference: 180,
                cutout: "70%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });





        gauge5 = new Chart(dash_gauge_carga5, {
            type: 'doughnut',
            data: {
                labels: ["valor", "falta"],
                datasets: [{
                    data: [0.42, 1],
                    backgroundColor: ['#41b8d5', '#6ce5e8'],
                    borderWidth: 0
                }]
            },
            plugins: [{
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 12px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#fff"
                    ctx.fillText("4.2 procs", x, y);
                }
            }],
            options: {
                rotation: -90,
                circumference: 180,
                cutout: "70%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });


        gauge15 = new Chart(dash_gauge_carga15, {
            type: 'doughnut',
            data: {
                labels: ["valor", "falta"],
                datasets: [{
                    data: [0.52, 1],
                    backgroundColor: ['#41b8d5', '#6ce5e8'],
                    borderWidth: 0
                }]
            },
            plugins: [{
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 12px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#fff"
                    ctx.fillText("5.2 procs", x, y);
                }
            }],
            options: {
                rotation: -90,
                circumference: 180,
                cutout: "70%",
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    } catch (error) {

        console.error("Erro ao carregar ou plotar dados:", error);
        carregamentoC2.innerHTML = `<div style="color: red; padding: 20px;"> Falha ao carregar dados. ${error.message}</div>`;

    }

}




























const ARQUIVO_HOST = 'dados_containers.json';
const URL_API_HOST = `/s3Route/dados/${timestamp}/${nomeServidorMockado}/${ARQUIVO_HOST}`;
const TIMESTAMP = 'timestamp';
const MEDIA_CPU_AGREGADA = 'cpu_container';

async function carregarGraficoCpuAgregada() {

    const ctx = document.getElementById('cpu-agregada');
    const carregamento = document.getElementById('area-grafico-cpu-agregada');
    carregamento.innerHTML = 'Carregando dados...';
    carregamento.style = "color: #fff; font-size: 20px; font-weight: bold;"


    try {


        const resposta = await fetch(URL_API_HOST);


        if (!resposta.ok) {
            const erroDetalhe = await resposta.text();
            throw new Error(`Erro ${resposta.status}: Falha na API: ${erroDetalhe.substring(0, 100)}`);
        }

        const data = await resposta.json();

        carregamento.innerHTML = null;
        carregamento.appendChild(ctx); //Garante que o canvas volte


        if (!Array.isArray(data) || data.length === 0) {
            console.warn("Erro nos dados recebidos");
            carregamento.innerHTML = `<div style="color: orange; padding: 20px;">⚠️ Dados vazios para plotar o gráfico.</div>`;
            return;
        }


        const labels = data.map(d => d[TIMESTAMP]);
        const valores = data.map(d => Number(d[MEDIA_CPU_AGREGADA]) || 0);

        let timestamp = [];

        for (let i = 0; i < labels.length; i++) {

            timestamp.push(labels[i].substring(11, 19));
            //console.log("Timestamp corrigido: " + timestamp);

            if (i == 9) break;

        }

        const labelsTemp = timestamp.map(m => m.substring(0, 5))
        console.log(labelsTemp)
        console.log(timestamp)

        Chart.defaults.color = '#FFFFFF'

        if (dash_cpu_grafico) {

            dash_cpu_grafico.destroy();

        }

        let dash_cpu = document.getElementById("cpu-agregada");
        const limiteMaximo = 85;

        const linhaLimite = {
            afterDraw({ ctx, chartArea, scales: { y } }) {
                const ypos = y.getPixelForValue(limiteMaximo);
                ctx.strokeStyle = 'red';
                ctx.setLineDash([5]);
                ctx.beginPath();
                ctx.moveTo(chartArea.left, ypos);
                ctx.lineTo(chartArea.right, ypos);
                ctx.stroke();
            }
        };


        dash_cpu_grafico = new Chart(dash_cpu, {
            type: 'line',
            data: {
                labels: labelsTemp,
                datasets: [{
                    label: `Consumo de CPU (%)`,
                    data: valores,
                    borderwidth: 2,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
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
            plugins: [linhaLimite]
        });

    } catch (error) {

        console.error("Erro ao carregar ou plotar dados:", error);
        carregamento.innerHTML = `<div style="color: red; padding: 20px;"> Falha ao carregar dados. ${error.message}</div>`;

    }
}


function inicializador() {

    carregarKpiLatencia();
    carregarProbErro();
    procLoadAvg();
    carregarGraficoCpuAgregada();

};

async function intervaloLoop() {

    await inicializador();
    setInterval(inicializador, intervaloMS);

}

//function pararLoop(){
//
//    clearInterval(intervaloIDLoop);
//    console.log(`Polling parado. ID do Intervalo: ${intervaloIDLoop}`);
//
//}

window.onload = intervaloLoop();