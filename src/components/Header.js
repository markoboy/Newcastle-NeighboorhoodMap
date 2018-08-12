import React, { Component } from 'react';

class Header extends Component {
	onHeaderClick = (e) => {
		// Close the sidebar if the menu button is not clicked.
		if (e.target.id !== 'menubutton')
			this.props.closeSidebar();
	};

	render() {
		const { sidebarOpened, openSidebar, closeSidebar } = this.props;
		return (
			<header className="header" onClick={(e) => this.onHeaderClick(e)}>
				<nav className="header_nav">
					<button
						id="menubutton"
						className="hamburger_icon"
						aria-haspopup="true"
						aria-controls="sidebar"
						aria-expanded={sidebarOpened}
						onClick={() => sidebarOpened ? closeSidebar() : openSidebar()}
					>Filter locations</button>
					<a href="/"><h1>Newcastle upon Tyne</h1></a>
				</nav>
			</header>
		);
	}
};

export default Header;
