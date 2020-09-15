function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 30,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      // "Lights Map": lightmap
    };
  
    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [37.0902405,-95.7128906],
      zoom: 4,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false,
      position: 'bottomright'
    }).addTo(map);

    var legend = L.control({ position: 'bottomright' });

    // function markerLegend(magnitude) {
    //   switch(true){
    //     case (magnitude<1):
    //         return "green";
    //     case (magnitude<2):
    //         return "greenyellow";
    //     case (magnitude<3):
    //         return "yellow";
    //     case (magnitude<4):
    //         return "orange";
    //     case (magnitude<5):
    //         return "darkorange";
    //     default:
    //         return "red";
    // };

   
  }
  
  // Adjust the marker size in relation to the madnitude of the earthquake
  function markerSize(magnitude) {
    return magnitude * 5;
  }
  
  // Adjust the marker color in relation to the madnitude of the earthquake
  function markerColor(magnitude) {
    switch(true){
      case (magnitude<1):
          return "green";
      case (magnitude<2):
          return "greenyellow";
      case (magnitude<3):
          return "yellow";
      case (magnitude<4):
          return "orange";
      case (magnitude<5):
          return "darkorange";
      default:
          return "red";
  };
}

  function createMarkers(response) {
  
    // Pull the "features" property off of response.data
    var features = response.features;
  
    // Initialize an array to hold quake markers
    var quakeMarkers = [];
  
    // Loop through the features array
    for (var index = 0; index < features.length; index++) {
      var feature = features[index];
  
      // For each quake, create a marker and bind a popup with the quake's name
      var quakeMarker =  L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          // radius: feature.properties.mag*5,
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6,
        })
        .bindPopup("<h3>" + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "</h3>");
  
      // Add the marker to the bikeMarkers array
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson", createMarkers);
  // d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);