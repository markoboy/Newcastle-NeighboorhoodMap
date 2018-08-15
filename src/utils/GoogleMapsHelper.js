/**
 * @file: GoogleMapsHelper.js
 * This is a helper file to organize the google maps
 * functions to add to the markers and the infowindow.
 */
import * as Locations from './Locations';

/* From: https://www.simoahava.com/gtm-tips/add-load-listener-script-elements/ */
export const loadGoogleMaps = (app) => {
	let el = document.createElement('script');
	el.src = 'https://maps.googleapis.com/api/js?key=AIzaSyAnxs1wPyU-Aq5dvX-i98Noi2twhFDJOrE&v=3';
	el.async = true;

	el.addEventListener('load', function() {
		initMap(app);
		initMarkers(app);
	});

	el.addEventListener('error', function(e) {
		app.handleError(e.target.src, 'Google maps failed to load. Please check your connection.');
		Locations.getLocations().then(locations => app.setState({ locations }));
	});

	document.head.appendChild(el);
};

export const initMap = (app) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - initMap: wrong argument passed. Please pass App component as an argument.');

	let map = new window.google.maps.Map(document.getElementById('map'), {
	  zoom: app.state.zoom,
	  maptype: app.state.maptype,
	  center: { lat: 54.978252, lng: -1.617780 }
	});

	// Create an info window google object to handle locations details.
	let infoWindow = new window.google.maps.InfoWindow();

	/* domready event runs when infoWindow opens. */
	infoWindow.addListener('domready', () => handleInfoWindowOpening(app));

	app.setState({ map, infoWindow });
};

// Async function from: https://www.twilio.com/blog/2015/10/asyncawait-the-hero-javascript-deserved.html
export const initMarkers = async (app) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - initMarkers: wrong argument passed. Please pass App component as an argument.');

  const { google } = window;
  const { map, infoWindow } = app.state;

  // Get the locations and the locationsData. Await for promise to end before proceeding with the function.
	let locations = await Locations.getLocations();
	let locationsData = await Locations.getLocationsData(locations);

  // Store markers in an array.
  let markers = [];
  const bounds = new google.maps.LatLngBounds();

  // Create the marker's highlighted icon and the default icon.
  const highlightedIcon = createMarkerIcon('ee9999');
  const defaultIcon = createMarkerIcon('0091ff');

  // Loop through locations to add them to the map.
  locations.forEach( location => {
    // If there was an error while fetching the locations, dont access this location and alert the user.
    if (location.errorType) return app.handleError(location.errorType, location.errorDetail);

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
    marker.addListener('click', () => app.handleMarkerOnClick(undefined, marker));

    // Add on mouseover and mouseout listeners to change markers icons.
    marker.addListener('mouseover', () => app.updateMarkerIcon(marker, highlightedIcon));
    marker.addListener('mouseout', () => app.updateMarkerIcon(marker, defaultIcon));
  });

  // Fit the markers bounds to the map.
  map.fitBounds(bounds);

  infoWindow.addListener('closeclick', () => handleInfoWindowClosing(app));

  app.setState({
		map,
		markers,
		markerIcons: { default: defaultIcon, highlighted: highlightedIcon },
		locations,
		locationsData
  });
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

export const handleMarkerOnClick = (app, event, marker) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - handleMarkerOnClick: wrong argument passed. Please pass App component as an argument.');

  const { map, infoWindow, locationsData } = app.state;
  // Set state with the new marker.
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

  let locationInfo = locationsData.filter( location => location.id === marker.id)[0]; // Get the location info based on the marker id.
  if (locationInfo) { // If locationInfo is fetched display it.
  	infoWindowContent(app, locationInfo);
	  infoWindow.open(map, marker);
  } else {
		// Else try to fetch the locationInfo from the Forsquare API.
	  Locations.getLocationInfo(marker.id).then(dataInfo => {
			if (dataInfo.errorType) { // If Forsquare API returned an error, inform the user.
				infoWindowContentError(app, marker);
				app.handleError(dataInfo.errorType, dataInfo.errorDetail);
			} else {
				// Else set the infoWindow content with the locationInfo and push the data to the state locationsData.
				infoWindowContent(app, dataInfo);
				infoWindow.open(map, marker);
				app.setState(state => ({ locationsData: state.locationsData.concat(dataInfo) }));
			}
		});
  }

  // Store the button that opened the infoWindow to set focus on close.
  event ? app.storeButtonClicked(event.target) : app.storeButtonClicked(null);

  app.setState({ map, infoWindow });
};

const infoWindowContent = (app, locationInfo) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - infoWindowContent: wrong argument passed. Please pass App component as an argument.');

	const { infoWindow } = app.state;

	const { name, location, bestPhoto, canonicalUrl, categories } = locationInfo;
	infoWindow.setContent(`
		<div class="infoWindow">
			<h3 tabindex="-1" class="infoWindow_header">${name}</h3>
			${location.formattedAddress ? (
				`<div tabindex="-1" class="infoWindow_location" aria-label="Adress: ${location.formattedAddress.join(', ')}">${location.formattedAddress.join(', ')}</div>`
			) : ''}
			${categories[0] ? (
				`<div tabindex="-1" class="infoWindow_category" aria-label="Location type: ${categories[0].name}">${categories[0].name}</div>`
			) : ''}
			${bestPhoto ? (
				`<div class="infoWindow_img_container">
					<img class="infoWindow_img" src="${bestPhoto.prefix}${bestPhoto.width}x${bestPhoto.height}${bestPhoto.suffix}" alt="A picture of ${name}"/>
				</div>`
			) : ''}
			<a tabindex="-1" class="infoWindow_link" href="${canonicalUrl}" target="_blank">Visit Forsquare site</a>
		</div>
	`);
};

const infoWindowContentError = (app, marker) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - infoWindowContentError: wrong argument passed. Please pass App component as an argument.');

	const { infoWindow } = app.state;

	infoWindow.setContent(`
		<div class="infoWindow">
			<h3 tabindex="-1" class="infoWindow_header">${marker.title}</h3>
			<div tabindex="-1" class="infoWindow_error">There are no information for this location at the moment.</div>
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

	const { infoWindow, markers, map, buttonClicked } = app.state;
	// Close the info window and empty the previous marker.
	infoWindow.close();
	infoWindow.marker = null;

	// Set the maps bounds and zoom out from the previous marker position.
	const bounds = new window.google.maps.LatLngBounds();
	markers.filter( marker => marker.map !== null ).map( m => bounds.extend(m.position));
	map.fitBounds(bounds);
	map.setZoom(14);

	// Set focus to the button that opened the infoWindow or to the map if it was opened from a marker.
	if (buttonClicked) {
		// Open sidebar in case it is in small screen.
		app.openSidebar();
		requestAnimationFrame(timestamp => buttonClicked.focus()); // Focus the button.
	} else {
		document.querySelector('#map').focus(); // Focus the map.
	}

	// Set button to null to prevent any bugs.
	app.setState({ infoWindow, map, buttonClicked: null });
};

/* Store the elements of the infoWindow when it opens in order to lock tab focus.*/
const handleInfoWindowOpening = (app) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - handleInfoWindowOpening: wrong argument passed. Please pass App component as an argument.');

	// Store the infoWindow node, its parent node(container), childNodes that will receive focus and the closeButton
	let infoWindowNode, parentNode, childNodes, closeButton;

	infoWindowNode = document.querySelector('.infoWindow');
	childNodes = Array.from(infoWindowNode.childNodes) // Create an array of infoWindow nodes in order to filter them.
		.filter(node => node.nodeType !== 3) // Filter out text nodes.
		.filter(node => node.attributes.hasOwnProperty('tabindex')); // Return only childNodes that have a tabindex attribute.

	parentNode = infoWindowNode.closest('div[style*="cursor: default"]');
	parentNode.setAttribute('role', 'dialog');
	parentNode.setAttribute('aria-label', 'InfoWindow');

	closeButton = document.querySelector('div[style*="width: 13px; height: 13px;"]');
	closeButton.setAttribute('tabindex', '-1');
	closeButton.setAttribute('aria-label', 'Close dialog');

	closeButton.addEventListener('keydown', event => {
		// If 'Enter' or 'Space' was pressed close the infoWindow.
		if (event.keyCode === 13 || event.keyCode === 32) {
			event.stopPropagation();
			event.preventDefault();
			handleInfoWindowClosing(app);
		}
	});

	childNodes.push(closeButton); // Push closebutton in the childNodes to be in the tab focus lock.

	requestAnimationFrame(timestamp => childNodes[0].focus()); // Focus the first childNode.

	// Set the starting focus index.
	let index = 0;
	// Handle index value and return the new index.
	const handleIndex = (value) => {
		if (value || value >= 0) index = value;
		return index;
	}

	parentNode.addEventListener('keydown', e => handleInfoWindowKeydown(e, app, childNodes, handleIndex));
};

/* Handle keydown event on infoWindow */
const handleInfoWindowKeydown = (event, app, childNodes, handleIndex) => {
	if (!app.state.gMapsHandler) return console.log('GoogleMapsHelper.js - handleInfoWindowKeydown: wrong argument passed. Please pass App component as an argument.');

	// Get the current index.
	let index = handleIndex();

	if (event.shiftKey || event.keyCode === 9 || event.keyCode === 27) {
		event.stopPropagation();
		event.preventDefault();
	}

	// If shift+tab was pressed.
	if (event.shiftKey && event.keyCode === 9) {
		if (index === 0) {
			index = handleIndex(childNodes.length - 1); // Update and get the index to focus.
		} else {
			index = handleIndex(index - 1);
		}

		requestAnimationFrame(timestamp => childNodes[index].focus());
	} else if (event.keyCode === 9) { // If tab was pressed.
		if (index === childNodes.length - 1) {
			index = handleIndex(0);
		} else {
			index = handleIndex(index + 1);
		}

		requestAnimationFrame(timestamp => childNodes[index].focus());
	} else if (event.keyCode === 27) { // If escape was pressed.
		handleInfoWindowClosing(app);
	}
};
