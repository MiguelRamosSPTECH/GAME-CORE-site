function getDadosByBucketClient(apelidoServidor) {
    let nomeServidorMockado = "00-D7-6D-98-56-34";
    let diaDeHoje = new Date()
    let mes = diaDeHoje.getMonth() + 1;
    let dia = diaDeHoje.getDate();
    let ano = diaDeHoje.getFullYear();

    //para pegar a pasta correta la no bucket
    let timestamp = `${ano}-${mes}-${dia}`;
    // let macaddress = 

    fetch(`/s3Route/dados/${timestamp}/${nomeServidorMockado}/dados_capturados.json`, {
        method: "GET"
    })
    .then(async resposta => {
        let retorno = await resposta.json();
        console.log(retorno)
        let areaKpis = document.getElementsByClassName('kpi');
        for(let i=0;i<areaKpis.length;i++) {
            console.log(areaKpis[i])
            let nomeKpi = areaKpis[i].children[0].textContent.replaceAll(" ","_").toLowerCase();
            let metricaKpi = areaKpis[i].children[2].children[1].children[0].children[1].textContent.split(".");

            metricaKpi = metricaKpi[1].replace(/\d/g, '')

            if(metricaKpi == "%") {
                nomeKpi+="_porcentagem"
            } else {
                nomeKpi+=`_${metricaKpi.toLowerCase()}`
            }
            let dadoComponente = retorno[retorno.length-1][nomeKpi]
            areaKpis[i].children[1].children[0].textContent = `${dadoComponente}`
            

        }
    })
    // setTimeout(() => {
    //     getDadosByBucketClient("nada")
    // }, 5000)
}