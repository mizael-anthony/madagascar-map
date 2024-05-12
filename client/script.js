import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free';  
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';   


const madagascar = [-18.917, 46.802]
const zoom = 13
const map = L.map('map').setView(madagascar, zoom)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// add Leaflet-Geoman controls with some options to the map  
map.pm.addControls({  
  position: 'topleft',  
  drawCircle: false,  
});  
