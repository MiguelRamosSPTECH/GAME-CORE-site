
function sair() {
    window.location = "login.html"
}
document.getElementById('dataHeader').textContent = new Date().toLocaleDateString();

var id = []
var nomeEmpresarial = []
var nomeRepresentante = []
var statusOperacao = []
var statusAcesso = []


function criarCards() {

    var filtroVar = filtro.value;
    tabela_empresas.innerHTML = `
                    <tr class="header_table">
                        <th class="id_table">ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CNPJ</th>
                        <th>Status Op.</th>
                        <th class="acao_table">Ação</th>
                    </tr>
        `
    fetch("/aceitarEmpresas/buscarCards", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filtroServer: filtroVar,
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!")

        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log("Esse é o json.stringify" + JSON.stringify(json));
                console.log("Tamanho volta" + json.length);

                // Zerando os vetores das varievais, para poder repor os valores:
                id = []
                nomeEmpresarial = []
                nomeRepresentante = []
                statusOperacao = []
                statusAcesso = []
                email = []
                cnpj = []

                // Salvando em variaveis os valores retornados
                for (i = 0; i < json.length; i++) {
                    id.push(json[i].id);
                    nomeEmpresarial.push(json[i].nomeEmpresarial);
                    email.push(json[i].email)
                    nomeRepresentante.push(json[i].nomeRepresentante);
                    cnpj.push(json[i].cnpj);
                    statusOperacao.push(json[i].statusOperacao);
                    statusAcesso.push(json[i].statusAcesso);
                }

                console.log(id);
                console.log(nomeEmpresarial);
                console.log(nomeRepresentante);
                console.log(statusOperacao);
                console.log(statusAcesso);
                console.log(cnpj)

                // montando os cards
                console.log("Tamanho do vetor de id:" + id.length);
                var status = ''
                var corTexto = ""
                for (i = 0; i < id.length; i++) {
                    if (statusAcesso[i] == 1) {
                        status = 'Pendente'
                        corTexto = `gray`
                    }
                    if (statusAcesso[i] == 2) {
                        status = 'Reprovada'
                        corTexto = "red"
                    }

                    if (statusAcesso[i] == 3) {
                        status = 'Aprovada'
                        corTexto = "green"
                    }
                    tabela_empresas.innerHTML += `
                            <tr>
                                <td class="id_table">${id[i]}</td>
                                <td>${nomeEmpresarial[i]}</td>
                                <td>${email[i]}</td>
                                <td>${cnpj[i]}</td>
                                <td style ="color:${corTexto};font-weight:500">${status}</td>
                                <td class="acao_table">
                                    ${status != 'Aprovada' ? `<button style="background-color: 	rgb(30,144,255)" onclick="aprovar(${i})"id=aprovar${i}>Aprovar</button>` : ""}
                                    ${status != 'Reprovada' ? `<button style="background-color:  #ff4040" onclick="reprovar(${i})"id=reprovar${i}>Reprovar</button>` : ""}
                                </td>
                            </tr>`
                }
            });

        } else {

            console.log("Houve um erro ao tentar buscar os cards");

        }

    }).catch(function (erro) {
        console.log(erro);
    })

    return false;

}



function aprovar(i) {
    var idEmpresa1 = id[i]
    editar(idEmpresa1, 3)
}


function reprovar(i) {
    var idEmpresa2 = id[i]
    editar(idEmpresa2, 2)

}



function editar(idEmpresaPassado, novoStatusPassado) {

    console.log('editar ->', { idEmpresaPassado, novoStatusPassado });
    fetch(`/aceitarEmpresas/statusEmpresa`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            novoStatus: novoStatusPassado,
            idEmpresa: idEmpresaPassado
        })
    }).then(function (resposta) {

        if (resposta.ok) {
            window.alert("Situação de empresa atualizada com sucesso!");
            criarCards(); 
        } else if (resposta.status == 404) {
            window.alert("Deu 404!");
        } else {
            throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}

