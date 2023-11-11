// day.js plugin to get current date
var currentDate = dayjs().format('MMMM D, YYYY'); 

// fetch for getting specific city coordinates
function cityNameFetch(city) {
    var searchUrl = 'http://api.openweathermap.org/geo/1.0/direct';
    var cityName = "?q=" + city;
    var searchLimit = "&limit=1";
    var apiKey = '&appid=625acfc2e00757d032cf19e083834e38';
    var url = searchUrl + cityName + searchLimit + apiKey;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        coordinatesFetch(lat,lon)
      })
}

// fetch for getting city weather info based on coordinates
function coordinatesFetch(lat,lon){
    var searchUrl = 'http://api.openweathermap.org/data/2.5/forecast';
    var cityLat = '?lat=' + lat;
    var cityLon = '&lon=' + lon;
    var apiKey = '&appid=625acfc2e00757d032cf19e083834e38';
    var units = '&units=imperial'
    var url = searchUrl + cityLat + cityLon + apiKey + units;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        var nameOfCity = $('<h2>');
        nameOfCity.text(data.city.name + ', ' + data.city.country);
        $('#city-info').append(nameOfCity);

        var date = $('<p>');
        date.text(currentDate);
        $('#city-info').append(date);
      })
}

// event listener for search button , which captures search input and calls function for getting city coordinates
$('#search-btn').on('click', function(){
    event.preventDefault();
    var searchValue = document.getElementById('city-input').value;
    cityNameFetch(searchValue);
})


