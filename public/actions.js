function updateTextInput(val, id, inputid, color) {
    let inputrange = document.getElementById(inputid);
    document.getElementById(id).innerHTML=val + "%"; 
    inputrange.style.background = 'linear-gradient(to top, '+ color +' 0%' + (val - 15) + '%, rgba(0,0,0,0) ' + val + '%, rgba(0,0,0,0)  100%)'
}


