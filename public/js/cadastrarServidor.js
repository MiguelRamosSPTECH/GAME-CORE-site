
const mapaDeMetricas = {
    'CPU': ['%', 'MHz', 'GHz'],
    'RAM': ['%', 'MB', 'GB'],
    'Disco': ['%', 'GB', 'TB'],
    'Processos': ['#', 'Tempo (s)', 'PID'],
    'Rede': ['Mbps', 'Pacotes/s']
};

// array global que armazena todas as configurações (componente - metrica)
const configuracoes = [];

document.addEventListener('DOMContentLoaded', () => {
    const componenteSelect = document.getElementById('selectComponente');
    const metricaSelect = document.getElementById('selectMetrica');
    const btnAdicionar = document.getElementById('btnAdicionar');
    const listaConfiguracoes = document.getElementById('listaConfiguracoes');

    componenteSelect.addEventListener('change', (event) => {
        const componenteEscolhido = componenteSelect.value;
        metricaSelect.innerHTML = '<option value="">Selecione uma métrica</option>';
        
        if (componenteEscolhido && mapaDeMetricas[componenteEscolhido]) {
            mapaDeMetricas[componenteEscolhido].forEach(metrica => {
                const option = document.createElement('option');
                option.value = metrica;
                option.textContent = metrica;
                metricaSelect.appendChild(option);
            });
        }
    });

    btnAdicionar.addEventListener('click', () => {
        const componente = componenteSelect.value;
        const metrica = metricaSelect.value;

        if (!componente || !metrica) {
            alert('Escolha um componente e uma métrica antes de adicionar.');
            return;
        }

        const jaExiste = configuracoes.some(c => c.componente === componente);
        // retorna true já existe um componente configurado

        if (jaExiste) {
            alert(`O componente ${componente} já foi configurado.`);
            return;
        }

        configuracoes.push({ componente, metrica });

        const item = document.createElement('div');

        item.textContent = `${componente} → ${metrica}`;
        // item.textContent = `${componente} >> ${metrica}`;

        listaConfiguracoes.appendChild(item);
        // console.log(configuracoes)
    });
});




function enviarCadastroServidor() {
    console.log(configuracoes)
    for (const {componente,metrica} of configuracoes){
        console.log(componente)
        console.log(metrica)
    }

    const hostnameVar = ipt_hostname.value;
    const ipVar = ipt_ip.value;
    const localizacaoVar = ipt_localizacao.value;

    // const componentesSelecionados = [];
    // document.querySelectorAll('#monitoramento-opcoes input[name="componente"]:checked').forEach(c => {
    //     componentesSelecionados.push(c.value);
    // });

    // const metricasSelecionadas = [];
    // document.querySelectorAll('#metricas-opcoes-container input[name="unidade_metrica"]:checked').forEach(c => {
    //     metricasSelecionadas.push(c.value);
    // });

    const idEmpresaVar = sessionStorage.ID_EMPRESA;


    if (
        !hostnameVar.trim() ||
        !ipVar.trim() ||
        !localizacaoVar.trim() ||
        configuracoes.length === 0
        // componentesSelecionados.length === 0 ||
        // metricasSelecionadas.length === 0
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
            configuracaoServer: configuracoes,
            // componenteServer: componentesSelecionados,
            // metricaServer: metricasSelecionadas,
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
