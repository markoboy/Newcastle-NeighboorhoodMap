import React, { Component } from 'react';
import LocationsList from './LocationsList';

class Sidebar extends Component {
	render() {
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
					<LocationsList locations={this.props.locations} />
				</div>
			</aside>
		);
	}
}

export default Sidebar;
