console.log("JSSSS")
var idEmpresa = sessionStorage.ID_EMPRESA;
var listaServidores = [];

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
        "apelido":"Este campo é responsável pela identificação mais fácil do servidor! Você pode escolher tanto um apelido, quanto um código de identificação. Isso tudo varia de acordo com suas preferências e modelo de referências dentro da sua empresa no seu setor específico! Este é o campo mais importante, trate de seguir padrões para te ajudar na identificação de uma forma mais rápida",
        "nome": "Este campo se refere ao MACADRESS do seu servidor! Peço que você verifique qual o macadress do seu servidor utilizando o comando ipconfig /all no terminal e indo na aba de Adaptador de Rede sem Fio Wi-Fi e depois indo em Endereço Físico. Necessário ser o MACADRESS, se não o script de captura NÃO FUNCIONARÁ!",
        "regiao":"Este campo é responsável pela identificação da região onde o servidor se encontra! O como você irá gerenciar e/ou dividir essas regiões também depende de como sua empresa e/ou seu setor funciona e/ou trabalha! Lembre-se de que essa é uma parte importante, pois otimizará seu tempo na identificação de problemas",
        "configuracao":"Neste campo você pode escolher uma configuração inicial para seu servidor. Uma configuração inicial é o layout de componentes que você já quer que seja escolhido quando você for monitorar! Lembrando que você pode editar o que vêm nestas configurações no menu lateral da dashboard!"
    }
    // divRastrear.style.display = "flex"
    tituloInput.innerText = `${input_prefixo[1].toUpperCase()} DO SERVIDOR`
    descInput.innerHTML = descricaoCampos[`${input_prefixo[1]}`]
    valorAtualRastrear.innerText = valorInput
}



async function exibirLayouts() {

    const idEmpresa = sessionStorage.ID_EMPRESA;
    console.log("ID Empresa:", sessionStorage.ID_EMPRESA);
    if (!idEmpresa) return;

    try {
        const response = await fetch(`/layouts/buscar/${idEmpresa}`, { cache: 'no-store' });
        const layouts = await response.json();

        const select = document.getElementById("ipt_configuracao");
        select.innerHTML = '<option value="">Selecionar</option>';

        layouts.forEach(layout => {
            const option = document.createElement("option");
            option.value = layout.id;
            option.textContent = layout.nome;
            select.appendChild(option);

            return idLayout = layout.id;

        });


    } catch (erro) {
        console.error("Erro ao carregar layouts: ", erro);
    }
}



async function buscarServidor() {

    await fetch(`/cadastrarServidor/buscarServidor/${idEmpresa}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            console.log("Dado recebido: ", resposta);

            var select = document.getElementById("servidor");
            select.innerHTML = '<option value="">Selecionar</option>';

            resposta.forEach(servidor => {
                select.innerHTML += `<option value="${servidor.id}">${servidor.apelido}</option>`;

                return servidor

            });

            listaServidores = resposta

            console.log("Options do select:", select.innerHTML);

        })
        .catch(erro => console.error("Erro:", erro));

}



async function receberCamposLayout() {

    var inputs = document.querySelectorAll('#servidor')

    console.log(inputs)

    for (let i = 0; i < inputs.length; i++) {

        inputs[i].addEventListener('change', () => {

            let idSelect = inputs[i].value

            var idServidor = listaServidores.find(layout => layout.id == idSelect)
            sessionStorage.ID_SERVIDOR_MODIFICADO = idServidor.id;

            var apelido = document.getElementById("ipt_apelido");
            var apelidoServidor = listaServidores.find(layout => layout.id == idSelect)
            apelido.value = apelidoServidor.apelido;

            var macAdress = document.getElementById("ipt_nome");
            var macAdressServidor = listaServidores.find(layout => layout.id == idSelect)
            macAdress.value = macAdressServidor.macadress;

            var regiao = document.getElementById("ipt_regiao");
            var regiaoServidor = listaServidores.find(layout => layout.id == idSelect)
            regiao.value = regiaoServidor.localizacao;

        })

    }

}


function enviarCadastroServidor() {

    let apelidoServidor = ipt_apelido.value;
    let macadressServidor = ipt_nome.value;
    let regiaoServidor = ipt_regiao.value;
    let idLayoutServidor = idLayout;

    fetch("/cadastrarServidor/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            apelidoServidorServer : apelidoServidor,
            macadressServer : macadressServidor,
            regiaoServidorServer: regiaoServidor,
            idEmpresaServer: idEmpresa,
            idLayoutServer : idLayoutServidor

        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                cardErro.style.display = "block";

                mensagem_erro.innerHTML =
                    "Cadastro realizado com sucesso!";

                setTimeout(() => {
                    window.location = "../dashboard/index.html";
                }, "2000");

                // limparFormulario();
                // finalizarAguardar();
            } else {
                throw "Houve um erro ao tentar realizar o cadastro de servidor!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            // finalizarAguardar();
        });

    return false;


}


function editarServer() {

    let apelidoServidor = ipt_apelido.value;
    let macadressServidor = ipt_nome.value;
    let regiaoServidor = ipt_regiao.value;
    let idLayoutServidor = idLayout;
    var id_do_servidor = sessionStorage.ID_SERVIDOR_MODIFICADO;


    console.log("ID do layout: ", idLayoutServidor);
    console.log("ID do servidor: ", id_do_servidor)


    fetch("/cadastrarServidor/editarServer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            apelidoServidorServer : apelidoServidor,
            macadressServer : macadressServidor,
            regiaoServidorServer: regiaoServidor,
            idEmpresaServer: idEmpresa,
            idLayoutServer : idLayoutServidor,
            idServidorServer : id_do_servidor

        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                cardErro.style.display = "block";

                mensagem_erro.innerHTML =
                    "Alteração realizada com sucesso!";

                console.log("Servidor alterado com sucesso!")

                alert("Servidor Alterado com sucesso!")

                setTimeout(() => {
                     window.location = "../dashboard/index.html";
                }, "2000");

                // limparFormulario();
                finalizarAguardar();
            } else {
                throw "Houve um erro ao tentar realizar a alteração!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            finalizarAguardar();
        });

    return false;
}
