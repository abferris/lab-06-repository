'use strict'

//Load environdment Vars from .env
require('dotenv').config();

// App Dependancies
const express = require ('express');
const cors = require('cors');

//App Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
//API routes

//locations
app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});
//weather
app.get('/weather', (request, response) => {
  const weatherData = getWeather(request.query.data);
  response.send(weatherData);
})
app.use('*', (request, response) => handleError('Route does not exist',response));


// Will need a route for getting weather data
//Only implement AFTER "location" is working

//Need a catch-all route that invockes handleError() on bad request

//Make sure server is listening for requests
app.listen(PORT, () => console.log(`App is up on ${PORT}`))

//Helper Functions

//Err Handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went terribly wrong. Toodles!');
}

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData);
  // console.log('location in searchToLatLong()', location);
  return location;

}

function Location(query, res) {
  // console.log('res in Location()', res);
  this.search_query = query;
  this.formatted_query = res.results[0].formatted_address;
  this.latitude = res.results[0].geometry.location.lat;
  this.longitude = res.results[0].geometry.location.lng;
}

// Will need to add new route next to the other one in the server
//Look at the front end code to see what the route neesd to be called
//logic in callback function should invoke getWeather to retrieve and prepare data, and send that data back to the client
//Look at the app.get('/location' above for a model of how this should look)

function getWeather(location) {
  const darkskyData = require('./data/darksky.json');
  if (darkskyData.latitude.toString()===location.latitude && darkskyData.longitude.toString()===location.longitude){
    const weatherSummaries = [];
    //We are going to return array of obj and we need to create it
    //each object in rasw data should be passed through constructor
    //these new instances should be pushed to the array we created

    darkskyData.daily.data.forEach( day=> {
      weatherSummaries.push(new Weather(day));
    });
    //return the array that has been filled with instances
    return weatherSummaries;
  }
}
//This is the constructor you need for the function getWeather()
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time *1000).toString().slice(0,15);
}
