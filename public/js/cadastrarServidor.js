
const mapaDeMetricas = {
    'CPU': ['%'],
    'CPU_USER': ['%'],
    'CPU_SYSTEM': ['%'],
    'LOADAVG': ['Quantidade'],
    'CPU_OCIOSA': ['%'],

    'RAM': ['%', 'MB', 'GB'],
    'SWAP': ['%', 'MB', 'GB'],
    'RAM_DISP': ['%', 'MB', 'GB'],

    'DISCO': ['%', 'GB', 'TB'],
    'THROUGHPUT': ['MB/s', 'GB/s'],
    'DISCO_LIVRE': ['%', 'MB', 'GB']
};



//método que vai ser acionado quando ele escolher um input diferente
function showInfoInput(input) {
    var divRastrear = document.getElementById('rastrear')
    var valorAtualRastrear = document.getElementById('value_atual')
    var tituloInput = document.getElementById('title-campo')
    var descInput = document.getElementById('descricao-campo')
    var input_prefixo = (input.id).split("_")
    var valorInput = input.value
    var descricaoCampos = {
        "nome": "Este campo é responsável pela identificação do servidor! Você pode escolher tanto um nome, quanto um código de identificação. Isso tudo varia de acordo com suas preferências e modelo de referências dentro da sua empresa no seu setor específico! Este é o campo mais importante, trate de seguir padrões para te ajudar na identificação de uma forma mais rápida",
        "regiao":"Este campo é responsável pela identificação da região onde o servidor se encontra! O como você irá gerenciar e/ou dividir essas regiões também depende de como sua empresa e/ou seu setor funciona e/ou trabalha! Lembre-se de que essa é uma parte importante, pois otimizará seu tempo na identificação de problemas",
        "configuracao":"Neste campo você pode escolher uma configuração inicial para seu servidor. Uma configuração inicial é o layout de componentes que você já quer que seja escolhido quando você for monitorar! Lembrando que você pode editar o que vêm nestas configurações no menu lateral da dashboard!"
    }
    divRastrear.style.display = "flex"
    tituloInput.innerText = `${input_prefixo[1].toUpperCase()} DO SERVIDOR`
    descInput.innerHTML = descricaoCampos[`${input_prefixo[1]}`]
    valorAtualRastrear.innerText = valorInput
}



// =========================================== NAO
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

function exibirLayout(){}

function cadastrarServidor(){   

}


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
