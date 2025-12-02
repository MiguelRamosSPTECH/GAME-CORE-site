
// Constante que define o início do link do Jira, pronto para receber a chave do chamado
const JIRA_BASE_URL = 'https://gamecore.atlassian.net/jira/software/projects/KAN/list/?jql=project%20%3D%20%22KAN%22%20ORDER%20BY%20created%20DESC&selectedIssue=';

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
            if(trataData >= 60) {
                trataData = Math.round(trataData / 60,2)
            }

            console.log(chamados.issues[i].fields.description.content[0].content[0])
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
                        <td style="font-size:10px!important">${regiaoSeparada}</td>
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

//gerei com IA mesmo por que para redirecionar o link é um trampo mesmo
function descricaoDetalhadaChamado(chamado) {
    // Verifica se o objeto chamado tem a chave (key) necessária (ex: KAN-264)
    if (chamado && chamado.key) {
        
        // 1. Constrói a URL completa: URL_BASE + Chave do Chamado
        const urlChamado = JIRA_BASE_URL + chamado.key;
        
        console.log(`Redirecionando para o chamado: ${chamado.key}`);

        // 2. Redireciona o navegador para a URL, abrindo em uma nova aba (_blank)
        window.open(urlChamado, '_blank'); 
        
    } else {
        console.error("Objeto do chamado inválido ou faltando a chave (key).", chamado);
    }
}