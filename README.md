# Udacity FEND - Neighborhood Map Project

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

# Table of Contents

- [Project Overview](#project-overview)
- [Project Requirements](#project-requirements)
- [Installation](#installation)
	- [Live Demo](#live-demo)
	- [Local Installation](#local-installation)
- [Browsers tested](#browsers-tested)
- [Tools used](#tools-used)
	-[Resources used](#resources-used)
- [Author](#author)
- [Contribution](#contribution)
- [License](#license)

# Project Overview

[(Back to top)](#table-of-contents)

Neighborhood Map (React), is the last project of Udacity Front End Developer Nanodegree program. This is a project build on `ReactJS` showing a `Google map` of my neighborhood with some locations that are fetched randomly from `Foursquare API`. There is a list showing all available locations that can be filtered by an input search bar. The map has markers on it that represents the showing list, so if you filter the list, the markers will be filtered as well. By clicking on a list button, an infoWindow will open on the marker that shows additional information about the location. Tab focus is locked within the infoWindow as it is a modal, by pressing the close button or escape button it will close the infoWindow and return focus to the element that opened the modal.

In order to succeed on this project, I had to create a Progressive Web Application that runs error-free, with accessibility features in modern devices browsers.

# Project Requirements

[(Back to top)](#table-of-contents)

| Criteria   | Specifications   |
| ---------- | :--------------: |
| Interface Design | All application components are usable and should render across modern desktop, tablets and phone browsers. |
| Application Functionality | Application should include a text input that filters the map markers and the list items. A list-view of locations names. Map that displays all locations markers by default. |
| Asychronous Data Usage | Application utilizes `Google Maps Api` and at least one 3rd party `API`. Data requests that fail are handled by common fallback techniques by an errorHandler function. |
| Documentation | A `README` file is included. Comments are presented on code. |
| Location Details Functionality | Additional data about a location is provided by a 3rd party `API` in an `infoWindow`. Application runs error-free and this functionality is presented in a usable and responsive manner. |
| Accessibility | Focus is approprietly managed. Elements on the page have semantic tags or a `ARIA role` attribute. All images have alt attribute to describe the image. |
| Offline Use | Service worker is available on production build, allowing offline use where serivce worker is available. |
| Application Architecture | React code follows a reasonable component strocture. |

# Installation

## Live Demo

[(Back to top)](#table-of-contents)

At the moment there is no Live Demo available.

## Local Installation

[(Back to top)](#table-of-contents)

- Download the repository from the download button.
- Or clone the repository with Git `$ git clone`.
- Run `$ npm install` to install the project's dependecies.
- Run `$ npm start` to start the development server on your machine.
- Then your default browser will open a page on your `localhost` with the page.
- Run `$ npm run build` in order to run the server with Service Worker.

# Browsers Tested

[(Back to top)](#table-of-contents)

- [**Google Chrome**](https://www.google.com/chrome/) - Version 67, Windows 10 x64
	- [**ChromeVox**](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) - Test screen reader
- [**Firefox**](https://www.mozilla.org/en-GB/firefox/new/) - Version 61, Windows 10 x64
- [**Android Google Chrome**](https://play.google.com/store/apps/details?id=com.android.chrome&hl=en_GB) - Version 64, Redmi Note 3 Pro

# Tools Used

[(Back to top)](#table-of-contents)

- [*Git version control*](https://git-scm.com/)
- [*Sublime text editor 3*](https://www.sublimetext.com/)

## Resources Used

[(Back to top)](#table-of-contents)

- **General searching**
	- [Google search](https://google.co.uk)
	- [w3schools](https://www.w3schools.com)
	- [MDN web docs](https://developer.mozilla.org/en-US/)
	- [CSS-Tricks](https://css-tricks.com/)
- **Library**
	- [React](https://reactjs.org/)
- **Dependencies**
	- [Create-react-app](https://github.com/facebook/create-react-app)
- **API**
	- [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial)
	- [Foursquare API](https://developer.foursquare.com)
	- [Unsplash API](https://unsplash.com/developers)
- **Helpfull**
	- [Udacity Google Maps API Course](https://github.com/markoboy/ud864)
	- [Map Icon](http://freeiconshop.com/icon/location-map-icon-flat/)
	- [Preload images](https://www.htmlgoodies.com/tutorials/web_graphics/article.php/3480001/So-You-Want-To-Pre-Load-Huh.htm)
	- [Use of Google Maps API](https://sanderknape.com/2017/07/integrating-reactjs-google-maps-widget/)
	- All the other resources used for this project are commented on the source code.

# Author

[(Back to top)](#table-of-contents)

- [Athanasios Markou](https://www.linkedin.com/in/a-markou/)

# Contribution

[(Back to top)](#table-of-contents)

Pull requests are not welcomed, as this is a project to test my skills in `Responsive layout`, `Accessibilty features` and `3rd Party API`.

# License

[(Back to top)](#table-of-contents)

This project is licensed under the [MIT License](/LICENSE)
