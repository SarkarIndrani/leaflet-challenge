// Store our API endpoint as url.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get earthquakes data
d3.json(url).then((data)=> {
  // Create features with the earthquakes data
  createFeatures(data.features)
});

// Get marker color based on earthquake depth
function getColor(depth) {   
  let color= ""; 
  if (depth > 90){
    color = "#B22222";
  }else if (depth > 70){
    color = "#CD5C5C";
  }else if (depth > 50){
    color = "#F08080";
  }else if(depth > 30){
    color = "#DAA520";
  }else if (depth > 10){
    color = "#FFD700";
  }else{
    color = "#7FFF00";
  }
  return color;
}


// Declare function to create map features.
function createFeatures(earthquakeData) {
  // Create popup layers using earthquake place,time,type,depth and magnitude
  function onEachFeature(feature, layer) {
      layer.bindPopup(
          "<h3> Where: " + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) +
          "<p>Type: " + feature.properties.type + "</p>" +
          "<p>Depth: " + feature.geometry.coordinates[2] + "</p>" +
          "<p>Magnitude: " + feature.properties.mag + "</p>");
  }


//Create circle markers for each earthquake in the data set.
let earthquakes = L.geoJSON(earthquakeData, {  
  pointToLayer: function(feature, latlng) {
    // Make circle radius dependent on the magnitude and get color based on the same feature
      return new L.CircleMarker(latlng, {          
          radius:feature.properties.mag*3,
          fillOpacity: 1,
          color: getColor(feature.geometry.coordinates[2])

        })
    },
  // Append popups on each feature
  onEachFeature: onEachFeature
});

// Call create map function using the earthquakes data
  createMap(earthquakes);

};


// Declare function to create map
function createMap(earthquakes) {
  // Get initial light layer
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',    
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
     });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
        37.05, -95.75
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

  // Create a layer control.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Add legend
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];    
    
  for (let i =0; i < depth.length; i++) {
    div.innerHTML += 
    '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
    return div;
  };
  legend.addTo(myMap);

};














