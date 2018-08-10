import React, { Component } from 'react';
import Header from './components/Header';

class App extends Component {
  constructor() {
    super();
    this.state = {
      zoom: 13,
      maptype: 'roadmap',
      map: null
    }
  }

  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 13,
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
  }

  render() {
    // Store state variables for easier use.
    const { map } = this.state;
    return (
      <div className="app" id='app'>
        <Header />
        <div className="wrapper">
          <aside className="sidebar"></aside>
          <section className="map_container" tabIndex="-1">
            <div id='map' className="map"></div>
            {map ? '' : (<span>Error</span>)}
          </section>
        </div>
      </div>
    ); 
  }
}

export default App;
