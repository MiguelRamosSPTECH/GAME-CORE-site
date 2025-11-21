
function verificaLayoutServidor() {
    const urlParams = new URLSearchParams(window.location.search);
    const idServidor = urlParams.get('idServidor');
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
                    } else {
                        throw new Error("Erro ao buscar configuração do layout.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao obter configuração do layout:", error);
                });
            }  else  {
                select_configurations.innerText = `${data[0].nomeLayout}`;
                    configs_layout = data.map(layout => ({
                        ...layout, //mantem tudo de antes
                        nomeComponente: layout.nomeComponente.replaceAll("_"," ") //filtra nomeComponente
                    })
                );
            }   
            // jogando a config para os modal que muda temporariamente a config do servidor
            for(let i = 0; i < areaCardsComponentes.length; i++){
                let nomeComponenteModal = areaCardsComponentes[i].children[0].innerText.trim()
                if(configs_layout.filter(layout => layout.nomeComponente == nomeComponenteModal).length > 0) {
                    let areaOpcoes = Array.from(areaCardsComponentes[i].children[1].getElementsByClassName('opcao'))
                    let areaAlertas = areaCardsComponentes[i].children[2].querySelectorAll('input')
                    const pegaInput = areaCardsComponentes[i].querySelector('.check-componente')
                    pegaInput.click()
                    
                    areaOpcoes.filter(area_opcao => {
                        configs_layout.find(layout => { 
                            if((layout.unidadeMedida == area_opcao.innerText.trim()) != undefined) {
                                area_opcao.children[0].click()
                                console.log(areaAlertas[0].value = layout.alertaLeve)
                            }
                        })
                    })

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