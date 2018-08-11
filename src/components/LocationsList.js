import React from 'react';

const LocationsList = ({ locations, updateIcon }) => {
	return (
		<ul className="locations_list">
			{locations.map(location => (
				<li key={location.id}>
					<button
						onMouseEnter={() => updateIcon(location, 'highlighted')}
						onMouseLeave={() => updateIcon(location, 'default')}
						onFocus={() => updateIcon(location, 'highlighted')}
						onBlur={() => updateIcon(location, 'default')}
					>{location.name}</button>
				</li>
			))}
		</ul>
	);
};

export default LocationsList;
