// import Map from 'ol/Map';
// import TileLayer from 'ol/layer/Tile';
// import View from 'ol/View';
// import XYZ from 'ol/source/XYZ';
// import {FullScreen, defaults as defaultControls} from 'ol/control';

// const view = new View({
//   center: [-9101767, 2822912],
//   zoom: 14,
// });

// const key = 'FBwl0cAS7xN1ML7lcqpR';
// const attributions =
//   '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
//   '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

// const map = new Map({
//   controls: defaultControls().extend([new FullScreen()]),
//   layers: [
//     new TileLayer({
//       source: new XYZ({
//         attributions: attributions,
//         url:
//           // 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
//           'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=' + key,
//         maxZoom: 20,
//       }),
//     }),
//   ],
//   target: 'map',
//   view: view,
// });

import KML from 'ol/format/KML';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {FullScreen, defaults as defaultControls} from 'ol/control';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

const key = 'FBwl0cAS7xN1ML7lcqpR';
const attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const raster = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20,
  }),
});

const vector = new VectorLayer({
  source: new VectorSource({
    url: 'data/kml/2012-02-10.kml',
    format: new KML(),
  }),
});

const map = new Map({
  controls: defaultControls().extend([new FullScreen()]),
  layers: [raster, vector],
  target: document.getElementById('map'),
  view: new View({
    center: [876970.8463461736, 5859807.853963373],
    projection: 'EPSG:3857',
    zoom: 10,
  }),
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
      info.push(features[i].get('name'));
    }
    document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
    map.getTarget().style.cursor = 'pointer';
  } else {
    document.getElementById('info').innerHTML = '&nbsp;';
    map.getTarget().style.cursor = '';
  }
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});




