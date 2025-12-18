// Karte initialisieren
const map = L.map("map").setView([51, 10], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let guessMarker;
let currentLocation;
let allLocations = [];
let usedLocations = [];

// Klick auf die Karte
map.on("click", function (e) {
  if (!currentLocation) return;

  if (guessMarker) map.removeLayer(guessMarker);
  guessMarker = L.marker(e.latlng).addTo(map);

  evaluateGuess(e.latlng.lat, e.latlng.lng);
});

// Distanzberechnung
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Bewertung
function evaluateGuess(guessLat, guessLng) {
  const distance = getDistanceKm(
    guessLat,
    guessLng,
    currentLocation.lat,
    currentLocation.lng
  );

  const resultEl = document.getElementById("result");
  const THRESHOLD = 50;

  if (distance < THRESHOLD) {
    resultEl.innerHTML = `Gut! (${distance.toFixed(1)} km entfernt)<br><button onclick="nextLocation()" style="margin-top: 10px;">Nächster Ort</button>`;
    resultEl.style.backgroundColor = "rgba(76, 175, 80, 0.8)";
  } else {
    resultEl.innerHTML = `Schlecht (${distance.toFixed(1)} km entfernt)<br><button onclick="nextLocation()" style="margin-top: 10px;">Nächster Ort</button>`;
    resultEl.style.backgroundColor = "rgba(244, 67, 54, 0.8)";
  }
}

// Nächsten Ort laden
function nextLocation() {
  // Wenn alle Orte verwendet wurden, von vorne beginnen
  if (usedLocations.length === allLocations.length) {
    usedLocations = [];
    alert("Alle Orte durchgespielt! Das Spiel beginnt von vorne.");
  }

  // Verfügbare Orte (noch nicht verwendet)
  const availableLocations = allLocations.filter(
    loc => !usedLocations.includes(loc.id)
  );

  // Zufälligen Ort auswählen
  currentLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
  usedLocations.push(currentLocation.id);

  console.log("Neuer Ort:", currentLocation);

  // Bild setzen
  const imgElement = document.getElementById("locationImage");
  imgElement.src = currentLocation.image;

  // Marker entfernen
  if (guessMarker) {
    map.removeLayer(guessMarker);
    guessMarker = null;
  }

  // Ergebnis zurücksetzen
  const resultEl = document.getElementById("result");
  resultEl.textContent = "";
  resultEl.style.backgroundColor = "rgba(0, 0, 0, 0.3)";

  // Fehlerbehandlung für Bilder
  imgElement.onerror = function() {
    console.error("Bild konnte nicht geladen werden:", currentLocation.image);
    imgElement.alt = "⚠️ Bild konnte nicht geladen werden: " + currentLocation.name;
    imgElement.style.border = "3px solid red";
  };

  imgElement.onload = function() {
    console.log("Bild erfolgreich geladen:", currentLocation.image);
  };
}

// JSON laden & erstes Bild setzen
console.log("Lade locations.json...");

fetch("data/locations.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Locations geladen:", data);
    allLocations = data;
    
    // Ersten Ort laden
    nextLocation();
  })
  .catch(err => {
    console.error("Fehler beim Laden der Locations:", err);
    alert("Fehler: " + err.message);
  });