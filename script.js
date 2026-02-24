/**
 * Variables Globales & Persistance
 */
let events = JSON.parse(localStorage.getItem('ticket_app_data')) || [];
let currentEventId = null;
let myChart = null;

// Initialisation au chargement
window.onload = () => {
    renderHome();
};

/**
 * Navigation entre les vues
 */
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    if(viewId === 'view-home') renderHome();
}

/**
 * ÉTAPE 1 : Accueil - Liste des événements
 */
function renderHome() {
    const list = document.getElementById('event-list');
    const empty = document.getElementById('empty-state');
    list.innerHTML = '';

    if (events.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        events.forEach(ev => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <h3>${ev.name}</h3>
                <p>📍 ${ev.location}</p>
                <p>📅 ${formatDate(ev.date)} — <strong>${ev.guests.length} tickets</strong></p>
            `;
            card.onclick = () => openDashboard(ev.id);
            list.appendChild(card);
        });
    }
}

/**
 * ÉTAPE 2 : Création de l'événement
 */
function handleCreateEvent() {
    const name = document.getElementById('ev-name-in').value.trim();
    const date = document.getElementById('ev-date-in').value;
    const loc = document.getElementById('ev-loc-in').value.trim();

    if (!name || !date || !loc) {
        alert("⚠️ Veuillez remplir le nom, la date et le lieu.");
        return;
    }

    const newEvent = {
        id: Date.now(),
        name: name,
        date: date,
        location: loc,
        guests: [] // Liste des participants
    };

    events.push(newEvent);
    saveData();
    openDashboard(newEvent.id);
}

/**
 * ÉTAPE 3 : Dashboard & Statistiques
 */
function openDashboard(id) {
    currentEventId = id;
    const ev = events.find(e => e.id === id);
    
    document.getElementById('dash-title').innerText = ev.name;
    document.getElementById('dash-meta').innerText = `${formatDate(ev.date)} — ${ev.location}`;
    
    showView('view-dashboard');
    switchTab('stats');
    updateStats(ev);
}

function switchTab(tab) {
    document.getElementById('tab-stats').style.display = (tab === 'stats') ? 'block' : 'none';
    document.getElementById('tab-tickets').style.display = (tab === 'tickets') ? 'block' : 'none';
    
    document.getElementById('btn-tab-stats').classList.toggle('active', tab === 'stats');
    document.getElementById('btn-tab-tickets').classList.toggle('active', tab === 'tickets');
}

/**
 * ÉTAPE 4 : Génération du Ticket Participant
 */
function handleGenerateTicket() {
    const fname = document.getElementById('guest-name-in').value.trim();
    const job = document.getElementById('guest-job-in').value.trim() || "Participant";
    const type = document.getElementById('guest-type-in').value;

    if (!fname) {
        alert("❌ Le nom du participant est obligatoire.");
        return;
    }

    const ev = events.find(e => e.id === currentEventId);
    ev.guests.push({ name: fname, job: job, type: type });
    saveData();

    // Mise à jour de l'aperçu visuel
    document.getElementById('preview-ev-name').innerText = ev.name.toUpperCase();
    document.getElementById('preview-guest-name').innerText = fname;
    document.getElementById('preview-guest-job').innerText = job;
    document.getElementById('preview-ev-date').innerText = formatDate(ev.date);
    document.getElementById('preview-ev-loc').innerText = ev.location;
    document.getElementById('preview-type').innerText = type;

    // Génération du QR Code
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";
    
    if (typeof QRCode !== "undefined") {
        new QRCode(qrContainer, {
            text: `EVENT:${ev.name}|GUEST:${fname}|TYPE:${type}`,
            width: 110,
            height: 110,
            colorDark : "#1a1a1a",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    document.getElementById('result-area').style.display = "block";
    updateStats(ev);
}

/**
 * Mise à jour du Graphique Chart.js
 */
function updateStats(ev) {
    document.getElementById('stat-count').innerText = ev.guests.length;

    const jobsCount = {};
    ev.guests.forEach(g => {
        jobsCount[g.job] = (jobsCount[g.job] || 0) + 1;
    });

    const ctx = document.getElementById('professionChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(jobsCount),
            datasets: [{
                data: Object.values(jobsCount),
                backgroundColor: ['#008f68', '#d4af37', '#1a1a1a', '#e0e0e0']
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

/**
 * Utilitaires & Export
 */
function saveData() {
    localStorage.setItem('ticket_app_data', JSON.stringify(events));
}

function formatDate(dateStr) {
    if (!dateStr) return "--/--/----";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function downloadTicket() {
    const ticketElement = document.getElementById('ticket-to-export');
    html2canvas(ticketElement, { scale: 3, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Ticket_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}