	mapboxgl.accessToken =maptoken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        style:"mapbox://styles/mapbox/outdoors-v12",
        zoom: 12 // starting zoom
    });
    console.log(listing.geometry.coordinates);
    const marker=new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl
        .Popup({offset:15})
        .setHTML(`<h4>${listing.location} , ${listing.country}</h4>
                    <h5>Exact Location of listing</h5>`))
    .addTo(map);