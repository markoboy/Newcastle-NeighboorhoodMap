import React from 'react';

const Header = () => {
	return (
		<header className="header">
			<nav className="header_nav">
				<button
					id="menubutton"
					className="hamburger_icon"
					aria-haspopup="true"
					aria-controls="sidebar">
					Filter locations
				</button>
				<a href="/"><h1>Newcastle upon Tyne</h1></a>
			</nav>
		</header>
	);
};

export default Header;