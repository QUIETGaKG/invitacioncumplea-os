const defaultConfig = {
  child_name: 'Elián',
  child_age: '',
  event_date: '28 de Febrero, 2026',
  event_time: '11:00 AM - Final del día',
  venue_name: 'Camino Padre Hurtado 8174, Buin',
  venue_address: 'Camino Padre Hurtado 8174, Buin',
  team_name: 'Club Universidad de Chile',
  photo_1_url: 'assets/foto-1.svg',
  photo_2_url: 'assets/foto-2.svg'
};

let eventDetails = {
  title: `Cumpleaños de ${defaultConfig.child_name}`,
  date: '2026-02-28',
  time: '11:00',
  duration: 600,
  location: defaultConfig.venue_address,
  description: `¡Estás invitado al cumpleaños de ${defaultConfig.child_name}! Celebraremos con temática de fútbol del equipo ${defaultConfig.team_name}.`
};

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function addToGoogleCalendar() {
  const startDate = '20260228T110000';
  const endDate = '20260228T210000';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  showToast('¡Abriendo Google Calendar!', 'info');
}

function downloadICS() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Birthday Invitation//EN
BEGIN:VEVENT
DTSTART:20260228T110000
DTEND:20260228T210000
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cumpleanos.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('¡Archivo de calendario descargado!', 'success');
}

function updateMapsLink(address) {
  const mapsLink = document.getElementById('maps-link');
  if (mapsLink) mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function updateContent(config) {
  const childName = config.child_name || defaultConfig.child_name;
  const eventDate = config.event_date || defaultConfig.event_date;
  const eventTime = config.event_time || defaultConfig.event_time;
  const venueName = config.venue_name || defaultConfig.venue_name;
  const venueAddress = config.venue_address || defaultConfig.venue_address;
  const teamName = config.team_name || defaultConfig.team_name;
  const photo1Url = config.photo_1_url || defaultConfig.photo_1_url;
  const photo2Url = config.photo_2_url || defaultConfig.photo_2_url;

  const nameDisplay = document.getElementById('child-name-display');
  if (nameDisplay) nameDisplay.textContent = childName.toUpperCase();

  const dateDisplay = document.getElementById('date-display');
  if (dateDisplay) dateDisplay.textContent = eventDate;

  const timeDisplay = document.getElementById('time-display');
  if (timeDisplay) timeDisplay.innerHTML = `<i class="fas fa-clock mr-2"></i>${eventTime}`;

  const venueDisplay = document.getElementById('venue-display');
  if (venueDisplay) venueDisplay.textContent = venueName;

  const addressDisplay = document.getElementById('address-display');
  if (addressDisplay) addressDisplay.textContent = venueAddress;

  const teamDisplay = document.getElementById('team-name-display');
  if (teamDisplay) teamDisplay.textContent = teamName;

  const photo1 = document.getElementById('photo-1');
  if (photo1) photo1.src = photo1Url;

  const photo2 = document.getElementById('photo-2');
  if (photo2) photo2.src = photo2Url;

  updateMapsLink(venueAddress);

  eventDetails.title = `Cumpleaños de ${childName}`;
  eventDetails.location = venueAddress;
  eventDetails.description = `¡Estás invitado al cumpleaños de ${childName}! Celebraremos con temática de fútbol del equipo ${teamName}.`;
}

function initApp() {
  updateContent(defaultConfig);

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => updateContent(config),
      mapToCapabilities: () => ({
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      }),
      mapToEditPanelValues: (config) => new Map([
        ['child_name', config.child_name || defaultConfig.child_name],
        ['child_age', config.child_age || defaultConfig.child_age],
        ['event_date', config.event_date || defaultConfig.event_date],
        ['event_time', config.event_time || defaultConfig.event_time],
        ['venue_name', config.venue_name || defaultConfig.venue_name],
        ['venue_address', config.venue_address || defaultConfig.venue_address],
        ['team_name', config.team_name || defaultConfig.team_name],
        ['photo_1_url', config.photo_1_url || defaultConfig.photo_1_url],
        ['photo_2_url', config.photo_2_url || defaultConfig.photo_2_url]
      ])
    });
  }
}

document.addEventListener('DOMContentLoaded', initApp);
