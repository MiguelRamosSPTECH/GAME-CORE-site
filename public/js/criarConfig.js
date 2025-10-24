var radiosInputs = document.querySelectorAll('input[type="radio"]')
for(let i=0;i<radiosInputs.length;i++) {
  radiosInputs[i].addEventListener('click', ()=> {
    var areaInputs = radiosInputs[i].parentNode.parentNode.parentNode.lastElementChild
      if(radiosInputs[i].checked) {
        areaInputs.setAttribute('style','display:flex!important')
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

                    let w = (componentesChecked[i].parentNode.innerText)

                    let x = (componentesChecked[i].parentNode.parentNode.parentNode).children[1].children[j].innerText

                    y = (componentesChecked[i].parentNode.parentNode.parentNode).children[2].children[0].value

                    z = (componentesChecked[i].parentNode.parentNode.parentNode).children[2].children[1].value

                    listaChecked.push({ "componente": w, "metrica": x,"AlertaLeve": y, "AlertaGrave": z})

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

                // if(resposta.ok){}
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
        return false;
    }
}



var permissoesNecessarias = [1, 2];

function iniciarPagina() {

      validarSessao();

      setTimeout(function() {
          checarPermissoes(permissoesNecessarias);
      }, 200);

}