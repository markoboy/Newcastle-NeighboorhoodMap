import React, { Component } from 'react';
import LocationsList from './LocationsList';

class Sidebar extends Component {
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
			console.log('Markers have not been loaded yet.');
		}
	};

	render() {
		const { locations, markers, isOpened, query, updateQuery, clearQuery } = this.props;

		// Show markers locations if they have loaded else show locations data. For offline use.
		let showingLocations;
		if (markers.length > 0) {
			showingLocations = markers.filter(marker => marker.map !== null);
		} else {
			showingLocations = locations;
		}

		return (
			<aside
				id="sidebar"
				className={isOpened ? "sidebar open" : "sidebar"}
				style={isOpened ? {display: 'inherit'} : {display: ''}}
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
				<div>
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
