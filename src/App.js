import React, { Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
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
      infoWindow: '',
      query: '',
      locations: [],
      locationsData: []
    }
  }

  componentDidMount() {
    // Initialize the Google Maps.
    if (window.google)
      gMapsHelper.initMap(this);

    // Get locations and locations data from Forsquare API.
    Locations.getLocations()
      .then(locations => {
        Locations.getLocationsData(locations)
          .then(locationsData => this.setState({ locations, locationsData }));

        // Init the markers once data has been fetched.
        if (window.google)
          gMapsHelper.initMarkers(this, locations);
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

  handleMarkerOnClick = (marker) => {
    gMapsHelper.handleMarkerOnClick(this, marker);
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

  render() {
    // Store state variables for easier use.
    const { map, locations, markers, markerIcons, query } = this.state;
    return (
      <div className="app" id='app'>
        <Header />
        <div className="wrapper">
          <Sidebar
            locations={locations}
            markers={markers}
            markerIcons={markerIcons}
            updateMarkerIcon={this.updateMarkerIcon}
            handleButtonClick={this.handleMarkerOnClick}
            query={query}
            updateQuery={this.updateQuery}
            clearQuery={this.clearQuery}
          />
          <section className="map_container" tabIndex="-1">
            <div id='map' className="map" role="application" aria-label="Google Maps"></div>
            {map ? '' : (<span>Error</span>)}
          </section>
        </div>
      </div>
    ); 
  }
}

export default App;
