document.addEventListener(
  "click",
  () => {
    if (!alarmAudio) {
      alarmAudio = new Audio("sounds/notificationDefault.mp3");

      alarmAudio.volume = 0;
      // Prepara el audio para que el navegador permita reproducirlo después
      alarmAudio.play();
    }
  },
  { once: true }
);
function start() {
  window.location.href = "main.html";
}

function llenarLista(id, inicio, fin) {
  let lista = document.getElementById(id);
  lista.innerHTML = "";

  for (let i = inicio; i <= fin; i++) {
    let option = document.createElement("div");

    option.innerText = i < 10 ? "0" + i : i; // Asegura formato 00

    option.onclick = function () {
      document.getElementById(id).previousElementSibling.innerText =
        this.innerText;
      lista.style.display = "none";
    };
    lista.appendChild(option);
  }
}

llenarLista("dropdownHours", 0, 23);
llenarLista("dropdownMinutes", 0, 59);

function showSetBreak() {
  breakContainer = document.getElementById("setBreak");

  breakContainer.style.display = "flex";
  setTimeout(() => {
    breakContainer.style.opacity = "1";
    breakContainer.style.transform = "translateY(20px)";
  }, 10);
}

function saveBreak() {
  const hour = document.getElementById("hourSelected").innerText;
  const minute = document.getElementById("minuteSelected").innerText;
  let time = hour + ":" + minute;

  let breaks = JSON.parse(localStorage.getItem("breaks") || "[]");

  if (breakToEdit) {
    // Editar: reemplaza el break anterior
    breaks = breaks.map((b) => (b === breakToEdit ? time : b));
    breakToEdit = null;
  } else {
    // Nuevo break
    breaks.push(time);
  }
  localStorage.setItem("breaks", JSON.stringify(breaks));

  loadBreaks(); // Refresca la lista

  // Oculta el contenedor
  breakContainer = document.getElementById("setBreak");
  breakContainer.style.opacity = "0";
  breakContainer.style.transform = "translateY(-10px)";
  setTimeout(() => {
    breakContainer.style.display = "none";
  }, 300);
}

function renderBreak(time) {
  const container = document.getElementById("breaksCreated");
  let newBreak = document.createElement("div");
  let trashIcon = document.createElement("img");
  trashIcon.src = "img/trash.png";
  trashIcon.setAttribute("id", "deleteBreak");
  trashIcon.style.height = "30px";
  trashIcon.style.width = "30px";
  trashIcon.setAttribute("onclick", "deleteBreak(this)");

  let editIcon = document.createElement("img");
  editIcon.src = "img/edit.png";
  editIcon.setAttribute("id", "editBreak");
  editIcon.style.height = "30px";
  editIcon.style.width = "30px";
  editIcon.setAttribute("data-time", time); // Guarda el break a editar
  editIcon.onclick = function () {
    editBreak(this);
  };

  newBreak.innerText += time + " ";
  let buttons = document.createElement("div");
  buttons.setAttribute("id", "breakButtons");
  buttons.appendChild(trashIcon);
  buttons.appendChild(editIcon);
  newBreak.appendChild(buttons);

  newBreak.id = "breakCreated";
  container.appendChild(newBreak);
}

function loadBreaks() {
  const breaks = JSON.parse(localStorage.getItem("breaks") || "[]");
  const container = document.getElementById("breaksCreated");
  container.innerHTML = "";
  breaks.forEach((time) => renderBreak(time));
}

// Llama a loadBreaks cuando cargue la página
window.onload = loadBreaks;
let breakToEdit = null;
let editingDiv = null; // Variable para almacenar el div que se está editando
function editBreak(element) {
  breakToEdit = element.getAttribute("data-time");
  if (editingDiv) {
    editingDiv.classList.remove("break-editing");
  }
  editingDiv = element.parentElement.parentElement;
  if (editingDiv) {
    editingDiv.classList.add("break-editing");
  }
  // Rellena los campos del formulario con la hora y minuto actuales
  const [hour, minute] = breakToEdit.split(":");
  document.getElementById("hourSelected").innerText = hour;
  document.getElementById("minuteSelected").innerText = minute;
  showSetBreak();
}

function deleteBreak(element) {
  let breakElement = element.parentElement.parentElement;
  let time = breakElement.innerText.trim();
  // Elimina el break del localStorage
  let breaks = JSON.parse(localStorage.getItem("breaks") || "[]");
  breaks = breaks.filter((b) => !time.startsWith(b));
  localStorage.setItem("breaks", JSON.stringify(breaks));

  breakElement.style.opacity = "0";
  breakElement.style.transform = "translateY(-10px)";
  setTimeout(() => {
    breakElement.remove();
  }, 300);
}
function toggleDropdown(id) {
  let lista = document.getElementById(id);
  if (lista.style.display === "none" || lista.style.opacity === "0") {
    lista.style.display = "block";
    setTimeout(() => {
      // Espera un pequeño tiempo para activar la animación
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
let alarmAudio = null;
let lastAlertTime = null;
let alertActive = false; // <-- NUEVA VARIABLE

setInterval(() => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hour}:${minute}`;

  const breaks = JSON.parse(localStorage.getItem("breaks") || "[]");
  if (breaks.includes(currentTime)) {
    if (lastAlertTime !== currentTime && !alertActive) {
      // Solo si no hay confirm activo
      lastAlertTime = currentTime;
      alertActive = true; // Marca que el confirm está activo
      if (alarmAudio) {
        alarmAudio.volume = 1;
        alarmAudio.loop = true;
        alarmAudio.currentTime = 0;
        alarmAudio.play();
      }
      if (confirm(`Break time: ${currentTime}!`)) {
        if (alarmAudio) {
          alarmAudio.pause();
          alarmAudio.currentTime = 0;
        }
      }
      alertActive = false; // Libera el confirm para el siguiente minuto
    }
  } else {
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
    lastAlertTime = null;
    alertActive = false; // Libera el confirm si cambia la hora
  }
}, 10000);
