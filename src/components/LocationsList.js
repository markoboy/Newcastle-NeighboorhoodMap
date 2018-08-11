import React from 'react';

const LocationsList = ({ locations }) => {
	return (
		<ul className="locations_list">
			{locations.map(location => (
				<li key={location.id}>
					<button>{location.name}</button>
				</li>
			))}
		</ul>
	);
};

export default LocationsList;
