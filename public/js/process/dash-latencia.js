
const intervaloMS = 60 * 1000
let dash_latencia_grafico = null;
let dash_cpu_grafico = null;
let erro_kpi = null;




let nomeServidorMockado = "00-D7-6D-98-56-34";
let diaDeHoje = new Date()
let mes = diaDeHoje.getMonth() + 1;
let dia = diaDeHoje.getDate();
let ano = diaDeHoje.getFullYear();

//para pegar a pasta correta la no bucket
let timestamp = `${ano}-${mes}-0${dia}`;








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

        let capturaTicks = []

        for (i in data) capturaTicks.push(Object.values(data[i]))

        console.log(capturaTicks);

        const todosOsTps = capturaTicks.map(container => {
            // Para cada item ('container'), retorne o valor da propriedade 'tps_container'
            return container;
        });

        console.log(todosOsTps)




        carregamento.innerHTML = null;
        carregamento.appendChild(dash_latencia);

        if (!Array.isArray(data) || data.length === 0) {

            console.warn("Erro nos dados recebidos");
            carregamento.innerHTML = `<div style="color: orange; padding: 20px;">⚠️ Dados vazios para plotar o gráfico.</div>`;
            return;

        }




        //A PARTIR DAQUI É A LÓGICA DOS VALORES DE TICK

        //        for (i in tpsArray) if (tpsArray[i] > 20) tpsArray[i] = 20
        //
        //        tpsArray.sort((a, b) => b - a);
        //
        //        console.log(tpsArray);
        //        let tamanhotpsArray = tpsArray.length;
        //
        //        function calcularMediana(tpsArray) {
        //
        //            let valorMediano = 0;
        //
        //            if (tamanhotpsArray % 2 != 0) {
        //
        //                let indice = Math.floor(tamanhotpsArray / 2);
        //                valorMediano = tpsArray[indice];
        //
        //            }
        //            else {
        //
        //                let indice1 = tamanhotpsArray / 2 - 1;
        //                let indice2 = tamanhotpsArray / 2;
        //                valorMediano = (tpsArray[indice1] + tpsArray[indice2]) / 2;
        //
        //                return valorMediano;
        //
        //            }
        //
        //        }
        //        console.log("Mediana: " + calcularMediana(tpsArray))
        //
        //
        //        function calculoLatenciaP95(tpsArray) {
        //
        //            const posicao95 = Math.ceil(0.95 * tamanhotpsArray);
        //
        //            let indexP95 = posicao95 - 1;
        //
        //            return tpsArray[indexP95];
        //
        //        }
        //        console.log("Percentil 95: " + calculoLatenciaP95(tpsArray));
        //
        //
        //        latencia = Math.round(1000 / calcularMediana(tpsArray));
        //        console.log("Latência P50: " + latencia);
        //
        //        let porcentagemLatencia = latencia * 100 / 50
        //
        //        if (porcentagemLatencia > 100) porcentagemLatencia = 100
        //
        //        var valorAtual = porcentagemLatencia;
        //        const valorMaximo = 100 //50ms
        //        let valorRestante = valorAtual - valorMaximo
        //
        //        console.log("O quanto que a latência capturada está perto do limite no dash (%): " + porcentagemLatencia)
        //
        //        let taxaRequisicao = document.getElementById("taxa-requisicao");
        //
        //        function taxaProcs(tpsArray) {
        //
        //            let qtdRequisicaoAbaixoLimite = 0;
        //
        //            for (i in tpsArray) {
        //
        //                if (1000 / tpsArray[i] <= 50) qtdRequisicaoAbaixoLimite++
        //
        //            }
        //            let taxaRequisicaoAbaixoLimite = Math.round((qtdRequisicaoAbaixoLimite / tpsArray.length) * 100);
        //            return taxaRequisicaoAbaixoLimite;
        //
        //        }
        //        console.log("Taxa de procs que estão abaixo ou iguais ao limite de 50ms: " + taxaProcs(tpsArray))
        //
        //        taxaRequisicao.innerHTML = taxaProcs(tpsArray)
        //
        //        //A PARTIR DAQUI É O GRÁFICO DE "GAUGE"
        //
        //        if (dash_latencia_grafico) {
        //
        //            dash_latencia_grafico.destroy(); //Destruir o gráfico se ele já existir
        //
        //        }
        //
        //        Chart.defaults.color = '#FFFFFF'
        //
        //        dash_latencia_grafico = new Chart(dash_latencia, {
        //            type: 'doughnut',
        //            data: {
        //                labels: ["valor", "falta"],
        //                datasets: [{
        //                    data: [valorAtual, valorRestante],
        //                    backgroundColor: ['#4CAF50', '#E0E0E0'],
        //                    borderWidth: 0
        //                }]
        //            },
        //            plugins: [{
        //                afterDraw(c) {
        //                    let ctx = c.ctx,
        //                        x = c.width / 2,
        //                        y = c.height / 1.05;
        //                    ctx.font = "bold 22px sans-serif";
        //                    ctx.textAlign = "center";
        //                    ctx.fillStyle = "#ffffffff"
        //                    ctx.fillText(`${latencia}ms`, x, y);
        //                }
        //            }],
        //            options: {
        //                rotation: -90,
        //                circumference: 180,
        //                cutout: "70%",
        //                plugins: {
        //                    legend: { display: false },
        //                    tooltip: { enabled: false }
        //                }
        //            }
        //        });

    } catch (error) {

        console.error("Erro ao carregar ou plotar dados:", error);
        carregamento.innerHTML = `<div style="color: red; padding: 20px;"> Falha ao carregar dados. ${error.message}</div>`;

    }
}
















const ARQUIVO_ERRO = 'processos_metrics.json';
const URL_API_ERRO = `/s3Route/dados/${ARQUIVO_ERRO}`;
const CHAVE_ERRO = 'status';

async function carregarProbErro() {

    let kpi_erro = document.getElementById("taxa-erro");
    kpi_erro.style = "color: #fff; font-size: 70px; font-weight: bold;"
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



    } catch (error) {

        console.error("Erro ao carregar ou plotar dados:", error);
        carregamento.innerHTML = `<div style="color: red; padding: 20px;"> Falha ao carregar dados. ${error.message}</div>`;

    }

}


















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
        afterDraw(c) {
            let ctx = c.ctx,
                x = c.width / 2,
                y = c.height / 1.05;
            ctx.font = "bold 30px sans-serif";
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
            legend: { display: false },
            tooltip: { enabled: false }
        }
    }
});















const ARQUIVO_AVG = 'host_metrics.json';
const URL_API_AVG = `/s3Route/dados/${ARQUIVO_AVG}`;
const CHAVE_AVG = 'cpuLoadAvg';

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

        carregamentoC2.innerHTML = null;
        carregamentoC2.appendChild(dash_gauge_carga5);


        if (!Array.isArray(data) || data.length === 0) {

            console.warn("Erro nos dados recebidos");
            carregamentoC2.innerHTML = `<div style="color: orange; padding: 20px;">⚠️ Dados vazios para plotar o gráfico.</div>`;
            return;

        }


        //A PARTIR DAQUI É A LÓGICA DOS VALORES DE AVG

        const loadAvg = data.map(d => d[CHAVE_AVG]);

        function loadAvgParaNumerico(loadAvg) {

            let loadAvgCorrigido = []

            for (let i = 0; i < loadAvg.length; i++) {

                let stringLoadAvg = loadAvg[i];

                let partes3LoadAvg = stringLoadAvg.split(',').map(avg => avg.trim());

                let avgCorrigido = [

                    parseFloat(partes3LoadAvg[0]), //refere-se ao valor de 1 minuto das 3 partes
                    parseFloat(partes3LoadAvg[1]), //refere-se ao valor de 5 minuto das 3 partes
                    parseFloat(partes3LoadAvg[2]) //refere-se ao valor de 15 minuto das 3 partes

                ];

                loadAvgCorrigido.push(avgCorrigido);

            }

            return loadAvgCorrigido;

        }
        console.log(loadAvgParaNumerico(loadAvg))


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
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 12px sans-serif";
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
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });





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
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 12px sans-serif";
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
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });


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
                afterDraw(c) {
                    let ctx = c.ctx,
                        x = c.width / 2,
                        y = c.height / 1.05;
                    ctx.font = "bold 12px sans-serif";
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




























const ARQUIVO_HOST = 'containers_metrics.json';
const URL_API_HOST = `/s3Route/dados/${ARQUIVO_HOST}`;
const TIMESTAMP = 'timestamp';
const MEDIA_CPU_AGREGADA = 'cpu_container';

async function carregarGraficoCpuAgregada() {

    // Referência ao canvas principal e ao container auxiliar para mensagens de erro
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

        for (i in labels) timestamp.push(labels[i].substring(11, 19))
        console.log("Timestamp corrigido: " + timestamp)


        Chart.defaults.color = '#FFFFFF'

        if (dash_cpu_grafico) {

            dash_cpu_grafico.destroy();

        }

        let dash_cpu = document.getElementById("cpu-agregada");
        const limiteMaximo = 70;

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
                labels: timestamp,
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
                scales: {
                    y: {
                        beginAtZero: true
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
    //carregarGraficoCpuAgregada();
    //carregarProbErro();
    //procLoadAvg();


};

async function intervaloLoop() {

    await inicializador();
    setInterval(inicializador, intervaloMS)

}

//function pararLoop(){
//
//    clearInterval(intervaloIDLoop);
//    console.log(`Polling parado. ID do Intervalo: ${intervaloIDLoop}`);
//
//}

window.onload = intervaloLoop();