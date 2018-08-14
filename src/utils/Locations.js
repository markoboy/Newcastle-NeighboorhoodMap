/**
 * @file: Locations.js
 * This file will contain the database with
 * locations to fetch places from to be set
 * as markers on the map.
 *
 * It is using Forsquare API to fetch locations
 * and locations informations data.
 */
// Forsquare API keys.
const auth = {
	clientId : 'DGQAHNGYG5UODQOV3QMUJD3Z3BYWGJACYTXA0TL3TUGESUPO',
	clientSecret : 'T2HZZGE25CV4FDOIXEBJEWG3ABOLZ4RXCJE55R1MILHLPJP2'
};

const locations = [
	{
		title: 'The Gate',
		position: { lat: 54.972894, lng: -1.619229 }
	},
	{
		title: 'Millennium Bridge',
		position: { lat: 54.96986, lng: -1.599195 }
	},
	{
		title: 'Leazes Park',
		position: { lat: 54.978943, lng: -1.625376 }
	},
	{
		title: 'Exhibition Park',
		position: { lat: 54.984743, lng: -1.615721 }
	},
	{
		title: 'Life Science Centre',
		position: { lat: 54.967309200, lng: -1.620707300 }
	}
];

export const getLocations = () => {
	if (window.localStorage.venuesNewcastle) {
		// If the data has been fetched and saved in local storage return the saved data.
		return Promise.all(JSON.parse(window.localStorage.getItem('venuesNewcastle')));
	}

	// Fetch an array of locations from https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
	return Promise.all( locations.map( location =>
		fetch(`https://api.foursquare.com/v2/venues/search?ll=${location.position.lat},${location.position.lng}&client_id=${auth.clientId}&client_secret=${auth.clientSecret}&v=20180323`)
			.then(response => {
				if (!response.ok) {
					// If the response was not ok return the errorType and the errorDetail.
					return response.json()
						.then(error => [ { errorType: error.meta.errorType, errorDetail: error.meta.errorDetail } ]);
				} else if (response.ok) {
					// Else if the response was ok, return the 3 first venues.
					return response.json()
						.then(data => data.response.venues.slice(0, 3));
				}
			})
			.catch(error => [ { errorType: error, errorDetail: 'Locations could not be loaded correctly. Please check your connection.' }])
		)).then(venues => {
		let merged = [].concat.apply([], venues); // Merge locations into one from https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript

		// Save the locations data in the localStorage after checking that there was no error.
		let checkMerged = merged.filter(venue => venue.location); // Filter out any object that has not a property of location.
		if (merged.length === checkMerged.length && merged.length > 0)
			window.localStorage.setItem('venuesNewcastle', JSON.stringify(merged));

		return merged;
	});
};

/* Get the locations data to be displayed on the info window */
export const getLocationsData = (venues) => {
	if (window.localStorage.newcastleData) {
		// Return as a Promise because the app sets the data with .then
		return Promise.all(JSON.parse(window.localStorage.getItem('newcastleData')));
	}

	return Promise.all( venues.map( venue =>
		fetch(`https://api.foursquare.com/v2/venues/${venue.id}?&oauth_token=F5AWWCDVW2PY30QQ5LXNZGRN343VY525TNEGMUWEHSSC20PA&v=20180804`)
			.then(response => {
				if (!response.ok) {
					return response.json()
						.then(error => [ { errorType: error.meta.errorType, errorDetail: error.meta.errorDetail } ]);
				} else if (response.ok) {
					return response.json()
						.then(data => data.response.venue)
				}
			})
			.catch(error => [{ errorType: error, errorDetail: 'There was an error getting the Locations Data.' }])
		)).then(venuesData => {
			let merged = [].concat.apply([], venuesData);

			// Save to localStorage.
			let checkMerged = merged.filter(venue => venue.location);
			if (checkMerged.length === merged.length && merged.length > 0)
				window.localStorage.setItem('newcastleData', JSON.stringify(merged));

			return merged;
	});
};
