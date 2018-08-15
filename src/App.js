import React, { Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ErrorDialog from './components/ErrorDialog';
import * as gMapsHelper from './utils/GoogleMapsHelper';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gMapsHandler: true,
      zoom: 13,
      maptype: 'roadmap',
      map: 'Loading...',
      markers: [],
      markerIcons: { default: '', highlighted: '' },
      buttonClicked: null,
      infoWindow: '',
      query: '',
      sidebarOpened: false,
      locations: [],
      locationsData: [],
      error: []
    }
  }

  componentDidMount() {
    // Load the google maps.
    gMapsHelper.loadGoogleMaps(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query)
      gMapsHelper.filterShowingMarkers(this, this.state.query);
  }

  updateMarkerIcon = (marker, markerIcon) => {
    this.setState(state => ({
      markers: state.markers.map(m => {
        if (m === marker) m.setIcon(markerIcon);
        return m;
      })
    }));
  };

  handleMarkerOnClick = (event, marker) => {
    gMapsHelper.handleMarkerOnClick(this, event, marker);
  };

  storeButtonClicked = (target) => {
    this.setState({ buttonClicked: target });
  };

  updateQuery = (query) => {
    this.setState({ query: query.replace(/\s\s+/g, ' ') },
        gMapsHelper.filterShowingMarkers(this, query.replace(/\s\s+/g, ' ')
      ));
  };

  clearQuery = () => {
    this.setState({ query: '' });

    // Focus the search bar.
    document.querySelector('.filter-bar input').focus();
  };

  openSidebar = () => {
    // Check if the small screen is displayed and that the sidebar is closed.
    if (window.innerWidth <= 570 && !this.state.sidebarOpened)
      this.setState({ sidebarOpened: true });
  };

  closeSidebar = () => {
    // Check if the small screen is displayed and that the sidebar is opened.
    if (window.innerWidth <= 570 && this.state.sidebarOpened)
      this.setState({ sidebarOpened: false });
  };

  // This function will handle errors. It will alert the user with an error alert
  // and it will show more info about the error on the console.
  handleError = (error, msg) => {
    console.log(error, msg);
    this.setState(state => ({
      error: state.error.concat(msg)
    }));
  };

  clearError = () => {
    this.setState(state => ({
      error: state.error.slice(1)
    }));
  };

  render() {
    // Store state variables for easier use.
    const { map, locations, markers, markerIcons, query, sidebarOpened, error } = this.state;
    return (
      <div className="app" id='app'>
        <Header
          sidebarOpened={sidebarOpened}
          openSidebar={this.openSidebar}
          closeSidebar={this.closeSidebar}
        />
        <div className="wrapper">
          <Sidebar
            locations={locations}
            markers={markers}
            markerIcons={markerIcons}
            updateMarkerIcon={this.updateMarkerIcon}
            handleButtonClick={this.handleMarkerOnClick}
            isOpened={sidebarOpened}
            closeSidebar={this.closeSidebar}
            query={query}
            updateQuery={this.updateQuery}
            clearQuery={this.clearQuery}
            handleError={this.handleError}
          />
          <section className="map_container" onClick={() => this.closeSidebar()}>
            <div id='map' className="map" role="application" aria-label="Google Maps" tabIndex="-1"></div>
            {typeof map !== 'string' ? '' : (<span tabIndex="0">{map}</span>)}
          </section>
        </div>
        <ErrorDialog errorMsg={error[0]} clearError={this.clearError} />
      </div>
    );
  }
}

export default App;
