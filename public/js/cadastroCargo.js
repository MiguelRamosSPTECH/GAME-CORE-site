    //const { text } = require("express");

    let cargos = []
    
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
    let idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/cargos/allCargos/${idEmpresa}`, {
        method: "GET"
    })
    .then(async resposta => {
        cargos = await resposta.json();
        let areaCargos = document.getElementById('area_cards')
        let stringCargos = ""
        cargos.forEach(cargo => {
            stringCargos+=`
                        <div class="card" onclick="guardarId('${cargo.nomeCargo}'), telaEditarCargo()">
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

function guardarId(cargo){
    console.log("CARGO: " + cargo)
    let indice = -1;
    for( let i = 0; i < cargos.length; i++){
        console.log("CARGO na posição: " + i + cargos[i].nomeCargo)
        if (cargos[i].nomeCargo == cargo){
            indice = i + 1
        }
    }
    sessionStorage.setItem("ID_DO_CARGO", indice)
}

function deletarCargo(){
    let idCargo = parseInt(sessionStorage.ID_DO_CARGO, 10);
    let idEmpresa = sessionStorage.ID_EMPRESA;

    Swal.fire({
        title: "Deletar cargo?",
        text: "Não é possível restaurar após deleção",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", 
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, deletar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {

        
        if (result.isConfirmed) {

            fetch(`/cargos/deletarCargo/${idEmpresa}/${idCargo}`, {
                method: "DELETE" 
            })
                .then(function (resposta) {

                    if (resposta.ok) {  
                        
                        Swal.fire({
                            title: "Deletado!",
                            text: "Cargo deletado com sucesso.",
                            icon: "success"
                        }).then(() => {
                            window.location.reload(); 
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

function telaEditarCargo(){
    let permissoes = sessionStorage.PERMISSOES_USUARIO
    //console.log(permissoes)
    if (permissoes.includes(6)){
        window.location="./edit_cargo.html"
    } else {
        Swal.fire({
            icon:"error",
            text:"Você não tem permissão para editar cargos"
        })
    }
}

function telaCriarCargo(){
    let permissoes = sessionStorage.PERMISSOES_USUARIO
    //console.log(permissoes)
    if (permissoes.includes(6)){
        window.location="./create_edit_cargo.html"
    } else {
        Swal.fire({
            icon:"error",
            text:"Você não tem permissão para criar cargos"
        })
    }
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

    