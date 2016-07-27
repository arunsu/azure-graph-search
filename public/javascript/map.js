var scenario1 = [
  {city:"Beijing","country":"China","latitude":"39.90421","longitude":"116.40739","nodeids":["180f2c9d-d9c4-4559-b636-740b8afd4561","0c8e6bec-6bbe-4a55-82c7-350a5644e0ab","0b1c9a8a-e840-44a2-89f0-12ef07c96d6a"],"clusters":["BJBPrdApp12"]},
  {"city":"Shanghai","country":"China","latitude":"31.23042","longitude":"121.47370","nodeids":["1a9ef7bb-88d8-4df4-b6d5-dd1d5bca7f1c","6c308adf-1b83-4c9c-81e2-29feead989cc","1102ecb0-8796-41f0-8369-953058fd75cd","5810b3dd-d3be-4df8-ac42-cf94202aedde","6749b34e-f5f5-458b-a0b8-8f18d9dfdecd","3f5e1183-51cb-4f22-b3c3-4996b24c89e4"],"clusters":["SH3PrdApp04","SH3PrdApp03"]},
  {"city":"Iowa","country":"United States","latitude":"41.87800","longitude":"-93.09770","nodeids":["1b2c5bc2-3819-4358-8edd-8432768b3a1c"],"clusters":["DM2AzFApp03"]}];

var scenario2 = [
  {"city":"United States","country":"","latitude":"38.90619","longitude":"-77.01727","nodeids":null,"clusters":null},
  {"city":"United Kingdom","country":"","latitude":"51.51786","longitude":"-0.102216","nodeids":null,"clusters":null},
  {"city":"APAC","country":"","latitude":"1.98435","longitude":"32.53391","nodeids":null,"clusters":null},
  {"city":"India","country":"","latitude":"23.40601","longitude":"79.45809","nodeids":null,"clusters":null},
  {"city":"Japan","country":"","latitude":"36.28165","longitude":"139.0773","nodeids":null,"clusters":null},
  {"city":"Canada","country":"","latitude":"58.02716","longitude":"-105.3809","nodeids":null,"clusters":null},
  {"city":"Brazil","country":"","latitude":"-10.81045","longitude":"-52.97312","nodeids":null,"clusters":null},
  {"city":"Greater China","country":"","latitude":"36.55309","longitude":"103.9754","nodeids":null,"clusters":null},
  {"city":"Germany","country":"","latitude":"51.20247","longitude":"10.3822","nodeids":null,"clusters":null},
  {"city":"Netherlands","country":"","latitude":"52.34226","longitude":"5.528157","nodeids":null,"clusters":null}
];

$(function() {
  $("#scenarioName").change(function() {
    var name = $('option:selected', this).text();
    dataLayer.clear();
    infobox.setOptions({ visible: false });
    if (name == "Top 10 Machines ranking based on VM's"){
      addPins(scenario1);
    } else{
      addPins(scenario2);
    }
  });

  // Load the map.
  var map = new Microsoft.Maps.Map(document.getElementById('mapDiv'), {
    credentials: 'ApNE1F_yn1VrC1dEe_qvkkepWbHjSJ3wk4OYezRQKIKrRx6aWoL3yMx8dc9sHmTZ',
    center: new Microsoft.Maps.Location(39.90421, 116.40739),
    zoom: 5,
    showScalebar: true
  });

  // Create a layer to load pushpins to.
  var dataLayer = new Microsoft.Maps.EntityCollection();
  map.entities.push(dataLayer);

  // Add a layer for the infobox.
  var infoboxLayer = new Microsoft.Maps.EntityCollection();
  map.entities.push(infoboxLayer);

  // Create a global infobox control.
  var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), {
      visible: false,
      offset: new Microsoft.Maps.Point(0, 20),
      height: 200,
      width: 320
  });
  infoboxLayer.push(infobox);
  addPins(scenario1);

  function addPins(results){
    if (results.length > 0) {
      // Create an array to store the coordinates of all the location results.
      var locs = [];

      // Create an array to store the HTML used to generate the list of results.
      // By using an array to concatenate strings is much more efficient than using +.
      var listItems = [];

      //Loop through results and add to map
      for (var i = 0; i < results.length; i++) {
        var loc = new Microsoft.Maps.Location(results[i].latitude, results[i].longitude);

        // Create pushpin
        var pin = new Microsoft.Maps.Pushpin(loc, {
            text: (i + 1) + ''
        });

        // Store the location result info as a property of the pushpin so we can use it later.
        pin.Metadata = results[i];

        // Add a click event to the pushpin to display an infobox.
        Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
            displayInfobox(e.target);
        });

        // Add the pushpin to the map.
        dataLayer.push(pin);

        // Add the location coordinate to the array of locations
        locs.push(loc);
      }

      // Use the array of locations from the results to set the map view to show all locations.
      if (locs.length > 1) {
          map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations(locs), padding: 80 });
      } else {
          map.setView({ center: locs[0], zoom: 15 });
      }

      // Add a click event to the title of each list item.
      $('.title').click(function () {
          // Get the ID of the selected location
          var id = $(this).attr('rel');

          //Loop through all the pins in the data layer and find the pushpin for the location.
          var pin;
          for (var i = 0; i < dataLayer.getLength() ; i++) {
              pin = dataLayer.get(i);

              if (pin.Metadata.ID != id) {
                  pin = null;
              } else {
                  break;
              }
          }

          // If a pin is found with a matching ID, then center the map on it and show it's infobox.
          if (pin) {
              // Offset the centering to account for the infobox.
              map.setView({ center: pin.getLocation(), centerOffset: new Microsoft.Maps.Point(-70, 150), zoom: 17 });
              displayInfobox(pin);
          }
      });
    }
  }

  function displayInfobox(pin) {
      infobox.setLocation(pin.getLocation());

      var desc = ['<table>'];

      if (pin.Metadata.nodeids){
        desc.push('<tr><td><b>Nodes:</b></td></tr>');
        for (var i = 0; i < pin.Metadata.nodeids.length ; i++) {
            desc.push('<tr><td>', pin.Metadata.nodeids[i], '</td></tr>');
          }
      }
      if (pin.Metadata.clusters){
        desc.push('<tr><td><b>Clusters:</b></td></tr>');
        for (var i = 0; i < pin.Metadata.clusters.length ; i++) {
            desc.push('<tr><td>', pin.Metadata.clusters[i], '</td></tr>');
          }
      }

      desc.push('</table>');

      infobox.setOptions({ visible: true, title: pin.Metadata.city+', '+pin.Metadata.country, description: desc.join('') });
  }
});
