// Initialize a Leaflet map
const map = L.map('map').setView([31.5, 35.172], 8); // Set the initial view

// Add a tile layer (you can replace the URL with your preferred tile source)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);

// Function to add a marker to the map
function addMarker(lat, lng, title) {
  L.marker([lat, lng]).addTo(markerLayer)
    .bindPopup(title);
    // .openPopup();
}

function addPolygon(coordinates) {
    const geoJson = {
        type: 'Feature',
        properties: {
          name: 'My Polygon',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      };
    L.geoJSON(geoJson).addTo(markerLayer);
}

function clearAllMarkers() {
    markerLayer.clearLayers();
}