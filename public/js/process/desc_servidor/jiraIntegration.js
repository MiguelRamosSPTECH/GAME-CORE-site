
function listarChamados() {
    fetch('/jiraIntegration/listar', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async response =>  {
        let chamados = await response.json();
        let qtdTickets = chamados.issues.length;
        let areaAlertas = document.getElementById('area_jira');
        console.log("TICKETS JIRA: ",chamados)

        //criando map para poder salvar servidores e a contagem de alertas
        let mapServidores = {};

        for(let i=0;i<chamados.issues.length;i++){
            let chamadosEmString = JSON.stringify(chamados.issues[i]);
            let corGravidade = "";
            if(chamados.issues[i].fields.priority.name == "Highest"){
                chamados.issues[i].fields.priority.name = "Crítico"
            } else if(chamados.issues[i].fields.priority.name == "High"){
                chamados.issues[i].fields.priority.name = "Alto"
                corGravidade = "#ff5757;"
            } else if(chamados.issues[i].fields.priority.name == "Medium"){
                chamados.issues[i].fields.priority.name = "Médio"
                corGravidade = "#fad73e"
            }

            
            //verificando alertas para cada servidor, concatenando um objeto com a contagem de ocorrencia do servidor no ticket
            let nomeServidorNoTicket = chamados.issues[i].fields.summary.split("|")[1].trim();

            if(mapServidores[nomeServidorNoTicket]) {
                mapServidores[nomeServidorNoTicket]++;
            } else {
                mapServidores[nomeServidorNoTicket] = 1;
            }


            let trataData = Math.round((Date.now() - new Date(chamados.issues[i].fields.created)) / (1000 * 60));
            areaAlertas.innerHTML+= `
                            <div class="alerta" onclick='descricaoDetalhadaChamado(${chamadosEmString})'>
                                <div class="nivel-alerta">
                                    <div class="content-nivel" style="background-color:${corGravidade}!important">
                                        ${chamados.issues[i].fields.priority.name}
                                    </div>
                                </div>
                                <div class="title-alerta">
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                    ${chamados.issues[i].fields.summary}
                                </div>
                                <div class="desc-alerta">
                                    ${chamados.issues[i].fields.description.content[0].content[0].text.slice(0, 31)}
                                </div>
                                <div class="tempo-decorrido-alerta">
                                    <i class="fa-regular fa-clock"></i>
                                    ${trataData} minuto(s) atrás
                                </div>
                            </div>            
            `
        }
        if(chamados.issues.length == 0) {
             areaAlertas.innerHTML+= "NENNHUM TICKET FOI ABERTO HOJE AINDA!"
        }





        let listaAlertasServidores = document.getElementById('tabela_alerta_servidores');
        let nomeServidorMonitorar = "nada"
        if(qtdTickets == 0) {
            listaAlertasServidores.innerHTML = "NENHUM TICKET CRIADO HOJE!"
        } else {
            let mapServidoresArray = Object.entries(mapServidores);
            mapServidoresArray.sort((a, b) => b[1] - a[1]); //esse - é sinal de ordenação tlgd
            nomeServidorMonitorar= mapServidoresArray[0][0].split("=")[1].trim();
            
            //atualizando tabela dos servidores conforme qtd de alerta
            mapServidoresArray.forEach(([nome, contagem]) => {
                let separaNome = nome.split("=");
                let regiaoSeparada = separaNome[0].trim();
                let servidorSeparado = separaNome[1].trim();
                let cor = "";

                if(contagem >= 5) {
                    cor = "background-color: #cf494b;"
                } else if(contagem >= 3) {
                    cor = "background-color: #d1b518ff;"
                } else {
                    cor = "border-bottom: 1px solid gray"
                }
                listaAlertasServidores.innerHTML+=`
                    <tr style="${cor}" onclick='getIdByApelido(${nomeServidorMonitorar})'>
                        <td>${regiaoSeparada}</td>
                        <td style="width:100px">${servidorSeparado}</td>
                        <td style="color: gold;"><i class="fa-solid fa-circle-chevron-right"></i></td>
                        <td class="qtd-alertas-list">${contagem}</td>
                    </tr>            

                `
            })
        }
        //area que vou carregar as informações do servidor na dash:
        getIdByApelido(nomeServidorMonitorar);

    })
    .catch(error => {
        console.error('Erro ao listar chamados:', error);
    });
}

//ver com grupo se faz sntido ficar aq ou ir pro jira tlgd
function descricaoDetalhadaChamado(dados_chamado) {
    console.log(dados_chamado)
}