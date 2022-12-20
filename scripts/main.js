import KML from "ol/format/KML";
import Map from "ol/Map";
// import VectorSource from 'ol/source/Vector';
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import { FullScreen, defaults as defaultControls } from "ol/control";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Draw, Modify, Snap } from "ol/interaction";
import { OSM, Vector as VectorSource } from "ol/source";
// import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { get } from "ol/proj";
import { Circle, LineString, Point } from "ol/geom";



// API key for from maptiler website

const key = "FBwl0cAS7xN1ML7lcqpR";
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';


// when you click on any point coordinate will appear in a div and there in onr cross mark
// Elements that make up the popup.

const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

// Create an overlay to anchor the popup to the map.
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

// * Add a click handler to hide the popup.
// * @return {boolean} Don't follow the href.
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

const raster = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    // url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    url: "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=" + key,
    maxZoom: 20,
  }),
});

const source = new VectorSource();


// this style is added to draw

const vector = new VectorLayer({
  source: source,
  style: {
    "fill-color": "rgba(255, 255, 255, 0.2)",
    "stroke-color": "#ffcc33",
    "stroke-width": 2,
    "circle-radius": 7,
    "circle-fill-color": "#ffcc33",
  },
});

// Limit multi-world panning to one world east and west of the real world.
// Geometry coordinates have to be within that range.
const extent = get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];


const map = new Map({
  controls: defaultControls().extend([new FullScreen()]),
  layers: [raster, vector],
  overlays: [overlay],
  target: document.getElementById("map"),
  view: new View({
    center: [876970.8463461736, 5859807.853963373],
    projection: "EPSG:3857",
    zoom: 10,
  }),
});
// this for dwaw lines and other
const modify = new Modify({source: source});
map.addInteraction(modify);

let draw, snap; // global so we can remove them later
const typeSelect = document.getElementById('type');

// In this function we are setting type of draw line
function addInteractions() {
  draw = new Draw({
    source: source,
    type: typeSelect.value,
  });
  map.addInteraction(draw);
  snap = new Snap({source: source});
  map.addInteraction(snap);
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
};

addInteractions();
// Add a click handler to the map to render the popup.
map.on("singleclick", function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));

    // confirm("Press a button!");
  
  // alert(hdms);

  content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";


  
  overlay.setPosition(coordinate);

  let text = "Do you want to save this point" + hdms;
  if (confirm(text) == true) {
    var atype = "point clicked";
    const typeSelected = document.getElementById('type').value;
    // alert(typeSelected);
    if(typeSelected== "LineString"){
      atype="line selected";
    }

    if(typeSelected== "Polygon"){
      atype= "polygen selected";
    }
    if(typeSelected== "Circle"){
      atype= "circle selected";
    }
    
    // var atype = "point clicked";
    var new_data = hdms;
    if(localStorage.getItem(atype)==null){
      localStorage.setItem(atype,'[]');
    }

    var old_data= JSON.parse(localStorage.getItem(atype));
    old_data.push(new_data);
    localStorage.setItem(atype, JSON.stringify(old_data));


    content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";


  
    overlay.setPosition(coordinate);

  }

  else{
    content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
    overlay.setPosition(coordinate);
  }
});

const displayFeatureInfo = function (pixel) {
  const features = [];
  map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    const info = [];
    let i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      info.push(features[i].get("name"));
    }
    document.getElementById("info").innerHTML = info.join(", ") || "(unknown)";
    map.getTarget().style.cursor = "pointer";
  } else {
    document.getElementById("info").innerHTML = "&nbsp;";
    map.getTarget().style.cursor = "";
  }
};

map.on("pointermove", function (evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on("click", function (evt) {
  displayFeatureInfo(evt.pixel);
});
