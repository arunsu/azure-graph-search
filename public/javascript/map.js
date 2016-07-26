$(function() {
    $("#scenarioName").change(function() {
        config = getConfig($('option:selected', this).text());
        //alchemy = new Alchemy(config);
    });

    // Load the map.
    var map = new Microsoft.Maps.Map(document.getElementById('mapDiv'), {
        credentials: 'ApNE1F_yn1VrC1dEe_qvkkepWbHjSJ3wk4OYezRQKIKrRx6aWoL3yMx8dc9sHmTZ',
        center: new Microsoft.Maps.Location(-33.9, 151.2),
        zoom: 3,
        showScalebar: true
    });

    // Create a layer to load pushpins to.
    var dataLayer = new Microsoft.Maps.EntityCollection();
    map.entities.push(dataLayer);
});
