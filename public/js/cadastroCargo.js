    function cadastrar(){   
        let cargoVar = ipt_cargo.value;
        let fk_empresaVar = sessionStorage.ID_EMPRESA;
        

        //Permissões que o usuário escolher
        let permissoesSelecionadasVar = []

        document.querySelectorAll("input[type=checkbox]:checked").forEach(c => {

            permissoesSelecionadasVar.push(Number(c.value))

        })

        console.log("Permissões Selecionadas: " + permissoesSelecionadasVar)

        fetch("/cargos/criar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cargoServer: cargoVar,
                permissoesServer: permissoesSelecionadasVar,
                fk_empresaServer: fk_empresaVar
            })
            
        })
            .then(function (resposta){
                console.log("Resposta: ", resposta);
                
                if(resposta.ok){
                    cardErro.style.display = "block";

                    console.log("Permissões Selecionadas: " + permissoesSelecionadasVar)

                    alert(`Cargo ${cargoVar} criado com sucesso`)

                    //mensagem_erro.innerHTML =
                    //    "Cargo criado com sucesso!";
                    //    setTimeout(() => {
                    //    window.location = "login.html";
                    //}, "2000");
                    limparFormulario();
                }
                else {
                    throw "Houve um erro ao tentar criar o cargo!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
                finalizarAguardar();
            });

            return false;
    }

function allCargos() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/cargos/allCargos/${idEmpresa}`, {
        method: "GET"
    })
    .then(async resposta => {
        let cargos = await resposta.json();
        let areaCargos = document.getElementById('area_cards')
        let stringCargos = ""
        cargos.forEach(cargo => {
            stringCargos+=`
                        <div class="card">
                            <div class="icon-top">
                                <img src="../../../assets/imgs/icon-cargo.png">
                            </div>
                            <h2>${cargo.nomeCargo.toUpperCase()}</h2>
                            <div class="icons-permissoes">
                                <div class="permissao">
                                    <div class="icon-permissao"></div>
                                    <span>${cargo.nomePermissao}</span>
                                </div>
                                <div class="permissao">
                                    <div class="icon-permissao"></div>
                                    <span>GERENCIAR SERVIDOR</span>
                                </div>                                
                            </div>
                        </div>             
            `
        })
        areaCargos.innerHTML+=stringCargos
    })
}





//var permissoesNecessarias = [6];
//
//function iniciarPagina() {
//
//      validarSessao();
//
//      setTimeout(function() {
//          checarPermissoes(permissoesNecessarias);
//      }, 200);
//
//}

    