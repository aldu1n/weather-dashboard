
function cityNameFetch(city) {
    var searchUrl = 'http://api.openweathermap.org/geo/1.0/direct';
    var cityName = "?q=" + city;
    var searchLimit = "&limit=1";
    var apiKey = '&appid=625acfc2e00757d032cf19e083834e38';
    var url = searchUrl + cityName + searchLimit + apiKey;
    console.log(url);
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

function coordinatesFetch(lat,lon){
    var searchUrl = 'http://api.openweathermap.org/data/2.5/forecast';
    var cityLat = '?lat=' + lat;
    var cityLon = '&lon=' + lon;
    var apiKey = '&appid=625acfc2e00757d032cf19e083834e38';
    var url = searchUrl + cityLat + cityLon + apiKey;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      })
}

$('#search-btn').on('click', function(){
    event.preventDefault();
    var searchValue = document.getElementById('city-input').value;
    console.log(searchValue);
    cityNameFetch(searchValue);
})


