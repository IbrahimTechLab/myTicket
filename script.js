// Variable globale pour stocker l'événement actif
let currentEvent = null;

/**
 * ÉTAPE 1 : Initialisation de l'événement
 */
function initEvent() {
    const name = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const loc = document.getElementById('event-location').value.trim();

    // Vérification stricte des champs
    if (!name || !date || !loc) {
        alert("⚠️ Oups ! Veuillez remplir au moins le nom, la date et le lieu.");
        return;
    }

    // Création de l'objet événement
    currentEvent = {
        name: name,
        date: formatDate(date),
        time: time || "--:--",
        location: loc
    };

    // Injection des données dans le Dashboard et la preview du Ticket
    document.getElementById('active-event-title').innerText = currentEvent.name;
    document.getElementById('active-event-info').innerText = `${currentEvent.date} à ${currentEvent.time} - ${currentEvent.location}`;
    
    document.getElementById('preview-event-name').innerText = currentEvent.name.toUpperCase();
    document.getElementById('preview-date').innerText = currentEvent.date;
    document.getElementById('preview-location').innerText = currentEvent.location;

    // Transition visuelle
    document.getElementById('setup-view').style.display = 'none';
    document.getElementById('event-dashboard').style.display = 'block';
    
    window.scrollTo(0, 0); // Remonte en haut pour le mobile
}

/**
 * ÉTAPE 2 : Génération du ticket participant
 */
function generateTicket() {
    const fname = document.getElementById('guest-firstname').value.trim();
    const lname = document.getElementById('guest-lastname').value.trim();
    const job = document.getElementById('guest-job').value.trim();
    const type = document.getElementById('guest-type').value;

    if (!fname || !lname) {
        alert("❌ Le nom et le prénom du participant sont obligatoires.");
        return;
    }

    // Mise à jour de l'aperçu visuel
    document.getElementById('preview-guest-name').innerText = `${fname} ${lname}`;
    document.getElementById('preview-guest-job').innerText = job || "Participant";
    document.getElementById('preview-guest-type').innerText = type;

    // Génération du QR Code
    // Note: On utilise l'objet QRCode de qrcodejs (doit être chargé dans index.html)
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = ""; // On vide l'ancien QR

    const qrData = `EVENT: ${currentEvent.name} | GUEST: ${fname} ${lname} | TYPE: ${type}`;

    try {
        new QRCode(qrContainer, {
            text: qrData,
            width: 100,
            height: 100,
            colorDark : "#1a1a1a",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } catch (e) {
        console.error("Erreur génération QR Code:", e);
    }

    // Affichage du ticket
    document.getElementById('result-section').style.display = "block";
    
    // Petit scroll fluide vers le ticket sur mobile
    setTimeout(() => {
        document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

/**
 * ÉTAPE 3 : Téléchargement du ticket en image PNG
 */
function downloadTicket() {
    const ticketElement = document.getElementById('ticket-to-export');
    const guestLName = document.getElementById('guest-lastname').value || "ticket";

    // Options pour html2canvas pour éviter les bugs sur mobile/serveur
    const options = {
        scale: 2, // Haute qualité
        useCORS: true, // Important pour GitHub Pages si images externes
        allowTaint: true,
        backgroundColor: null
    };

    html2canvas(ticketElement, options).then(canvas => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `Ticket_${currentEvent.name}_${guestLName}.png`;
        link.href = image;
        link.click();
    }).catch(err => {
        alert("Erreur lors de la génération de l'image. Réessayez.");
        console.error(err);
    });
}

/**
 * Utilitaires
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function resetApp() {
    if(confirm("⚠️ Attention : Changer d'événement effacera les données actuelles. Continuer ?")) {
        location.reload();
    }
}