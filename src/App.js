import React, { Component } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import * as Locations from './utils/Locations';
import * as gMapsHelper from './utils/GoogleMapsHelper';

class App extends Component {
  constructor() {
    super();
    this.state = {
      zoom: 13,
      maptype: 'roadmap',
      map: null,
      markers: [],
      markerIcons: { default: '', highlighted: '' },
      infoWindow: '',
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

    // Create an info window google object to handle locations details.
    let infoWindow = new window.google.maps.InfoWindow();

    this.setState({ map, infoWindow });

    // Get locations and locations data from Forsquare API.
    Locations.getLocations()
      .then(locations => {
        Locations.getLocationsData(locations)
          .then(locationsData => this.setState({ locations, locationsData }));

        // Init the markers once data has been fetched.
        this.initMarkers(map, locations);
      });
  }

  initMarkers = (map, locations) => {
    const { google } = window;
    // Store markers in an array.
    let markers = [];
    const bounds = new google.maps.LatLngBounds();

    // Create the marker's highlighted icon and the default icon.
    const highlightedIcon = this.createMarkerIcon('ee9999');
    const defaultIcon = this.createMarkerIcon('0091ff');
    this.setState({ markerIcons: { default: defaultIcon, highlighted: highlightedIcon }});

    // Loop through locations to add them to the map.
    locations.forEach( location => {
      let position = {
        lat: location.location.lat,
        lng: location.location.lng
      };
      // Create the marker.
      let marker = new google.maps.Marker({
        title: location.name,
        map,
        position,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: location.id
      });

      // Push marker to the array and extend the bounds.
      markers.push(marker);
      bounds.extend(marker.position);

      // Add on click listener.
      marker.addListener('click', () => this.handleMarkerOnClick(marker));

      // Add on mouseover and mouseout listeners to change markers icons.
      marker.addListener('mouseover', () => this.updateMarkerIcon(marker, highlightedIcon));
      marker.addListener('mouseout', () => this.updateMarkerIcon(marker, defaultIcon));
    });

    // Fit the markers bounds to the map.
    map.fitBounds(bounds);

    this.state.infoWindow.addListener('closeclick', () => gMapsHelper.handleInfoWindowClosing(this.state.infoWindow, map, markers));

    this.setState({ markers });
  };

  createMarkerIcon = (markerColor) => {
    return new window.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new window.google.maps.Size(25, 40),
      new window.google.maps.Point(0, 0),
      new window.google.maps.Point(10, 34),
      new window.google.maps.Size(25, 40)
    );
  };

  updateMarkerIcon = (marker, markerIcon) => marker.setIcon(markerIcon);

  handleMarkerOnClick = (marker) => {
    const { map, infoWindow, locationsData } = this.state;
    // Check to make sure InfoWindow is not opened with this marker.
    if ( infoWindow.marker !== marker ) {
      // Add an animation to the marker.
      marker.setAnimation(null);
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 1000); // Stop animation after 1second.

      // Center the map and zoom in when infowindow opens.
      let center = { lat: marker.position.lat() + 0.005, lng: marker.position.lng() };
      map.setCenter(center);
      map.setZoom(15);

      infoWindow.marker = marker;
      let locationInfo = locationsData.filter( location => location.id === marker.id)[0]; // Get the location info based on the marker id.
      infoWindow.setContent(`<b>${locationInfo.name}</b>`);
      infoWindow.open(map, marker);
    }
  }

  render() {
    // Store state variables for easier use.
    const { map, locations, markers, markerIcons } = this.state;
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
