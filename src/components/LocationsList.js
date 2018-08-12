import React from 'react';

const LocationsList = ({ locations, updateIcon, handleClick }) => {
	return (
		<ul className="locations_list">
			{locations.map(location => (
				<li key={location.id}>
					<button
						onClick={() => handleClick(location)}
						onMouseEnter={() => updateIcon(location, 'highlighted')}
						onMouseLeave={() => updateIcon(location, 'default')}
						onFocus={() => updateIcon(location, 'highlighted')}
						onBlur={() => updateIcon(location, 'default')}
					>{location.title ? (location.title) : (location.name)}</button>
				</li>
			))}
		</ul>
	);
};

export default LocationsList;
