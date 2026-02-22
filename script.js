// Default configuration
const defaultConfig = {
  child_name: 'Elián',
  child_age: '',
  event_date: '28 de Febrero, 2026',
  event_time: '11:00 AM - Final del día',
  venue_name: 'Cancha de Fútbol',
  venue_address: 'Camino Padre Hurtado 8174, Buin',
  team_name: 'Club Universidad de Chile',
  photo_1_url: '',
  photo_2_url: '',
  background_url: ''
};

// Event details for calendar - February 28, 2026
let eventDetails = {
  title: `Cumpleaños de ${defaultConfig.child_name}`,
  date: '2026-02-28',
  time: '11:00',
  duration: 600,
  location: `${defaultConfig.venue_name}, ${defaultConfig.venue_address}`,
  description: `¡Estás invitado al cumpleaños de ${defaultConfig.child_name}! Celebraremos con temática de fútbol del equipo ${defaultConfig.team_name}.`
};

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Add to Google Calendar (Android)
function addToGoogleCalendar() {
  // February 28, 2026 from 11:00 AM to 9:00 PM
  const startDate = '20260228T110000';
  const endDate = '20260228T210000';
  
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
  
  window.open(url, '_blank', 'noopener,noreferrer');
  showToast('¡Abriendo Google Calendar!', 'info');
}

// Download ICS file (iPhone)
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

// Update Google Maps link
function updateMapsLink(address) {
  const mapsLink = document.getElementById('maps-link');
  if (mapsLink) {
    mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
}

// Update background image
function updateBackgroundImage(url) {
  const backgroundContainer = document.getElementById('app-wrapper');
  if (backgroundContainer && url) {
    backgroundContainer.style.backgroundImage = `url('${url}')`;
    backgroundContainer.style.backgroundSize = 'cover';
    backgroundContainer.style.backgroundPosition = 'center';
    backgroundContainer.style.backgroundAttachment = 'fixed';
  }
}

// Handle photo upload
function handlePhotoUpload(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  if (input && preview) {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Handle drag and drop for photo upload
function setupDragAndDrop(zoneId, inputId, previewId) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  if (!zone || !input) return;
  
  zone.addEventListener('click', () => input.click());
  
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (preview) {
          preview.src = e.target.result;
          preview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// Update all content from config
function updateContent(config) {
  const childName = config.child_name || defaultConfig.child_name;
  const childAge = config.child_age || defaultConfig.child_age;
  const eventDate = config.event_date || defaultConfig.event_date;
  const eventTime = config.event_time || defaultConfig.event_time;
  const venueName = config.venue_name || defaultConfig.venue_name;
  const venueAddress = config.venue_address || defaultConfig.venue_address;
  const teamName = config.team_name || defaultConfig.team_name;
  const photo1Url = config.photo_1_url || defaultConfig.photo_1_url;
  const photo2Url = config.photo_2_url || defaultConfig.photo_2_url;
  const backgroundUrl = config.background_url || defaultConfig.background_url;

  // Update text content
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
  
  // Update photos
  const photo1 = document.getElementById('photo-1');
  if (photo1 && photo1Url) photo1.src = photo1Url;
  
  const photo2 = document.getElementById('photo-2');
  if (photo2 && photo2Url) photo2.src = photo2Url;

  // Update maps link
  updateMapsLink(`${venueName}, ${venueAddress}`);

  // Update background
  if (backgroundUrl) {
    updateBackgroundImage(backgroundUrl);
  }

  // Update event details for calendar
  eventDetails.title = `Cumpleaños de ${childName}`;
  eventDetails.location = `${venueName}, ${venueAddress}`;
  eventDetails.description = `¡Estás invitado al cumpleaños de ${childName}! Celebraremos con temática de fútbol del equipo ${teamName}.`;
}

// Initialize the application
function initApp() {
  // Set up photo upload handlers
  handlePhotoUpload('photo-1-upload', 'photo-1');
  handlePhotoUpload('photo-2-upload', 'photo-2');
  
  // Set up drag and drop
  setupDragAndDrop('photo-upload-zone-1', 'photo-1-upload', 'photo-1');
  setupDragAndDrop('photo-upload-zone-2', 'photo-2-upload', 'photo-2');
  
  // Handle background upload
  handlePhotoUpload('background-upload', null);
  
  const backgroundInput = document.getElementById('background-upload');
  if (backgroundInput) {
    backgroundInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          updateBackgroundImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // Initialize with default content
  updateContent(defaultConfig);
  
  // Set up Element SDK if available
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        updateContent(config);
      },
      mapToCapabilities: (config) => ({
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
        ['photo_2_url', config.photo_2_url || defaultConfig.photo_2_url],
        ['background_url', config.background_url || defaultConfig.background_url]
      ])
    });
  }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
