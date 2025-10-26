function carregarConfigs() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/layouts/buscarCompleto/${idEmpresa}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(async resposta => {
            var listaLayouts = await resposta.json();
            var nomeLayoutTroca = "";
            var nomeComponenteTroca = ""
            var stringsComponentes = "";
            var areaComponentes;
            if (resposta.ok) {
                var divLayouts = document.getElementById('area_layouts');
                var contador = 0;

                console.log(listaLayouts)

                listaLayouts.forEach(layout => {
                    if (nomeLayoutTroca != layout.nomeLayout) {


                        divLayouts.innerHTML += `
                        <div class="card">
                            <div class="icon-top">
                                <img src="../../assets/imgs/icon-config-layout.png">
                            </div>
                            <h2>${layout.nomeLayout.toUpperCase()}</h2>
                            <input type="text" style="display:none" value="${layout.id}">
                            <div class="icons-bottom" id="componentes_${contador}">
                            </div>
                            <button onclick="usarLayout(${layout.id})">USAR LAYOUT</button>
                            <button onclick="edicaoLayout(${layout.id})">EDITAR LAYOUT</button>
                        </div>                          
                    `
                        contador++;
                    }

                    if (nomeComponenteTroca != layout.nome.split("_")[0].toLowerCase() || nomeLayoutTroca != layout.nomeLayout) {
                        areaComponentes = document.getElementById(`componentes_${contador - 1}`)

                        if (layout.nome.split("_")[0].trim().toLowerCase() == "cpu") {
                            areaComponentes.innerHTML +=
                                `
                                    <div class="icon-item">
                                        <div class="icon-cpu"></div>
                                        <span>CPU</span>
                                    </div>                           
                                `
                        } else if (layout.nome.split("_")[0].trim().toLowerCase() == "ram") {
                            areaComponentes.innerHTML +=
                                `
                                    <div class="icon-item">
                                        <div class="icon-ram"></div>
                                        <span>RAM</span>
                                    </div>                           
                                `
                        } else {
                            areaComponentes.innerHTML +=
                                `
                                    <div class="icon-item">
                                        <div class="icon-disco"></div>
                                        <span>DISCO</span>
                                    </div>                           
                                `
                        }
                    }

                    nomeComponenteTroca = layout.nome.split("_")[0].toLowerCase()
                    nomeLayoutTroca = layout.nomeLayout

                })
            }
        })
}

function usarLayout(idLayout) {
    const idLayoutVar = idLayout;
    const idEmpresaVar = sessionStorage.ID_EMPRESA;

    // if ()validação

    fetch("/layouts/usarLayout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idLayoutServer: idLayoutVar,
            idEmpresaServer: idEmpresaVar
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta)
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function edicaoLayout(idLayout){
    sessionStorage.ID_LAYOUT = idLayout;
    window.location='./edit_layout.html';
}