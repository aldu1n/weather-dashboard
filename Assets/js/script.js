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
        nameOfCity.text(data.city.name + ', ' + data.city.country + ' (' + currentDate + ')');
        $('#city-info').append(nameOfCity);

        var currentWeather = $('<img>');
        var iconcode = data.list[0].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        currentWeather.attr('src', iconurl);
        $('#current-weather').append(currentWeather);

        var currentTemp = $('<p>');
        currentTemp.text(data.list[0].main.temp + '°F');
        currentTemp.attr('id', 'current-temp');
        $('#current-weather').append(currentTemp);

        var currentHum = $('<p>');
        currentHum.text('Humidity: ' + data.list[0].main.humidity + '%');
        currentHum.attr('id', 'current-hum');
        $('#current-weather').append(currentHum);

        var currentWind= $('<p>');
        currentWind.text('Wind: ' + data.list[0].wind.speed + ' mph');
        currentWind.attr('id', 'current-wind');
        $('#current-weather').append(currentWind);

        function fiveDaysForecast(div,day) {
          var date = dayjs(day.dt_txt).format('MMMM D, YYYY');
          
          var dateEl = $('<p>');
          dateEl.attr('id','five-day-date');
          dateEl.text(date);
          div.append(dateEl);

          var fiveDayWeather = $('<img>');
          var iconcode = day.weather[0].icon;
          var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          fiveDayWeather.attr('src', iconurl);
          fiveDayWeather.attr('id','five-day-img');
          div.append(fiveDayWeather);
  
          var fiveDayTemp = $('<p>');
          fiveDayTemp.attr('id','five-day-temp');
          fiveDayTemp.text(day.main.temp + '°F');
          div.append(fiveDayTemp);
        }

        fiveDaysForecast($('#day-one'),data.list[8]);
        fiveDaysForecast($('#day-two'),data.list[16]);
        fiveDaysForecast($('#day-three'),data.list[24]);
        fiveDaysForecast($('#day-four'),data.list[32]);
        fiveDaysForecast($('#day-five'),data.list[39]);
      })
}

// event listener for search button , which captures search input and calls function for getting city coordinates
$('#search-btn').on('click', function(){
    event.preventDefault();
    var searchValue = document.getElementById('city-input').value;
    cityNameFetch(searchValue);
})


