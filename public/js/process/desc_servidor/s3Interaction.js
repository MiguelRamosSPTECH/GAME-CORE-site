let diaDeHoje = new Date()
let mes = diaDeHoje.getMonth() + 1;
let dia = diaDeHoje.getDate() < 10 ? `${0}${diaDeHoje.getDate()}` : diaDeHoje.getDate();
let ano = diaDeHoje.getFullYear();
let timestamp = `${ano}-${mes}-01`;
let nomeServidorMockado = "00-D7-6D-98-56-34";

var chart;

             const options = {

                title: {
                    text: 'Uso dos containers comparados',
                    align: 'left',
                    style: {
                        fontSize: '18px',
                        color: '#f1f1f1' // Cor do título (combinando com o foreColor)
                    }
                },                


                series: [
                    {
                        name: "Uso de CPU (%)", // Cor 1: Roxo
                        data: []
                    },
                    {
                        name: "Throughput (Requisições/s)", // Cor 2: Azul
                        data: []
                    }, 
                    {
                        name: "Uso de RAM (GB)", // Cor 3: Laranja
                        data: []
                    },
                ],
                chart: {
                    type: 'bar',
                    height: 430,
                    width: 400,
                    toolbar: {
                        show: false
                    }
                },
                // Cores: 1. Roxo, 2. Azul, 3. Laranja
                colors: ['#9c18daff', '#008FFB', '#e76e0bff'],
                foreColor: '#f1f1f1', // Cor do texto e eixos
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            position: 'top',
                            offsetX: 0,
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    offsetX: -6,
                    style: {
                        fontSize: '13px',
                        colors: ['#ffffff'],
                        
                    },
                },
                stroke: {
                    show: true,
                    width: 1,
                    colors: ['#fff'],
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    theme: 'dark'
                },
                xaxis: {
                    categories: ["mc-server-1", "mc-server-2", "mc-server-3"],
                    labels: {
                        style: {
                            colors: '#f1f1f1',
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: '#f1f1f1',
                        }
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        colors: '#f1f1f1',
                    }
                }
            };

chart = new ApexCharts(document.querySelector("#grafico-barra"), options);
chart.render();

function atualizaGrafico(dadoRam, dadoCpu, dadoIo) {
    console.log("dardo: ",dadoRam)
    const novoDataSeries = [
        {
            name: "Uso de RAM (%)",
            data: dadoRam
        },
        {
            name: "Uso de CPU (%)",
            data: dadoCpu
        },
        {
            name: "Throughput (I/O)",
            data: dadoIo
        }
    ];

    chart.updateSeries(novoDataSeries) //magia essa biblioteca aikkkk
}


async function getDadosByBucketClient(apelidoServidor) {


    fetch(`/s3Route/dados/${timestamp}/${nomeServidorMockado}/dados_capturados.json`, {
        method: "GET"
    })
    .then(async resposta => {
        let retorno = await resposta.json();
        let areaKpis = document.getElementsByClassName('kpi');
        for(let i=0;i<areaKpis.length;i++) {
            let corBordaKpi = ''
            let nomeKpi = areaKpis[i].children[0].textContent.replaceAll(" ","_").toLowerCase();
            let metricaKpi = areaKpis[i].children[2].children[1].children[0].children[1].textContent.split(".");
            let faixaLeve = Number((areaKpis[i].children[2].children[1].children[0].children[1].textContent).replace(/[^0-9.]/g, ''));
            let faixaGrave = Number((areaKpis[i].children[2].children[1].children[1].children[1].textContent).replace(/[^0-9.]/g, ''));
            let barraProgresso = areaKpis[i].children[2].children[0].children[0]
            let metricaKpi1 = metricaKpi.length > 1 ? metricaKpi[1].replace(/\d/g, '').trim() : metricaKpi[0].replace(/\d/g, '').trim()
            if(metricaKpi1 == "%") {
                nomeKpi+="_porcentagem"
            } else {
                nomeKpi+=`_${metricaKpi1.toLowerCase()}`
            }
            let dadoComponente = retorno[retorno.length-1][nomeKpi]
            barraProgresso.style.width = `${dadoComponente}%`


            if(Number(dadoComponente) > faixaGrave) {
                corBordaKpi = "5px solid #f3464a";
            } else if(Number(dadoComponente) > faixaLeve) {
                corBordaKpi = "5px solid #fad73e";
            }
            areaKpis[i].style.borderLeft  = `${corBordaKpi}`
            areaKpis[i].children[1].children[0].textContent = `${dadoComponente}`
            

        }
    })
}

async function getDadosByBucketClientContainer(apelidoServidor) {
    fetch(`/s3Route/dados/${timestamp}/${nomeServidorMockado}/dados_containers_1.json`, {
        method: "GET"
    })
    .then(async resposta => {
        let retorno = await resposta.json();
        let registroMaisRecente = retorno[retorno.length-1]
        let pegaDataMaisRecente = Object.keys(registroMaisRecente)[0];
        let dadosContainersMaisRecente = registroMaisRecente[pegaDataMaisRecente]

        let valueSelectContainer = document.getElementById('filtro-container').value;
        let dadoKpiThrottled = document.getElementById('throttled_kpi');
        let dadoKpiTick = document.getElementById('tick_kpi');

        let throttled_data
        let tick_data
        if(valueSelectContainer != "none") {
            throttled_data = dadosContainersMaisRecente[valueSelectContainer].throttled_time_container
            tick_data = dadosContainersMaisRecente[valueSelectContainer].tps_container
        } else {
            throttled_data = Math.round((dadosContainersMaisRecente[0].throttled_time_container + dadosContainersMaisRecente[1].throttled_time_container + dadosContainersMaisRecente[2].throttled_time_container) /3,2)
            tick_data = Math.min((dadosContainersMaisRecente[0].tps_container + dadosContainersMaisRecente[1].tps_container + dadosContainersMaisRecente[2].tps_container) /3,20)
        }

        if(Number(tick_data) < 20) {
            dadoKpiTick.style.color = "red"
        } else {
            dadoKpiTick.style.color = "green"
        }
        
        if(Number(throttled_data) >= 4) {
            dadoKpiThrottled.style.color = "#e61c1cff"
        } else if(Number(throttled_data) >= 2) {
            dadoKpiThrottled.style.color = "#fad73e"
        } else {
            dadoKpiThrottled.style.color = "white"
        }
        console.log(dadosContainersMaisRecente[0])
        //area para atualizar o gráfico:
        let dadosRam = [dadosContainersMaisRecente[0].ram_container,dadosContainersMaisRecente[1].ram_container,dadosContainersMaisRecente[2].ram_container]
        let dadosCpu = [dadosContainersMaisRecente[0].cpu_container,dadosContainersMaisRecente[1].cpu_container,dadosContainersMaisRecente[2].cpu_container]
        let dadosIo = [dadosContainersMaisRecente[0].throughput_container, dadosContainersMaisRecente[1].throughput_container, dadosContainersMaisRecente[2].throughput_container]

        dadoKpiThrottled.innerHTML = throttled_data
        dadoKpiTick.innerText = Math.round(tick_data,2)
        atualizaGrafico(dadosRam, dadosCpu, dadosIo)
    })

    // setTimeout(() => {
    //     getDadosByBucketClientContainer("nada")
    // }, 4000)

}

async function getDadosByBucketClientProcess(apelidoServidor) {
    fetch(`/s3Route/dados/${timestamp}/${nomeServidorMockado}/dados_processos.json`, {
        method: "GET"
    })
    .then(async resposta => {
        let retorno = await resposta.json();
        let registroMaisRecente = retorno[retorno.length-1]
        let pegaDataMaisRecente = Object.keys(registroMaisRecente)[0];
        let dadosProcessos = registroMaisRecente[pegaDataMaisRecente]

        let listaProcessos = document.getElementById('list_process_servidor');

        dadosProcessos.forEach(processo => {
            let nomeProcesso = Object.keys(processo);
            listaProcessos.innerHTML+=`
                <tr>
                <td>${nomeProcesso}</td>
                <td>${processo[nomeProcesso].cpu_porcentagem}</td>
                <td>${processo[nomeProcesso].ram_porcentagem}</td>
                <td>${processo[nomeProcesso].throughput_mbs}</td>
                <td class="status-process" style="color: rgb(67, 255, 67);">${processo[nomeProcesso].status.toUpperCase()}</td>
                </tr>            
            `
        });

    })
    .catch(erro => {
        console.log("[ERROR] ", erro)
    })

}