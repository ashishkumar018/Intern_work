
    const map = new ol.Map({ 
      target: "map",
     });

    map.setView(
      new ol.View({

        center: ol.proj.fromLonLat([151.2093, -33.8688]), // Sydney

        zoom: 13
      })
    );

    const apiKey = "AAPK3a37802444344ed78769742241948e05Dt4L7mo5F3BVFp9tq-konaORvt1WiM6LkUndhfDT1ExU1N3tXNpyyBnOKIPEYmdO";

    const basemapId = "ArcGIS:Navigation";

    const basemapURL = "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/" + basemapId + "?type=style&token=" + apiKey;

    olms(map, basemapURL);

    const popup = new Popup();
    map.addOverlay(popup);

    document.getElementById("geocode-button").addEventListener("click", () => {

      const query = document.getElementById("geocode-input").value;

      const authentication = arcgisRest.ApiKeyManager.fromKey(apiKey);

      const center = ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326");

      arcgisRest
        .geocode({
          singleLine: query,
          authentication,

          params: {
            outFields: "*",
            location: center.join(","),
            outSR: 3857 // Request coordinates in Web Mercator to simplify displaying
          }
        })

        .then((response) => {
          const result = response.candidates[0];
          if (!result === 0) {
            alert("That query didn't match any geocoding results.");
            return;
          }

          const coords = [result.location.x, result.location.y];

          popup.show(coords, result.attributes.LongLabel);
          map.getView().setCenter(coords);

        })

        .catch((error) => {
          alert("There was a problem using the geocoder. See the console for details.");
          console.error(error);
        });

    });