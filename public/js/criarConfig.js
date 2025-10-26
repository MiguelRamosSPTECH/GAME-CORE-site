var radiosInputs = document.querySelectorAll('input[type="radio"]')
for (let i = 0; i < radiosInputs.length; i++) {
    radiosInputs[i].addEventListener('click', () => {
        var areaInputs = radiosInputs[i].parentNode.parentNode.parentNode.lastElementChild
        if (radiosInputs[i].checked) {
            areaInputs.setAttribute('style', 'display:flex!important')
        }
    })
}

function criarLayout() {

    let listaChecked = [];
    let fk_empresaVar = sessionStorage.ID_EMPRESA;

    let componentesChecked = document.getElementsByClassName('check-componente');

    for (let i = 0; i < componentesChecked.length; i++) {

        if (componentesChecked[i].style.backgroundColor == "rgb(116, 206, 58)") {

            for (let j = 0; j < ((componentesChecked[i].parentNode.parentNode.parentNode).children[1].children).length; j++) {

                if ((componentesChecked[i].parentNode.parentNode.parentNode).children[1].children[j].children[0].checked) {

                    let w = (componentesChecked[i].parentNode.innerText).trim().replaceAll(" ", "_");

                    let x = (componentesChecked[i].parentNode.parentNode.parentNode).children[1].children[j].innerText

                    y = (componentesChecked[i].parentNode.parentNode.parentNode).children[2].children[0].value

                    z = (componentesChecked[i].parentNode.parentNode.parentNode).children[2].children[1].value

                    listaChecked.push({ "componente": w, "metrica": x, "AlertaLeve": y, "AlertaGrave": z })

                }
            }

        }

    }
    console.log(listaChecked)

    let nomeLayoutVar = document.getElementById("ipt_nome").value;

    if (nomeLayoutVar == null || nomeLayoutVar.trim() == "") {
        alert("preencha o nome")
    } else if (listaChecked.length != 4) {
        alert("Deve escolher apenas 4 componentes")
    } else {
        fetch("/config/criarLayout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeLayoutServer: nomeLayoutVar,
                ListaCheckedServer: listaChecked,
                fk_empresaServer: fk_empresaVar

            })
        })
            .then(function (resposta) {
                console.log("Resposta: ", resposta);

                if (resposta.ok) {
                    window.location.href = "configs_padrao.html"
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
        return false;
    }
}

function listarLayout() {
    const idLayoutVar = sessionStorage.ID_LAYOUT;
    const idEmpresaVar = sessionStorage.ID_EMPRESA;

    if (!idLayoutVar || !idEmpresaVar) {
        console.error("sem id");
        return;
    }

    fetch(`/config/listarLayout/${idLayoutVar}/${idEmpresaVar}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(resposta => resposta.json())
        .then(dados => {
            // console.log("layout:", dados);
            if (!dados || dados.length === 0) {
                console.log("nao tem dados");
                return;
            }


            document.getElementById("ipt_nome").value = dados[0].nomeLayout;
            // console.log(dados[0].nomeLayout)


            sessionStorage.ID_CS1 = dados[0].cs_id
            sessionStorage.ID_CS2 = dados[1].cs_id
            sessionStorage.ID_CS3 = dados[2].cs_id
            sessionStorage.ID_CS4 = dados[3].cs_id

            dados.forEach(i => {
                // console.log(i)
                const componente = i.nome.replaceAll("_", " ");
                const metrica = i.unidadeMedida;
                const alertaLeve = i.alertaLeve;
                const alertaGrave = i.alertaGrave;
 
                // console.log(componente,metrica,alertaLeve,alertaGrave);

                const divs = document.querySelectorAll(".opcoes-metricas");
                // console.log(divs) // lista todas as divs

                divs.forEach(div => {

                    const comp = div.querySelector(".opcao-componente div").innerText;
                    // console.log(comp) // lista todos os componentes (títulos)

                    if (comp === componente) {

                        const chk = div.querySelector(".check-componente");
                        if (chk) {
                            chk.checked = true; // muda o checkbox p true
                            showMetrics(chk)
                        }

                        const opcoes = div.querySelectorAll("input[type='radio']");
                        // console.log("opcoes",opcoes) // mostra (qnt) opcoes tem

                        opcoes.forEach(opcao => {
                            const valor = opcao.parentElement.innerText.trim();
                            // console.log(opcao.parentElement) // div pai
                            // console.log("valor",valor) // mostra a métrica

                            if (valor === metrica) {
                                opcao.checked = true; // marca se a metrica for igual a do BD
                                opcao.click(); // simula click para abrir o campo alerta
                            }
                        });

                        const iptAlerta = div.querySelectorAll(".inputs-alertas input");
                        // console.log(iptAlerta) // lista os 2 inputs de alerta

                        iptAlerta[0].value = alertaLeve;
                        iptAlerta[1].value = alertaGrave;
                    }
                })

            })
        })
        .catch(erro => {
            console.error("#ERRO:", erro);
        });
}

function editarLayout() {

    let listaChecked = [];
    let fk_empresaVar = sessionStorage.ID_EMPRESA;
    let idLayoutVar = sessionStorage.ID_LAYOUT;
    let idCs1 = sessionStorage.ID_CS1;
    let idCs2 = sessionStorage.ID_CS2;
    let idCs3 = sessionStorage.ID_CS3;
    let idCs4 = sessionStorage.ID_CS4;

    let componentesChecked = document.getElementsByClassName('check-componente');

    for (let i = 0; i < componentesChecked.length; i++) {

        if (componentesChecked[i].style.backgroundColor == "rgb(116, 206, 58)") {

            for (let j = 0; j < ((componentesChecked[i].parentNode.parentNode.parentNode).children[1].children).length; j++) {

                if ((componentesChecked[i].parentNode.parentNode.parentNode).children[1].children[j].children[0].checked) {

                    let w = (componentesChecked[i].parentNode.innerText).trim().replaceAll(" ", "_");

                    let x = (componentesChecked[i].parentNode.parentNode.parentNode).children[1].children[j].innerText

                    y = (componentesChecked[i].parentNode.parentNode.parentNode).children[2].children[0].value

                    z = (componentesChecked[i].parentNode.parentNode.parentNode).children[2].children[1].value

                    listaChecked.push({ "componente": w, "metrica": x, "AlertaLeve": y, "AlertaGrave": z })

                }
            }

        }

    }
    // console.log(listaChecked)
    // console.log(fk_empresaVar,idLayoutVar)
    // console.log(idCs1,idCs2,idCs3,idCs4)

    let nomeLayoutVar = document.getElementById("ipt_nome").value;

    if (nomeLayoutVar == null || nomeLayoutVar.trim() == "") {
        alert("preencha o nome")
    } else if (listaChecked.length != 4) {
        alert("Deve escolher apenas 4 componentes")
    } else {
        fetch(`/config/editarLayout/${idLayoutVar}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeLayoutServer: nomeLayoutVar,
                ListaCheckedServer: listaChecked,
                fk_empresaServer: fk_empresaVar,
                idCs1Server: idCs1,
                idCs2Server: idCs2,
                idCs3Server: idCs3,
                idCs4Server: idCs4

            })
        })
            .then(function (resposta) {
                console.log("Resposta: ", resposta);

                if (resposta.ok) {
                    window.location.href = "configs_padrao.html"
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
        return false;
    }

}