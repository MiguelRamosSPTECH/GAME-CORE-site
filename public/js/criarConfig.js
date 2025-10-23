var radiosInputs = document.querySelectorAll('input[type="radio"]')
for(let i=0;i<radiosInputs.length;i++) {
  radiosInputs[i].addEventListener('click', ()=> {
    var areaInputs = radiosInputs[i].parentNode.parentNode.parentNode.lastElementChild
      if(radiosInputs[i].checked) {
        areaInputs.setAttribute('style','display:flex!important')
      }
  })
}
