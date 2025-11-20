
function verificaLayoutServidor() {
    const urlParams = new URLSearchParams(window.location.search);
    const idServidor = urlParams.get('idServidor');
    let areaCardsComponentes = document.getElementsByClassName("card-componente")

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
                await fetch(`/layouts/buscarLayoutConfiguracao/${sessionStorage.ID_LAYOUT}/${sessionStorage.ID_EMPRESA}`, {
                    method: "GET",
                })
                .then(async response => {
                    if (response.ok) {
                        let layoutData = await response.json();
                        select_configurations.innerText = `${layoutData[0].nomeLayout}`;
                        configs_layout = layoutData;
                    } else {
                        throw new Error("Erro ao buscar configuração do layout.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao obter configuração do layout:", error);
                });
            }  else  {
                select_configurations.innerText = `${data[0].nomeLayout}`;
                configs_layout = data;
            }
            console.log(configs_layout)
            //jogando a config para os modal que muda temporariamente a config do servidor
            for(let i = 0; i < areaCardsComponentes.length; i++){
                if(areaCardsComponentes[i].children[0].innerText.includes(configs_layout[i].nomeComponente)) {
                    for(let j = 0; j < areaCardsComponentes[i].children[1].children.length; j++){
                        console.log(areaCardsComponentes[i].children[1].children[j])
                    }
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