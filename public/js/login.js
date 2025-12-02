function entrar() {
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;

    if (emailVar == "" || senhaVar == "") {
        msg_erro.innerHTML = `Preencha todos os campos!`
        return;
    } else {

        console.log("FORM LOGIN: ", emailVar);
        console.log("FORM SENHA: ", senhaVar);

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        }).then(function (resposta) {

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));

                    sessionStorage.ID_EMPRESA = json.idEmpresa;
                    sessionStorage.CPF_USUARIO = json.cpf;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.ID_USUARIO = json.id;
                    sessionStorage.NOME_CARGO = json.nomeCargo;

                    var fk_cargo_func = json.fk_cargo_func;
                    buscarEsalvarPermissoes(fk_cargo_func)

                    setTimeout(function () {
                        let permissoes = sessionStorage.PERMISSOES_USUARIO

                        if (permissoes.includes(1) && permissoes.includes(2)) {
                            Swal.fire({
                                title: "Qual tela gostaria de acessar?",
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonColor: "#ae00ffff",
                                cancelButtonColor: "rgba(24, 43, 219, 1)",
                                confirmButtonText: "SRE",
                                cancelButtonText: "GameOps"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location = "../dashboard/dash_sre/sre_comparativo_servidores.html"
                                } else {
                                    window.location = "../dashboard/index.html"
                                }
                            });
                        } else if(permissoes.includes(1) && permissoes.includes(3)){
                            Swal.fire({
                                title: "Qual tela gostaria de acessar?",
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonColor: "#ae00ffff",
                                cancelButtonColor: "rgba(24, 43, 219, 1)",
                                confirmButtonText: "Administrador",
                                cancelButtonText: "GameOps"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location = "../dashboard/dash_adm/funcionarios/index.html"
                                } else {
                                    window.location = "../dashboard/index.html"
                                }
                            });
                        } else if(permissoes.includes(2) && permissoes.includes(3)){
                            Swal.fire({
                                title: "Qual tela gostaria de acessar?",
                                icon: "question",
                                showCancelButton: true,
                                confirmButtonColor: "#ae00ffff",
                                cancelButtonColor: "rgba(24, 43, 219, 1)",
                                confirmButtonText: "Administrador",
                                cancelButtonText: "SRE"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location = "../dashboard/dash_adm/funcionarios/index.html"
                                } else {
                                    window.location = "../dashboard/dash_sre/sre_comparativo_servidores.html"
                                }
                            });
                        }else if (permissoes.includes(1)) {
                            window.location = "../dashboard/servidores/desc_servidor.html"
                        }else if (permissoes.includes(2)) {
                            window.location = "../dashboard/dash_sre/sre_comparativo_servidores.html"
                        } else if (permissoes.includes(3)) {
                            window.location = "../dashboard/dash_adm/funcionarios/index.html"
                        }


                    }, 2100); // apenas para exibir o loading

                });

            } else {
                resposta.text().then(texto => {
                    msg_erro.innerHTML = texto
                });
            }

        }).catch(function (erro) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algo deu errado!",
            });
            console.log(erro);
        })
    }
}

function buscarEsalvarPermissoes(fk_cargo) {

    if (!fk_cargo) {

        sessionStorage.setItem('PERMISSOES_USUARIO', '[]');
        console.log("Usuário logado sem FK_CARGO. Assumindo permissões vazias.");

        setTimeout(() => {
            window.location = "index.html";
        }, 500);
        return;
    }

    fetch("/cargos/buscarPermissoes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({

            fkCargoServer: fk_cargo

        })
    }).then(function (resposta) {

        if (resposta.ok) {
            resposta.json().then(json => {

                sessionStorage.setItem('PERMISSOES_USUARIO', JSON.stringify(json.permissoes));

                console.log("Permissões salvas com sucesso:", json.permissoes);
                console.log("Permissões salvas com sucesso:", sessionStorage.getItem("PERMISSOES_USUARIO"));

                setTimeout(function () {
                  //  window.location = "index.html";
                }, 1000);
            });

        } else {

            console.error("Erro ao buscar permissões do cargo:", resposta.statusText);
            sessionStorage.setItem('PERMISSOES_USUARIO', '[]');

            setTimeout(() => {
                //window.location = "index.html";
            }, 500);
        }

    }).catch(function (erro) {

        console.error("Erro no fetch de permissões:", erro);

        sessionStorage.setItem('PERMISSOES_USUARIO', '[]'); // Falhou? Bloqueia, deixando as permissões "zeradas"

        setTimeout(() => {
            //window.location = "index.html";
        }, 500);
    });
}
