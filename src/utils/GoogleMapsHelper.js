/**
 * @file: GoogleMapsHelper.js
 * This is a helper file to organize the google maps
 * functions to add to the markers and the infowindow.
 */
export const initMap = (app) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - initMap: wrong argument passed. Please pass App component as an argument.');

	let map = new window.google.maps.Map(document.getElementById('map'), {
	  zoom: app.state.zoom,
	  maptype: app.state.maptype,
	  center: { lat: 54.978252, lng: -1.617780 },
	  // Hide the default google maps icons to prevent info window bug by opening
	  // an info window from the default locations. https://stackoverflow.com/questions/23390149/gmaps-api-remove-default-poi
	  styles: [
	    {
	      featureType: 'poi',
	      elementType: 'labels',
	      stylers: [{ visibility: 'off' }]
	    },
	    {
	      featureType: 'transit',
	      elementType: 'labels',
	      stylers: [{ visibility: 'off'}]
	    }
	  ]
	});

	// Create an info window google object to handle locations details.
	let infoWindow = new window.google.maps.InfoWindow();

	app.setState({ map, infoWindow });
};

export const initMarkers = (app, locations) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - initMarkers: wrong argument passed. Please pass App component as an argument.');

  const { google } = window;
  const { map, infoWindow } = app.state;
  // Store markers in an array.
  let markers = [];
  const bounds = new google.maps.LatLngBounds();

  // Create the marker's highlighted icon and the default icon.
  const highlightedIcon = createMarkerIcon('ee9999');
  const defaultIcon = createMarkerIcon('0091ff');

  // Loop through locations to add them to the map.
  locations.forEach( location => {
    let position = {
      lat: location.location.lat,
      lng: location.location.lng
    };
    // Create the marker.
    let marker = new google.maps.Marker({
      title: location.name,
      map,
      position,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: location.id
    });

    // Push marker to the array and extend the bounds.
    markers.push(marker);
    bounds.extend(marker.position);

    // Add on click listener.
    marker.addListener('click', () => app.handleMarkerOnClick(marker));

    // Add on mouseover and mouseout listeners to change markers icons.
    marker.addListener('mouseover', () => app.updateMarkerIcon(marker, highlightedIcon));
    marker.addListener('mouseout', () => app.updateMarkerIcon(marker, defaultIcon));
  });

  // Fit the markers bounds to the map.
  map.fitBounds(bounds);

  infoWindow.addListener('closeclick', () => handleInfoWindowClosing(app));

  app.setState({ map, markers, markerIcons: { default: defaultIcon, highlighted: highlightedIcon }});
};

const createMarkerIcon = (markerColor) => {
  return new window.google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new window.google.maps.Size(25, 40),
    new window.google.maps.Point(0, 0),
    new window.google.maps.Point(10, 34),
    new window.google.maps.Size(25, 40)
  );
};

export const handleMarkerOnClick = (app, marker) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - handleMarkerOnClick: wrong argument passed. Please pass App component as an argument.');

  const { map, infoWindow } = app.state;
  // Check to make sure InfoWindow is not opened with this marker.
  if ( infoWindow.marker !== marker ) {
    app.setState(state => ({
      markers: state.markers.map(m => {
        if (m === marker) {
          // Add an animation to the marker.
          m.setAnimation(null);
          m.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => m.setAnimation(null), 1000); // Stop animation after 1second.
        }
        return m;
      })
    }));

    // Center the map and zoom in when infowindow opens.
    let center = { lat: marker.position.lat() + 0.005, lng: marker.position.lng() };
    map.setCenter(center);
    map.setZoom(15);

    infoWindow.marker = marker;
    infoWindowContent(app, marker);
    infoWindow.open(map, marker);
    app.setState({ map, infoWindow });
  }
};

const infoWindowContent = (app, marker) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - infoWindowContent: wrong argument passed. Please pass App component as an argument.');

	const { infoWindow, locationsData } = app.state;

  let locationInfo = locationsData.filter( location => location.id === marker.id)[0]; // Get the location info based on the marker id.
	const { name, location, bestPhoto, canonicalUrl, categories } = locationInfo;

	infoWindow.setContent(`
		<div class="infoWindow" role="dialog" aria-label="${name} informations">
			<h3 tabindex="-1" class="infoWindow_header">${name}</h3>
			${location.formattedAddress ? (
				`<div tabindex="-1" class="infoWindow_location" aria-label="Adress: ${location.formattedAddress.join(', ')}">${location.formattedAddress.join(', ')}</div>`
			) : ''}
			<div tabindex="-1" class="infoWindow_category" aria-label="Location type: ${categories[0].name}">${categories[0].name}</div>
			${bestPhoto ? (
				`<div class="infoWindow_img_container">
					<img class="infoWindow_img" src="${bestPhoto.prefix}${bestPhoto.width}x${bestPhoto.height}${bestPhoto.suffix}" alt="A picture of ${name}"/>
				</div>`
			) : ''}
			<a tabindex="-1" class="infoWindow_link" href="${canonicalUrl}" target="_blank">Visit Forsquare site</a>
			<button tabindex="-1" class="infoWindow_close_btn" aria-label="Close dialog">Close</button>
		</div>
	`);
};

export const filterShowingMarkers = (app, query) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - filterShowingMarkers: wrong argument passed. Please pass App component as an argument.');

	const { map, markers, infoWindow } = app.state;
	// Check if there is a query.
	if (query) {
		// Check if the current opened marker infoWindow is not included in the query and close it.
		markers.filter(marker => !marker.title.toLowerCase().includes( query.toLowerCase() ))
			.filter(m => infoWindow.marker === m).map(mr => handleInfoWindowClosing(app));

		app.setState(state => ({
			markers: state.markers.map(m => {
				// If markers title match the query and they are not displayed on the map, display them.
				if ( m.title.toLowerCase().includes( query.toLowerCase() ) ) {
					if (m.map === null) {
						m.setAnimation(null);
						m.setAnimation(window.google.maps.Animation.DROP); // Add some animation to make markers more visible.
						m.setMap(map);
					}
				} else {
					m.setMap(null);
				}
				return m;
			})
		}));
	} else {
		app.setState(state => ({
			markers: state.markers.map(m => {
				if (m.map === null) {
					m.setAnimation(null);
					m.setAnimation(window.google.maps.Animation.DROP); // Add some animation to make markers more visible.
					m.setMap(map);
				}
				return m;
			})
		}));
	}
};

export const handleInfoWindowClosing = (app) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - handleInfoWindowClosing: wrong argument passed. Please pass App component as an argument.');

	const { infoWindow, markers, map } = app.state;
	// Close the info window and empty the previous marker.
	infoWindow.close();
	infoWindow.marker = null;

	// Set the maps bounds and zoom out from the previous marker position.
	const bounds = new window.google.maps.LatLngBounds();
	markers.filter( marker => marker.map !== null ).map( m => bounds.extend(m.position));
	map.fitBounds(bounds);
	map.setZoom(14);
	app.setState({ infoWindow, map });
};
