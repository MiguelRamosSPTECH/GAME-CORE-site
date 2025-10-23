 const ctx = document.getElementById('graficos');

 new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['CONTAINER 1','CONTAINER 2','CONTAINER 3'],
      datasets: [
        {
            label: 'CPU',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 3
        },
        {
            label: 'RAM',
            data: [12, 50, 10, 5, 2, 30],
            borderWidth: 3
        },
        {
            label: 'I/O',
            data: [5, 25, 0, 20, 5, 10],
            borderWidth: 3
        }
    ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
            ticks: {
                font: {
                    size: 13,
                    weight: "lighter"
                }   
            }
        },
        x: {
            ticks: {
                font: {
                    size: 15,
                    weight: "lighter"
                }
            }
        }
      },
      responsive: true
    }
  });


function showMetrics(elemento) {
  var areaMetricas = elemento.parentNode.parentNode.parentNode.lastElementChild;
  var iconeSeta = elemento.parentNode.parentNode;
  if(areaMetricas.style.display == "none" || areaMetricas.style.display == "") {
    elemento.style.backgroundColor = "#74ce3a"
    elemento.style.border = "2px solid black"
    areaMetricas.style.display = "flex"
    iconeSeta.removeChild(iconeSeta.lastElementChild)
    iconeSeta.innerHTML+=`<i class="fa-solid fa-angles-down"></i>`
  } else {
    elemento.style.backgroundColor = "transparent"
    elemento.style.border = "1px solid black"
    areaMetricas.style.display = "none"
    iconeSeta.removeChild(iconeSeta.lastElementChild)
    iconeSeta.innerHTML+=`<i class="fa-solid fa-angles-left"></i>`
  }
}

function abrirModalConfigs() {
    var idModal = document.getElementsByClassName('modal')[0];
    var backgroundModal = document.getElementsByClassName('background-modal')[0];
    if(idModal.style.display == "none" || idModal.style.display == "") {
      idModal.style.display = "flex"
      backgroundModal.style.display = "block"
    } else {
      idModal.style.display = "none"
      backgroundModal.style.display = "none"
    }
}