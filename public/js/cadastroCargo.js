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

                    mensagem_erro.innerHTML =
                        "Cargo criado com sucesso!";
                        setTimeout(() => {
                        // window.location = "login.html";
                    }, "2000");
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

    