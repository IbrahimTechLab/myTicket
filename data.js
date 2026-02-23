// Simulation d'une base de données locale
const eventData = {
    currentEvent: {
        name: "",
        date: "",
        location: ""
    },
    ticketsGenerated: []
};

// Fonction pour sauvegarder chaque ticket généré dans la session (historique)
function saveTicketToHistory(fname, lname, type) {
    const newTicket = {
        id: Date.now(),
        name: `${fname} ${lname}`,
        type: type,
        dateGenerated: new Date().toLocaleString()
    };
    eventData.ticketsGenerated.push(newTicket);
    console.log("Ticket sauvegardé dans data.js :", eventData.ticketsGenerated);
}