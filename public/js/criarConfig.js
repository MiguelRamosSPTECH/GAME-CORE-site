

function criarLayout() {

    let listaChecked = [];
    let fk_empresaVar = sessionStorage.ID_EMPRESA;

    let componentesChecked = document.getElementsByClassName('check-componente');

    for (let i = 0; i < componentesChecked.length; i++){

        if(componentesChecked[i].style.backgroundColor == "rgb(116, 206, 58)"){

            for(let j = 0; j < ((componentesChecked[i].parentNode.parentNode.parentNode).children[1].children).length; j++){

                if((componentesChecked[i].parentNode.parentNode.parentNode).children[1].children[j].children[0].checked){

                    let x = (componentesChecked[i].parentNode.innerText).trim().replaceAll(" ","_")

                    listaChecked.push({[x]:`${(componentesChecked[i].parentNode.parentNode.parentNode).children[1].children[j].innerText}`})

                }
            }

        }

    }
    console.log(listaChecked)

    let nomeLayoutVar = document.getElementById("ipt_nome").value;

    if (nomeLayoutVar == null || nomeLayoutVar.trim() == ""){
        alert("preencha o nome")
    } else if(listaChecked.length != 4){
        alert("Deve escolher apenas 4 componentes")
    } else{
        fetch("/config/criarLayout", {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
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
