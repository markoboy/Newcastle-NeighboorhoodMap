/**
 * @file: GoogleMapsHelper.js
 * This is a helper file to organize the google maps
 * functions to add to the markers and the infowindow.
 */
export const handleInfoWindowClosing = (infoWindow, map, markers) => {
	// Close the info window and empty the previous marker.
	infoWindow.close();
	infoWindow.marker = null;

	// Set the maps bounds and zoom out from the previous marker position.
	const bounds = new window.google.maps.LatLngBounds();
	markers.filter( marker => marker.map !== null ).map( m => bounds.extend(m.position));
	map.fitBounds(bounds);
	map.setZoom(14);
};