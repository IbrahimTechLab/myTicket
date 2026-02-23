// Variable globale pour stocker l'événement en cours
let currentEvent = null;

// ÉTAPE 1 : Initialiser l'événement et changer de vue
function initEvent() {
    const name = document.getElementById('event-name').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const loc = document.getElementById('event-location').value;

    if (!name || !date || !loc) {
        alert("Veuillez remplir tous les champs de l'événement avant de continuer.");
        return;
    }

    // Sauvegarde des infos de l'événement
    currentEvent = {
        name: name,
        date: date,
        time: time,
        location: loc
    };

    // Mise à jour des textes du Dashboard et du Ticket
    document.getElementById('active-event-title').innerText = currentEvent.name;
    document.getElementById('active-event-info').innerText = `${currentEvent.date} à ${currentEvent.time} - ${currentEvent.location}`;
    
    // On remplit déjà les infos fixes sur le ticket preview
    document.getElementById('preview-event-name').innerText = currentEvent.name.toUpperCase();
    document.getElementById('preview-date').innerText = currentEvent.date;
    document.getElementById('preview-location').innerText = currentEvent.location;

    // Basculer l'affichage
    document.getElementById('setup-view').style.display = 'none';
    document.getElementById('event-dashboard').style.display = 'block';
}

// ÉTAPE 2 : Générer le ticket pour un participant
function generateTicket() {
    const fname = document.getElementById('guest-firstname').value;
    const lname = document.getElementById('guest-lastname').value;
    const job = document.getElementById('guest-job').value;
    const type = document.getElementById('guest-type').value;

    if (!fname || !lname) {
        alert("S'il vous plaît, remplissez au moins le nom et le prénom !");
        return;
    }

    // Mise à jour des textes dynamiques sur le ticket
    document.getElementById('preview-guest-name').innerText = `${fname} ${lname}`;
    document.getElementById('preview-guest-job').innerText = job || "Participant";
    document.getElementById('preview-guest-type').innerText = type;

    // Génération du QR Code
    const qrContent = `EVENT: ${currentEvent.name}\nUSER: ${fname} ${lname}\nJOB: ${job}\nTYPE: ${type}`;
    
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = ""; // Nettoyage

    new QRCode(qrContainer, {
        text: qrContent,
        width: 120,
        height: 120,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Affichage de la zone de résultat
    document.getElementById('result-section').style.display = "block";
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });

    // Simulation de sauvegarde dans data.js (console)
    saveToDataLog(fname, lname, type);
}

// ÉTAPE 3 : Téléchargement PNG
function downloadTicket() {
    const ticket = document.getElementById('ticket-to-export');
    const guestName = document.getElementById('guest-lastname').value || "ticket";

    html2canvas(ticket, {
        scale: 2,
        backgroundColor: null,
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Ticket-${currentEvent.name}-${guestName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// Fonction utilitaire pour réinitialiser
function resetApp() {
    if(confirm("Cela effacera l'événement en cours. Continuer ?")) {
        location.reload();
    }
}

function saveToDataLog(f, l, t) {
    console.log(`Ticket enregistré pour ${f} ${l} [${t}] pour l'event ${currentEvent.name}`);
}