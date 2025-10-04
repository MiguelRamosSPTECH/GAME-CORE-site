

const mapaDeMetricas = {
    'CPU': ['%', 'MHz', 'GHz'],
    'RAM': ['%', 'MB', 'GB'],
    'Disco': ['%', 'GB', 'TB'],
    'Processos': ['#', 'Tempo (s)', 'PID'],
    'Rede': ['Mbps', 'Pacotes/s']
};

document.addEventListener('DOMContentLoaded', () => {
    const monitoramentoOpcoes = document.getElementById('monitoramento-opcoes');
    const metricasDinamicasDiv = document.getElementById('metricas-dinamicas');
    const metricasOpcoesContainer = document.getElementById('metricas-opcoes-container');
    const metricasTituloSpan = document.getElementById('metricas-titulo');

    // listener p qualquer mudança dentro da div de opções de monitoramento (coloca na frase)
    monitoramentoOpcoes.addEventListener('change', (event) => {
        // ve se a mudança veio de um checkbox
        if (event.target.type === 'checkbox') {
            const checkboxes = document.querySelectorAll('#monitoramento-opcoes input[type="checkbox"]:checked');

            const itensSelecionados = [];
            const metricasRequeridas = new Set(); // cada metrica apareça UMA vez (senao sobrescreve)

            checkboxes.forEach(checkbox => {
                const componente = checkbox.value;
                itensSelecionados.push(componente);

                // pega as metricas no mapa criado e adiciona no set
                const metricas = mapaDeMetricas[componente] || [];
                metricas.forEach(metrica => metricasRequeridas.add(metrica));
            });

            
            if (itensSelecionados.length > 0) {
                metricasDinamicasDiv.style.display = 'block';
                metricasTituloSpan.textContent = itensSelecionados.join(', ');

                
                metricasOpcoesContainer.innerHTML = ''; 
                metricasRequeridas.forEach(metrica => {
                    const id = `metrica-${metrica.replace(/[^a-zA-Z0-9]/g, '-')}`; // extensão pra poder "aceitar" os caracteres especiais

                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.id = id;
                    input.name = 'unidade_metrica';
                    input.value = metrica;

                    const label = document.createElement('label');
                    label.htmlFor = id;
                    label.className = 'label-metricas'; 
                    label.textContent = metrica + ' ';

                    metricasOpcoesContainer.appendChild(input);
                    metricasOpcoesContainer.appendChild(label);
                });

            } else {
                metricasDinamicasDiv.style.display = 'none';
                metricasOpcoesContainer.innerHTML = '';
            }
        }
    });
});




function enviarCadastroServidor() {
    
        const hostnameVar = ipt_hostname.value;
        const ipVar = ipt_ip.value;
        const localizacaoVar = ipt_localizacao.value;

        const componentesSelecionados = [];
        document.querySelectorAll('#monitoramento-opcoes input[name="componente"]:checked').forEach(c => {
            componentesSelecionados.push(c.value);
        });

        const metricasSelecionadas = [];
        document.querySelectorAll('#metricas-opcoes-container input[name="unidade_metrica"]:checked').forEach(c => {
            metricasSelecionadas.push(c.value);
        });

        const idEmpresaVar = sessionStorage.ID_EMPRESA;


        if (
            hostnameVar == "" ||
            ipVar == "" ||
            localizacaoVar == "" ||
            componentesSelecionados.length === 0 || 
            metricasSelecionadas.length === 0 
        ) {
           
            console.error("ERRO: Preencha os campos e selecione Componentes e Métricas.");

            cardErro.style.display = "block";
            mensagem_erro.innerHTML = "(Mensagem de erro)";
            finalizarAguardar();
            return false;
            
        }

        

        
        fetch("/cadastrarServidor/cadastrar", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hostnameServer: hostnameVar, 
                ipServer: ipVar,             
                localizacaoServer: localizacaoVar, 
                componenteServer: componentesSelecionados,
                metricaServer: metricasSelecionadas,
                idEmpresaServer: idEmpresaVar
                
            }),
        })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                cardErro.style.display = "block";

                mensagem_erro.innerHTML =
                    "Cadastro realizado com sucesso!";

                setTimeout(() => {
                    // window.location = "login.html";
                }, "2000");

                // limparFormulario();
                // finalizarAguardar();
            } else {
                throw "Houve um erro ao tentar realizar o cadastro!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            // finalizarAguardar();
        });

    return false;


}
