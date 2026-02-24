// On récupère les données au démarrage
let events = JSON.parse(localStorage.getItem('ticket_app_data')) || [];
let currentEventId = null;
let myChart = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderHome();
});

// Navigation
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    if(viewId === 'view-home') renderHome();
}

// Accueil : Liste les événements
function renderHome() {
    const list = document.getElementById('event-list');
    const empty = document.getElementById('empty-state');
    list.innerHTML = '';

    if (events.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        events.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'event-card';
            div.innerHTML = `
                <h3>${ev.name}</h3>
                <p>📍 ${ev.location} | 📅 ${formatDate(ev.date)}</p>
                <p><strong>${ev.guests.length}</strong> tickets générés</p>
            `;
            div.onclick = () => openDashboard(ev.id);
            list.appendChild(div);
        });
    }
}

// Création d'un événement
function handleCreateEvent() {
    const name = document.getElementById('ev-name-in').value.trim();
    const date = document.getElementById('ev-date-in').value;
    const loc = document.getElementById('ev-loc-in').value.trim();

    if (!name || !date || !loc) return alert("Veuillez tout remplir !");

    const newEvent = {
        id: Date.now(),
        name,
        date,
        location: loc,
        guests: []
    };

    events.push(newEvent);
    saveData();
    openDashboard(newEvent.id);
}

// Dashboard
function openDashboard(id) {
    currentEventId = id;
    const ev = events.find(e => e.id === id);
    
    document.getElementById('dash-title').innerText = ev.name;
    document.getElementById('dash-meta').innerText = `${formatDate(ev.date)} - ${ev.location}`;
    
    showView('view-dashboard');
    switchTab('stats');
    updateStats(ev);
}

// Onglets
function switchTab(tab) {
    document.getElementById('tab-stats').style.display = (tab === 'stats') ? 'block' : 'none';
    document.getElementById('tab-tickets').style.display = (tab === 'tickets') ? 'block' : 'none';
    
    document.getElementById('btn-tab-stats').classList.toggle('active', tab === 'stats');
    document.getElementById('btn-tab-tickets').classList.toggle('active', tab === 'tickets');
}

// Générer Ticket
function handleGenerateTicket() {
    const name = document.getElementById('guest-name-in').value.trim();
    const job = document.getElementById('guest-job-in').value.trim() || "Participant";
    const type = document.getElementById('guest-type-in').value;

    if (!name) return alert("Nom de l'invité requis !");

    const ev = events.find(e => e.id === currentEventId);
    const guest = { name, job, type };
    ev.guests.push(guest);
    
    saveData();

    // Update UI Ticket
    document.getElementById('preview-ev-name').innerText = ev.name.toUpperCase();
    document.getElementById('preview-guest-name').innerText = name;
    document.getElementById('preview-guest-job').innerText = job;
    document.getElementById('preview-ev-date').innerText = formatDate(ev.date);
    document.getElementById('preview-ev-loc').innerText = ev.location;
    document.getElementById('preview-type').innerText = type;

    // QR Code
    const qrBox = document.getElementById('qrcode');
    qrBox.innerHTML = "";
    new QRCode(qrBox, {
        text: `EVENT:${ev.name}|GUEST:${name}|JOB:${job}|TYPE:${type}`,
        width: 100,
        height: 100,
        correctLevel : QRCode.CorrectLevel.M
    });

    document.getElementById('result-area').style.display = 'block';
    updateStats(ev);
}

// Statistiques (Chart.js)
function updateStats(ev) {
    document.getElementById('stat-count').innerText = ev.guests.length;

    const jobs = {};
    ev.guests.forEach(g => jobs[g.job] = (jobs[g.job] || 0) + 1);

    const ctx = document.getElementById('professionChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(jobs),
            datasets: [{
                data: Object.values(jobs),
                backgroundColor: ['#008f68', '#d4af37', '#1a1a1a', '#cccccc']
            }]
        },
        options: { maintainAspectRatio: false }
    });
}

// Utilitaires
function saveData() {
    localStorage.setItem('ticket_app_data', JSON.stringify(events));
}

function formatDate(d) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(d).toLocaleDateString('fr-FR', options);
}

function downloadTicket() {
    const ticket = document.getElementById('ticket-to-export');
    html2canvas(ticket, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Ticket_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}