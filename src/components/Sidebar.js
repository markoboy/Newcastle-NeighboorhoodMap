import React, { Component } from 'react';
import LocationsList from './LocationsList';

class Sidebar extends Component {
	constructor() {
		super();
		this.state = {
			query: ''
		};
	}

	updateQuery = (query) => {
		this.setState({ query: query.replace(/\s\s+/g, ' ') });
	};

	clearQuery = () => {
		this.setState({ query: '' });

		// Focus the search bar.
		document.querySelector('.filter-bar input').focus();
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
			this.clearQuery();
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

	openInfoWindow = (location) => {
		if (this.props.markers.length > 0) {
			let marker = this.getMarker(location);
			this.props.handleButtonClick(marker);
		} else {
			console.log('Markers have not been loaded yet.');
		}
	};

	render() {
		const { locations } = this.props;
		const { query } = this.state;

		let showingLocations;
		if (query) {
			showingLocations = locations.filter( location => location.name.toLowerCase().includes(query.toLowerCase()) );
		} else {
			showingLocations = locations;
		}

		return (
			<aside
				id="sidebar"
				className="sidebar"
				aria-labelledby="menubutton">
				<div className="filter-bar">
					<form onSubmit={(e) => this.handleSubmit(e)}>
						<input
							type="search"
							placeholder="Search locations"
							value={query}
							onChange={(event) => this.updateQuery(event.target.value)}
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
									onClick={() => this.clearQuery()}
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
