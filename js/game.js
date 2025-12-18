// Karte initialisieren
const map = L.map("map").setView([51, 10], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let guessMarker;
let currentLocation;

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
    resultEl.textContent = `Gut! (${distance.toFixed(1)} km entfernt)`;
  } else {
    resultEl.textContent = `Schlecht (${distance.toFixed(1)} km entfernt)`;
  }
}

// JSON laden & Bild setzen
fetch("data/locations.json")
  .then(response => response.json())
  .then(data => {
    currentLocation = data[Math.floor(Math.random() * data.length)];
    console.log("Aktuelle Location:", currentLocation);

    document.getElementById("locationImage").src = currentLocation.image;
  })
  .catch(err => console.error("Fehler beim Laden der Locations:", err));