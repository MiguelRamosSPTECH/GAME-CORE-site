let diaDeHoje = new Date()
let mes = diaDeHoje.getMonth() + 1;
let dia = diaDeHoje.getDate();
let ano = diaDeHoje.getFullYear();
let timestamp = `${ano}-${mes}-${dia}`;
let nomeServidorMockado = "00-D7-6D-98-56-34";

async function getDadosByBucketClient(apelidoServidor) {


    fetch(`/s3Route/dados/${timestamp}/${nomeServidorMockado}/dados_capturados.json`, {
        method: "GET"
    })
    .then(async resposta => {
        let retorno = await resposta.json();
        console.log(retorno)
        let areaKpis = document.getElementsByClassName('kpi');
        for(let i=0;i<areaKpis.length;i++) {
            let corBordaKpi = ''
            let nomeKpi = areaKpis[i].children[0].textContent.replaceAll(" ","_").toLowerCase();
            let metricaKpi = areaKpis[i].children[2].children[1].children[0].children[1].textContent.split(".");
            let faixaLeve = Number((areaKpis[i].children[2].children[1].children[0].children[1].textContent).replace(/[^0-9.]/g, ''));
            let faixaGrave = Number((areaKpis[i].children[2].children[1].children[1].children[1].textContent).replace(/[^0-9.]/g, ''));

            let barraProgresso = areaKpis[i].children[2].children[0].children[0]
            let metricaKpi1 = metricaKpi[1].replace(/\d/g, '')

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
    fetch(`/s3Route/dados/${timestamp}/${nomeServidorMockado}/dados_containers.json`, {
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
        }
        
        if(Number(throttled_data) >= 4) {
            dadoKpiThrottled.style.color = "#e61c1cff"
        } else if(Number(throttled_data) >= 2) {
            dadoKpiThrottled.style.color = "#fad73e"
        }

        dadoKpiThrottled.innerHTML = throttled_data
        dadoKpiTick.innerText = tick_data
    })

    setTimeout(() => {
        getDadosByBucketClientContainer("nada")
    }, 4000)

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
            console.log(processo[nomeProcesso])
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