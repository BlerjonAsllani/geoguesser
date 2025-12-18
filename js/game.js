const map = L.map("map").setView([51, 10], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let guessMarker;

map.on("click", function (e) {
  if (guessMarker) map.removeLayer(guessMarker);
  guessMarker = L.marker(e.latlng).addTo(map);

  evaluateGuess(e.latlng.lat, e.latlng.lng);
});

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

const location = {
  lat: 48.8584,
  lng: 2.2945
};

function evaluateGuess(guessLat, guessLng) {
  const distance = getDistanceKm(
    guessLat,
    guessLng,
    location.lat,
    location.lng
  );

  const resultEl = document.getElementById("result");
  const THRESHOLD = 50;

  if (distance < THRESHOLD) {
    resultEl.textContent = `Gut! (${distance.toFixed(1)} km entfernt)`;
  } else {
    resultEl.textContent = `Schlecht (${distance.toFixed(1)} km entfernt)`;
  }
}

let currentLocation;

fetch("data/locations.json")
  .then(response => response.json())
  .then(data => {
    // zufällige Location auswählen
    currentLocation = data[Math.floor(Math.random() * data.length)];

    // Bild setzen
    document.getElementById("locationImage").src = currentLocation.image;
  });

  function evaluateGuess(guessLat, guessLng) {
  if (!currentLocation) return;

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