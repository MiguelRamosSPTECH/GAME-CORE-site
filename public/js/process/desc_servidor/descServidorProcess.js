
function loadAll() {
    validarSessao()
    listarChamados() 
}

var chart;

 var options = {
  
        series: [
            {
                data: [53, 32, 33]
            },
            {
                data: [44, 55, 41]
            }, 
            {
                data: [12, 17, 11]
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
        colors: ['#9c18daff', '#008FFB', '#e76e0bff'],
        foreColor: '#ffffffff',
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '13px',
            colors: ['#ffffffff'],
            
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
        }
    };

chart = new ApexCharts(document.querySelector("#grafico-barra"), options);
chart.render();

function atualizaGrafico(dadoRam, dadoCpu, dadoIo) {
    console.log("dardo: ",dadoRam)
    const novoDataSeries = [
        {data: dadoRam},
        {data: dadoCpu},
        {data: dadoIo}
    ];

    chart.updateSeries(novoDataSeries) //magia essa biblioteca aikkkk
}


function getIdByApelido(nomeServidorMonitorando) {
    console.log("NOME SERVIDOR MONITORANDO: ",nomeServidorMonitorando)
    fetch(`/servidores/getByApelido/${nomeServidorMonitorando}`, {
        method: "GET"
    })
    .then(async resposta => {
        const retorno = await resposta.json()
        sessionStorage.ID_SERVIDOR_MONITORANDO = retorno[0].id;
        console.log("retorno do servidor a ser monitorado: ", retorno)
        
        getDadosByBucketClient(retorno[0].macadress)

        let dadosAtualiza = getDadosByBucketClientContainer(retorno[0].macadress)
        console.log("dados att:", dadosAtualiza)
        // atualizaGrafico(dadosAtualiza[0], dadosAtualiza[1], dadosAtualiza[2])

        getDadosByBucketClientProcess(retorno[0].macadress)

        verificaLayoutServidor()
    })
}



function verificaLayoutServidor() {
    const idServidor = sessionStorage.ID_SERVIDOR_MONITORANDO;
    let areaCardsComponentes = document.getElementsByClassName("opcoes-metricas")

    fetch(`/servidores/dataLayoutsServidor/${idServidor}`, {
        method: "GET",
    })
    .then(async response => {
        if (response.ok) {
            let data = await response.json();
            nome_servidor.innerText = `SERVIDOR - ${data[0].apelido}`;
            let configs_layout = null
            //buscando layout em uso e seus dados
            if(data[0].nomeLayout == null){
                await fetch(`/layouts/buscarLayoutConfiguracao/${sessionStorage.ID_EMPRESA}`, {
                    method: "GET",
                })
                .then(async response => {
                    if (response.ok) {
                        let layoutData = await response.json();
                        select_configurations.innerText = `${layoutData[0].nomeLayout}`;
                        configs_layout = layoutData;

                        //carregando kpis 
                        carregaKpis(layoutData)
                    } else {
                        throw new Error("Erro ao buscar configuração do layout");
                    }
                })
                .catch(error => {
                    console.error("Erro ao obter configuração do layout:", error);
                });
            }  else  {
                select_configurations.innerText = `${data[0].nomeLayout}`;

            }   
            // jogando a config para os modal que muda temporariamente a config do servidor
            for(let i = 0; i < areaCardsComponentes.length; i++){
                let nomeComponenteModal = areaCardsComponentes[i].children[0].innerText.trim()
                const achouComponente = configs_layout.find(layout => layout.nomeComponente.replaceAll("_"," ") == nomeComponenteModal);
                if(achouComponente) {
                    let areaOpcoes = Array.from(areaCardsComponentes[i].children[1].getElementsByClassName('opcao'))
                    let areaAlertas = areaCardsComponentes[i].children[2].querySelectorAll('input')
                    const pegaInput = areaCardsComponentes[i].querySelector('.check-componente')
                    pegaInput.click()

                    areaOpcoes.filter(area_opcao => {
                        configs_layout.find(layout => { 
                            if((layout.unidadeMedida == area_opcao.innerText.trim()) != undefined) {
                                area_opcao.children[0].click()
                            }
                        })
                    })
                    areaAlertas[0].value = achouComponente.alertaLeve;
                    areaAlertas[1].value = achouComponente.alertaGrave;
                    

                }

            }  

        } else {
            console.error("Nenhum dado de layout encontrado para o servidor especificado.");
        }
    })
    .catch(error => {
        console.error("Erro ao obter dados de layout do servidor:", error);
    });
   
}   

function carregaKpis(dados_config) {
    let areaKpis = document.getElementById('area_kpis_servidor');
    
    dados_config.forEach(linhaConfig => {
        let leve = Number(linhaConfig.alertaLeve)
        let grave = Number(linhaConfig.alertaGrave)
        let diff = grave - leve;
        areaKpis.innerHTML+=`
                                <div class="kpi">
                                    <div class="title-kpi">${linhaConfig.nomeComponente.replaceAll("_"," ")}</div>
                                    <div class="dados-kpi">
                                        <div class="dado-porcentagem">
                                            </div>
                                    </div>
                                    <div class="progresso-kpi">
                                        <div class="barra-fundo">
                                            <div class="progresso-barra">
                                            </div>
                                                <div style="left:${leve}%" class="bar-moderated"></div>
                                                <div style="left:${grave}%" class="bar-alert"></div>
                                        </div>
                                        <label>
                                            <span><span style="color: #ac9305;font-weight: 900;">|</span> Leve -<span class="moderado-legend lgnd"> ${linhaConfig.alertaLeve}${linhaConfig.unidadeMedida}</span></span>
                                            <span><span style="color: #ac0509;font-weight: 900;">|</span> Grave -<span class="grave-legend lgnd"> ${linhaConfig.alertaGrave}${linhaConfig.unidadeMedida}</span></span>
                                        </label>
                                    </div>
                                </div>        
        `
    });

}


function allServidores() {
    let idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/servidores/allServidores/${idEmpresa}`, {
        method:"GET"
    })
    .then(async resposta => {
        const dados = await resposta.json();
        console.log("DADOS:", dados)
    })
}