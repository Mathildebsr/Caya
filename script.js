// Variables globales
const startButton = document.getElementById("startButton");
const countdownDiv = document.getElementById("countdown");
const calendarContainer = document.getElementById("calendarContainer");
const title = document.querySelector("h1");
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll("nav a");

let timer = null;
let countdownTime = 5 * 60 * 60; // 5 heures en secondes

// Navigation
navLinks.forEach((link, index) => {
  link.addEventListener("click", () => {
    sections.forEach(section => section.classList.remove("active"));
    sections[index].classList.add("active");
  });
});

// Générer le calendrier mensuel
function generateCalendar() {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    calendarContainer.appendChild(dayDiv);
  }
}

// Met à jour le compte à rebours
function updateCountdown() {
  if (countdownTime >= 0) {
    const hours = Math.floor(countdownTime / 3600);
    const minutes = Math.floor((countdownTime % 3600) / 60);
    const seconds = countdownTime % 60;
    countdownDiv.textContent = `${hours}h ${minutes}m ${seconds}s`;
    countdownTime--;
  } else {
    clearInterval(timer);
    timer = null;
    alert("Temps écoulé !");
    navigator.vibrate(1000); // Signal de vibration
    // Option 4 : Jouer un son
    const sound = document.getElementById("alertSound");
    if (sound) {
      sound.play();
    }
  }
}

// Réinitialise le compteur
function resetCountdown() {
  countdownTime = 5 * 60 * 60; // Réinitialisation à 5 heures
  clearInterval(timer);
  timer = setInterval(updateCountdown, 1000);
}

// Ajoute un point rose au calendrier
function markCalendar() {
  const today = new Date().getDate();
  const eventDiv = calendarContainer.children[today - 1];
  if (eventDiv) {
    const dot = document.createElement("div");
    dot.classList.add("event");
    eventDiv.appendChild(dot);
  }
}

// Gère l'activation du bouton
startButton.addEventListener("click", () => {
  document.body.classList.toggle("active");
  const isActive = document.body.classList.contains("active");


  // Inversion des couleurs
  document.body.style.backgroundColor = isActive ? "#C781bb" : "#F7f7f7";
  startButton.style.backgroundColor = isActive ? "#F7f7f7" : "#C781bb";
  startButton.style.color = isActive ? "#C781bb" : "#F7f7f7";
  title.classList.toggle("inverted", isActive);

  // Réinitialiser et redémarrer le compte à rebours
  resetCountdown();

  // Ajouter un point rose au calendrier
  markCalendar();

  // Vibration à chaque activation
  navigator.vibrate(200);
});

// Initialisation
generateCalendar();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker enregistré avec succès:', registration);
    }).catch((error) => {
      console.log('Échec de l\'enregistrement du Service Worker:', error);
    });
  });
}

let deferredPrompt;
const addBtn = document.getElementById('addButton');

window.addEventListener('beforeinstallprompt', (event) => {
  // Prévenir le navigateur de la demande d'ajout à l'écran d'accueil
  event.preventDefault();
  deferredPrompt = event;
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', () => {
    // Afficher la demande d'installation
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('L\'utilisateur a ajouté à l\'écran d\'accueil');
      }
      deferredPrompt = null;
    });
  });
});
