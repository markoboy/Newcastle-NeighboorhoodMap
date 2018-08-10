import React, { Component } from 'react';

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
					<ul className="locations_list">
						<li>
							<button>Location</button>
						</li>
					</ul>
				</div>
			</aside>
		);
	}
}

export default Sidebar;
