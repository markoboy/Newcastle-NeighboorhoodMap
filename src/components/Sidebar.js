import React, { Component } from 'react';
import LocationsList from './LocationsList';

class Sidebar extends Component {
	constructor() {
		super();
		this.state = {
			images: [],
			imageUrl: '',
			imageInd: 0,
			reqCounter: 0
		};
	};

	componentDidMount() {
		// Check if images data are stored on local storage.
		if (window.localStorage.newcastleImages) {
			const images = JSON.parse(window.localStorage.getItem('newcastleImages'));
			this.setState({ images });
		} else {
			this.getImages();
		}

		this.updateBackgroundImage();
	}

	// Get images data from Unsplash API.
	getImages = () => {
		let headers = new Headers();
		headers.append('Authorization', 'Client-ID b34d1a4835eee3492a28ef2557dce130b515531438d5f100b60c5bfc2daeac5a');

		fetch('https://api.unsplash.com/search/photos?page=1&query=Newcastle+upon+Tyne', { headers })
			.then(response => {
				if (!response.ok) {
					return response.json()
						.then(error => this.props.handleError(error, 'Failed to get background images from Unsplash API.'));
				} else if (response.ok) {
					return response.json()
						.then(data => {
							this.setState({ images: data.results });

							window.localStorage.setItem('newcastleImages', JSON.stringify(data.results));
						});
				}
			}).catch(error => this.props.handleError(error, 'An error occured while getting the background images.'));
	};

	// Update backgrounds images every 20s.
	updateBackgroundImage = () => {
		const { images, imageInd, reqCounter} = this.state;
		let timer;

		// Check if the images have received data from the Unsplash API.
		if (images.length > 0) {
			// Preload the image before setting it, in order to have smooth transition between the changes.
			let preloadImage = new Image();
			preloadImage.src = images[imageInd].urls.regular;
			preloadImage.onload = () => this.setState({ imageUrl: preloadImage.src });

			timer = setTimeout(() => {
				// Check if the index is smaller than the images array.
				images.length - 1 > imageInd ?
					this.setState(state => ({ imageInd: state.imageInd + 1 })) : // If so increase the index value.
					this.setState({ imageInd: 0 }); // Else start over from 0 index.
				this.updateBackgroundImage();
			}, 20000);
		} else if (reqCounter < 10) { // Else check again in a while.
			timer = setTimeout(() => {
				// Set a timer request counter in case that there is no online conection.
				this.setState(state => ({ reqCounter: state.reqCounter++ }));
				this.updateBackgroundImage();
			}, 500);
		} else {
			// If more than 20 requests have been made stop requests.
			clearTimeout(timer);
		}
	};

	/* Handle the keypress on the clear-query button */
	handleKeyDown = e => {
		let allowedKeys = {
			'32': 'Space',
			'13': 'Enter'
		};
		// If a key from the allowed keys is pressed clear query.
		if (allowedKeys[e.keyCode]) {
			e.preventDefault();
			this.props.clearQuery();
		}
	};

	handleEscapeKey = event => {
		// If escape key is pressed close the sidebar and set focus to the menubutton.
		if (event.key === 'Escape') {
			event.stopPropagation();
			this.props.closeSidebar();
			document.querySelector('#menubutton').focus();
		}
	};

	/* Handle the submit of the query */
	handleSubmit = e => {
		e.preventDefault();

		// Set focus to the first button child of the locations list.
		let locationsList = document.querySelector('.locations_list');
		if (locationsList.firstChild) {
			locationsList.firstChild.firstChild.focus();
		} else {
			// Set the focus on the results to alert user that there were no results.
			document.querySelector('#results').focus();
		}
	};

	// Find the marker from the location id and update its color on button hover.
	updateMarker = (location, markerIcon) => {
		const { markers, markerIcons, updateMarkerIcon } = this.props;
		if (markers.length > 0) {
			let marker = this.getMarker(location);
			updateMarkerIcon(marker, markerIcons[markerIcon]);
		}
	};

	getMarker = (location) => {
		// Return the marker based on the location id.
		return this.props.markers.filter( marker => marker.id === location.id )[0];
	};

	openInfoWindow = (event, location) => {
		if (this.props.markers.length > 0) {
			let marker = this.getMarker(location);
			this.props.handleButtonClick(event, marker);
			this.props.closeSidebar();
		} else {
			this.props.handleError(event.target.innerHTML + ', list button - ', 'Location information is not available without Google Maps.')
		}
	};

	render() {
		const { locations, markers, isOpened, query, updateQuery, clearQuery } = this.props;

		// Show markers locations if they have loaded else show locations data. For offline use.
		let showingLocations;
		if (markers.length > 0) {
			showingLocations = markers.filter(marker => marker.map !== null);
		} else {
			showingLocations = locations.filter(location => location.location); // Filter out any location that had problem fetching.
			if ( query ) showingLocations = showingLocations.filter(loc => loc.name.toLowerCase().includes( query.toLowerCase() )); // Show locations based on query.
		}

		return (
			<aside
				id="sidebar"
				className={isOpened ? "sidebar open" : "sidebar"}
				style={isOpened ?
					(this.state.imageUrl ? {display: 'inherit', backgroundImage: `url(${this.state.imageUrl}`} : {display: 'inherit'})
					: {display: ''}}
				aria-labelledby="menubutton"
				onKeyDown={(e) => this.handleEscapeKey(e)}>
				<div className="filter-bar">
					<form onSubmit={(e) => this.handleSubmit(e)}>
						<input
							type="search"
							placeholder="Search locations"
							value={query}
							onChange={(event) => updateQuery(event.target.value)}
						/>
						{query ? (
							<div className="clear-query">
								{showingLocations.length > 0 ?
									<span id="results">Showing locations for `{query}`.</span> :
									<span id="results" tabIndex="-1">No results where found.</span>
								}
								<div
									className="clear-query_button"
									tabIndex="0"
									role="button"
									onClick={() => clearQuery()}
									onKeyDown={(e) => this.handleKeyDown(e)}
								>Clear query</div>
							</div>
						) : (
							<div className="clear-query">
								<span id="results">Showing all locations.</span>
							</div>
						)}
					</form>
				</div>
				<div role="region" aria-label="Search results">
					<LocationsList
						locations={showingLocations}
						updateIcon={this.updateMarker}
						handleClick={this.openInfoWindow}
					/>
				</div>
			</aside>
		);
	}
}

export default Sidebar;
