// Fonction pour mettre à jour l'aperçu en temps réel (optionnel mais sympa)
function updatePreview() {
    const eventName = document.getElementById('event-name').value || "NOM DE L'EVENT";
    const eventDate = document.getElementById('event-date').value || "---";
    const eventTime = document.getElementById('event-time').value || "---";
    const eventLoc = document.getElementById('event-location').value || "---";

    document.getElementById('preview-event-name').innerText = eventName.toUpperCase();
    document.getElementById('preview-date').innerText = eventDate;
    document.getElementById('preview-location').innerText = eventLoc;
}

// Fonction principale pour générer le ticket
function generateTicket() {
    // 1. Récupération des infos participant
    const fname = document.getElementById('guest-firstname').value;
    const lname = document.getElementById('guest-lastname').value;
    const job = document.getElementById('guest-job').value;
    const type = document.getElementById('guest-type').value;

    if (!fname || !lname) {
        alert("S'il vous plaît, remplissez au moins le nom et le prénom !");
        return;
    }

    // 2. Mise à jour des textes sur le ticket
    document.getElementById('preview-guest-name').innerText = `${fname} ${lname}`;
    document.getElementById('preview-guest-job').innerText = job || "Non spécifié";
    document.getElementById('preview-guest-type').innerText = type;

    // 3. Génération du QR Code
    // Contenu du QR : c'est ce que le gardien verra en scannant
    const qrContent = `PARTICIPANT: ${fname} ${lname}\nPOSTE: ${job}\nTYPE: ${type}\nEVENT: ${document.getElementById('event-name').value}`;
    
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = ""; // On efface le précédent

    new QRCode(qrContainer, {
        text: qrContent,
        width: 120,
        height: 120,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // 4. Afficher la section résultat
    document.getElementById('result-section').style.display = "block";
    
    // Scroll automatique vers le ticket
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
}

// Fonction pour télécharger le ticket en PNG
function downloadTicket() {
    const ticket = document.getElementById('ticket-to-export');
    const guestName = document.getElementById('guest-lastname').value;

    // Utilisation de html2canvas pour transformer la DIV en IMAGE
    html2canvas(ticket, {
        scale: 2, // Pour une meilleure qualité d'image
        backgroundColor: null,
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `ticket-${guestName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}