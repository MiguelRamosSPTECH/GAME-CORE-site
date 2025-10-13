    function cadastrar(){   
        let cargoVar = ipt_cargo.value;
        let fk_empresaVar = sessionStorage.ID_EMPRESA;
        
        console.log(cargoVar);

        let permissoesSelecionadasVar = []

        document.querySelectorAll("input[type=checkbox]:checked").forEach(c => {
            permissoesSelecionadasVar.push(c.value)
        })

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

    