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
        "apelido": "Este campo é responsável pela identificação mais fácil do servidor! Você pode escolher tanto um apelido, quanto um código de identificação. Isso tudo varia de acordo com suas preferências e modelo de referências dentro da sua empresa no seu setor específico! Este é o campo mais importante, trate de seguir padrões para te ajudar na identificação de uma forma mais rápida",
        "nome": "Este campo se refere ao MACADRESS do seu servidor! Peço que você verifique qual o macadress do seu servidor utilizando o comando ipconfig /all no terminal e indo na aba de Adaptador de Rede sem Fio Wi-Fi e depois indo em Endereço Físico. Necessário ser o MACADRESS, se não o script de captura NÃO FUNCIONARÁ!",
        "regiao": "Este campo é responsável pela identificação da região onde o servidor se encontra! O como você irá gerenciar e/ou dividir essas regiões também depende de como sua empresa e/ou seu setor funciona e/ou trabalha! Lembre-se de que essa é uma parte importante, pois otimizará seu tempo na identificação de problemas",
        "configuracao": "Neste campo você pode escolher uma configuração inicial para seu servidor. Uma configuração inicial é o layout de componentes que você já quer que seja escolhido quando você for monitorar! Lembrando que você pode editar o que vêm nestas configurações no menu lateral da dashboard!"
    }
    // divRastrear.style.display = "flex"
    tituloInput.innerText = `${input_prefixo[1].toUpperCase()} DO SERVIDOR`
    descInput.innerHTML = descricaoCampos[`${input_prefixo[1]}`]
    valorAtualRastrear.innerText = valorInput
}

function puxaRegioes() {
    fetch(`/cadastrarServidor/allRegioes`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(regioes => {
        const selectRegiao = document.getElementById("ipt_regiao");

            regioes.forEach(regiao => {
                selectRegiao.innerHTML += `<option value="${regiao.id}">${regiao.codregiao}</option>`;
            });
        })
        .catch(erro => {
            console.error("Erro ao carregar regiões: ", erro);
        });
}


async function exibirLayouts() {

    const idEmpresa = sessionStorage.ID_EMPRESA;
    console.log("ID Empresa:", sessionStorage.ID_EMPRESA);
    if (!idEmpresa) return;

    try {
        const response = await fetch(`/layouts/buscar/${idEmpresa}`, { cache: 'no-store' });
        const layouts = await response.json();

        const select = document.getElementById("ipt_configuracao");

        layouts.forEach(layout => {
            select.innerHTML+= `<option value="${layout.id}">${layout.nome}</option>`;
        });

        if(window.location.href.includes("edit_servidor.html")) {
            console.log("hahaha")
            buscarDados()
        }

    } catch (erro) {
        console.error("Erro ao carregar layouts: ", erro);
    }  
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
    let idLayoutServidor = ipt_configuracao.value;


    fetch("/cadastrarServidor/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            apelidoServidorServer: apelidoServidor,
            macadressServer: macadressServidor,
            regiaoServidorServer: regiaoServidor,
            idEmpresaServer: idEmpresa,
            idLayoutServer: idLayoutServidor

        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                
                setTimeout(() => {
                    window.location = "../index.html";
                }, 1000);

            } else {
                throw "Houve um erro ao tentar realizar o cadastro de servidor!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    return false;


}


function editarServer() {
    const servidorString = sessionStorage.getItem("SERVIDOR_JSON");
    const servidorObjeto = JSON.parse(servidorString);

    let apelidoServidor = ipt_apelido.value;
    let regiaoServidor = ipt_regiao.value;
    let idLayoutServidor = ipt_configuracao.value;
    var id_do_servidor = servidorObjeto.id;

    console.log("ID do layout: ", idLayoutServidor);
    console.log("ID do servidor: ", id_do_servidor);


    fetch("/cadastrarServidor/editarServer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            apelidoServidorServer: apelidoServidor,
            regiaoServidorServer: regiaoServidor,
            idEmpresaServer: idEmpresa,
            idLayoutServer: idLayoutServidor,
            idServidorServer: id_do_servidor

        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                //cardErro.style.display = "block";

                //mensagem_erro.innerHTML =
                    //"Alteração realizada com sucesso!";

                console.log("Servidor alterado com sucesso!")

                alert("Servidor Alterado com sucesso!")

                setTimeout(() => {
                    window.location = "../dashboard/index.html";
                }, "2000");

                // limparFormulario();
                //finalizarAguardar();
            } else {
                throw "Houve um erro ao tentar realizar a alteração!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            //finalizarAguardar();
        });

    return false;
}

function deletarServidor() {
    const servidorString = sessionStorage.getItem("SERVIDOR_JSON");
    const servidorObjeto = JSON.parse(servidorString);


    let id_servidor = servidorObjeto.id;

    Swal.fire({
        title: "Deletar servidor?",
        text: "Não é possível restaurar após deleção",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, deletar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {


        if (result.isConfirmed) {

            fetch(`/cadastrarServidor/deletarServidor/${idEmpresa}/${id_servidor}`, {
                method: "DELETE"
            })
                .then(function (resposta) {

                    if (resposta.ok) {

                        Swal.fire({
                            title: "Deletado!",
                            text: "Servidor deletado com sucesso.",
                            icon: "success"
                        }).then(() => {
                            window.location.href="../index.html";
                        });

                    } else {

                        Swal.fire({
                            title: "Erro!",
                            text: "Falha ao deletar. Verifique as permissões ou se o ID existe.",
                            icon: "error"
                        });

                    }
                })
                .catch(function (erro) {

                    Swal.fire({
                        title: "Erro de Conexão!",
                        text: "Não foi possível conectar ao servidor para deletar.",
                        icon: "error"
                    });
                    console.error("Erro no fetch DELETE:", erro);
                });
        }
    });
}

function buscarDados() {
    let dados = sessionStorage.getItem("SERVIDOR_JSON");
    let dadosServidor = JSON.parse(dados);


    ipt_apelido.value = dadosServidor.apelido;
    ipt_nome.value = dadosServidor.macadress;
    ipt_regiao.value = parseInt(dadosServidor.fk_regiao); 
    ipt_configuracao.value = dadosServidor.fk_layout;
}