import React, { Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import * as Locations from './utils/Locations';

class App extends Component {
  constructor() {
    super();
    this.state = {
      zoom: 13,
      maptype: 'roadmap',
      map: null,
      locations: [],
      locationsData: []
    }
  }

  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: this.state.zoom,
      maptype: this.state.maptype,
      center: { lat: 54.978252, lng: -1.617780 },
      // Hide the default google maps icons to prevent info window bug by opening
      // an info window from the default locations. https://stackoverflow.com/questions/23390149/gmaps-api-remove-default-poi
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off'}]
        }
      ]
    });

    this.setState({ map });

    // Get locations and locations data from Forsquare API.
    Locations.getLocations()
      .then(locations => {
        Locations.getLocationsData(locations)
          .then(locationsData => this.setState({ locations, locationsData }));
      });
  }

  render() {
    // Store state variables for easier use.
    const { map } = this.state;
    return (
      <div className="app" id='app'>
        <Header />
        <div className="wrapper">
          <Sidebar />
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
