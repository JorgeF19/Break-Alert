function start(){
    window.location.href = "main.html";
}

function llenarLista(id, inicio, fin) {
    let lista = document.getElementById(id);
    lista.innerHTML = "";

    for (let i = inicio; i <= fin; i++) {
        let option = document.createElement("div");
        
        option.innerText = i < 10 ? "0" + i : i; // Asegura formato 00
        
        option.onclick = function(){
            document.getElementById(id).previousElementSibling.innerText= this.innerText;
            lista.style.display="none";
        };
        lista.appendChild(option);
    }
}

llenarLista("dropdownHours",0,23);
llenarLista("dropdownMinutes",0,59);

function showSetBreak(){
    breakContainer = document.getElementById("setBreak");
    
        breakContainer.style.display = "flex";
        setTimeout(() =>{
            breakContainer.style.opacity = "1";
            breakContainer.style.transform = "translateY(20px)";
        }, 10)
    
}

function saveBreak(){
    
    let newBreak = document.createElement("div");
    const hour = document.getElementById("hourSelected").innerText;
    const minute = document.getElementById("minuteSelected").innerText;
    const container = document.getElementById("breaksCreated");
    let time = hour + ":" + minute;
    newBreak.innerHTML(time);
    container.appendChild(newBreak);

    breakContainer = document.getElementById("setBreak");
    breakContainer.style.opacity ="0";
        breakContainer.style.transform = "translateY(-10px)"
        setTimeout(() => {
            breakContainer.style.display = "none";
        }, 300);
}
function toggleDropdown(id) {
    let lista = document.getElementById(id);
    if (lista.style.display === "none" || lista.style.opacity === "0") {
        lista.style.display = "block";
        setTimeout(() => { // Espera un pequeño tiempo para activar la animación
            lista.style.opacity = "1";
            lista.style.transform = "translateY(0)";
        }, 10);
    } else {
        lista.style.opacity = "0";
        lista.style.transform = "translateY(-10px)";
        setTimeout(() => {
            lista.style.display = "none";
        }, 300); // 🔥 Espera hasta que termine la animación antes de ocultarlo
    }
}