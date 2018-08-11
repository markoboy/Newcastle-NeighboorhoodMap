import React, { Component } from 'react';
import LocationsList from './LocationsList';

class Sidebar extends Component {
	// Find the marker from the location id and update its color on button hover.
	updateMarker = (location, markerIcon) => {
		const { markers, markerIcons, updateMarkerIcon } = this.props;
		if (markers.length > 0) {
			let marker = markers.filter( marker => marker.id === location.id )[0];
			updateMarkerIcon(marker, markerIcons[markerIcon]);
		} else {
			console.log('Markers have not been loaded yet.');
		}
	}

	render() {
		const { locations } = this.props;

		return (
			<aside
				id="sidebar"
				className="sidebar"
				aria-labelledby="menubutton">
				<div className="filter-bar">
					<form onSubmit={(e) => e.preventDefault()}>
						<input
							type="search"
							placeholder="Search locations"
						/>
					</form>
				</div>
				<div>
					<LocationsList
						locations={locations}
						updateIcon={this.updateMarker}
					/>
				</div>
			</aside>
		);
	}
}

export default Sidebar;
