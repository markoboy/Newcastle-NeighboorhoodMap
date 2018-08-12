import React, { Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ErrorDialog from './components/ErrorDialog';
import * as Locations from './utils/Locations';
import * as gMapsHelper from './utils/GoogleMapsHelper';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gMapsHandler: true,
      zoom: 13,
      maptype: 'roadmap',
      map: null,
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
    // Initialize the Google Maps, try requesting this for 3s in case that there is a slow connection.
    let times = 0;
    (function testGoogle(app) {
      if (window.google) {
        gMapsHelper.initMap(app);
      } else if (times < 10) {
        setTimeout(() => {
          testGoogle(app);
          times++;
        }, 300);
      } else {
        app.handleError('gMapsHelper.initMap', 'Google maps failed to load. Please check your connection.')
      }
    })(this);

    // Get locations and locations data from Forsquare API.
    Locations.getLocations()
      .then(locations => {
        Locations.getLocationsData(locations)
          .then(locationsData => this.setState({ locations, locationsData }));

        // Init the markers once data has been fetched.
        let times = 0;
        (function testGoogle(app) {
          if (window.google){
            gMapsHelper.initMarkers(app, locations);
          } else if (times < 10) {
            setTimeout(() => {
              testGoogle(app);
              times++;
            }, 300);
          } else {
            app.handleError('gMapsHelper.initMarkers', 'Google maps failed to load. Please check your connection.')
          }
        })(this);
      });
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
            {map ? '' : (<span>Google Maps failed to load. Please check your connection.</span>)}
          </section>
        </div>
        <ErrorDialog errorMsg={error[0]} clearError={this.clearError} />
      </div>
    );
  }
}

export default App;
