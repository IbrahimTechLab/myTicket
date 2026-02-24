function generateTicket() {
    const name = document.getElementById('guest-fullname').value.trim();
    const job = document.getElementById('guest-profession').value.trim();
    const type = document.getElementById('guest-type').value;

    if (!name || !job) {
        alert("Erreur : Nom et Profession requis pour le QR Code.");
        return;
    }

    // On prépare l'affichage
    const resultSection = document.getElementById('result-section');
    resultSection.style.display = "block";
    document.getElementById('preview-guest-type').innerText = type;

    // Nettoyage du QR précédent
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";

    // Les infos sont cachées ICI, dans le QR Code
    const dataForQR = `INVITÉ: ${name}\nJOB: ${job}\nTYPE: ${type}\nEVENT: Zeinab's Twist 2026`;

    // Utilisation de TA librairie qrcode.js
    try {
        new QRCode(qrContainer, {
            text: dataForQR,
            width: 120,
            height: 120,
            colorDark : "#1a1a1a",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H // Haute sécurité pour scan facile
        });
        
        resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
        console.error("Erreur critique QR:", e);
        alert("Erreur de bibliothèque. Vérifiez que libs/qrcode.js est bien chargé.");
    }
}

function downloadTicket() {
    const ticket = document.getElementById('ticket-to-export');
    html2canvas(ticket, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Ticket_ZT_Privé.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}