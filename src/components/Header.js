import React, { Component } from 'react';

class Header extends Component {
	onHeaderClick = (e) => {
		// Close the sidebar if the menu button is not clicked.
		if (e.target.id !== 'menubutton')
			this.props.closeSidebar();
	};

	openSidebar = () => {
		this.props.openSidebar();
		// Focus the search bar.
		let searchBar = document.querySelector('.filter-bar input');
		// Requestanimationframe in order to make sure that the sidebar is opened so that it get focused.
		requestAnimationFrame(timestamp => searchBar.focus());
	};

	render() {
		const { sidebarOpened, closeSidebar } = this.props;
		return (
			<header className="header" onClick={(e) => this.onHeaderClick(e)}>
				<nav className="header_nav">
					<button
						id="menubutton"
						className="hamburger_icon"
						aria-haspopup="true"
						aria-controls="sidebar"
						aria-expanded={sidebarOpened}
						onClick={() => sidebarOpened ? closeSidebar() : this.openSidebar()}
					>Filter locations</button>
					<a href="/"><h1>Newcastle upon Tyne</h1></a>
				</nav>
			</header>
		);
	}
};

export default Header;
