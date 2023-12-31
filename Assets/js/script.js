// Day.js plugin to get current date
var currentDate = dayjs().format('MMMM D, YYYY'); 

// Fetch for getting specific city coordinates
function cityNameFetch(city) {
    var searchUrl = 'https://api.openweathermap.org/geo/1.0/direct';
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
        coordinatesFetch(lat,lon);
        saveSearchHistory(city);
      })
      .catch(error => {
        if (error instanceof TypeError) {
          var time = 2;
          function alertTimer(){
            $('.alert-danger').removeClass('hidden');
            time--;
            if (time <= 0){
              $('.alert-danger').addClass('hidden');
            }
          }
          setInterval(alertTimer, 1000);
          alertTimer();
        }
      });
}

// Fetch for getting city weather info based on coordinates, and then creating html elements to show weather data.
function coordinatesFetch(lat,lon){
    var searchUrl = 'https://api.openweathermap.org/data/2.5/forecast';
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

        $('.col-sm-9').removeClass('hidden');

        var nameOfCity = $('#city-name');
        nameOfCity.text(data.city.name + ', ' + data.city.country + ' (' + currentDate + ')');

        var currentWeather = $('#current-weather-img');
        var iconcode = data.list[0].weather[0].icon;
        var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
        currentWeather.attr('src', iconurl);

        var currentTemp = $('#current-temp');
        currentTemp.text(data.list[0].main.temp + '°F');

        var currentHum = $('#current-hum');
        currentHum.text('Humidity: ' + data.list[0].main.humidity + '%');

        var currentWind= $('#current-wind');
        currentWind.text('Wind: ' + data.list[0].wind.speed + ' mph');

       // Function to show 5 day forecast
        function fiveDaysForecast(div,div1,div2,day) {
          var date = dayjs(day.dt_txt).format('MMMM D, YYYY');
          
          var dateEl = document.querySelector(div);
          dateEl.textContent = date;
        
          var fiveDayWeather = document.querySelector(div1);
          var iconcode = day.weather[0].icon;
          var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
          fiveDayWeather.setAttribute('src', iconurl);
        
          var fiveDayTemp = document.querySelector(div2);
          fiveDayTemp.textContent = day.main.temp + '°F';
        }

        fiveDaysForecast("div#day-one > p#five-day-date","div#day-one > img#five-day-img","div#day-one > p#five-day-temp",data.list[8]);
        fiveDaysForecast("div#day-two > p#five-day-date","div#day-two > img#five-day-img","div#day-two > p#five-day-temp",data.list[16]);
        fiveDaysForecast("div#day-three > p#five-day-date","div#day-three > img#five-day-img","div#day-three > p#five-day-temp",data.list[24]);
        fiveDaysForecast("div#day-four > p#five-day-date","div#day-four > img#five-day-img","div#day-four > p#five-day-temp",data.list[32]);
        fiveDaysForecast("div#day-five > p#five-day-date","div#day-five > img#five-day-img","div#day-five > p#five-day-temp",data.list[39]);
      })
}



// Event listener for search button , which captures search input and calls function for getting city coordinates
$('#search-btn').on('click', function(){
    event.preventDefault();
    var searchValue = document.getElementById('city-input').value;
    cityNameFetch(searchValue);
})


// Function to save search history in local storage
function saveSearchHistory(city) {
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(city)) {
    if (searchHistory.length >= 5) {
      searchHistory.pop(); 
    }
    searchHistory.unshift(city); 
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateLocalStorageButtons();
  }
}

// Function to update the local storage buttons
function updateLocalStorageButtons() {
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  $('.local-storage-btn').each(function (index) {
    if (index < searchHistory.length) {
      $(this).text(searchHistory[index]);
      $(this).removeClass('hidden');
    } else {
      $(this).addClass('hidden');
    }
  });
}

// Event listener for local storage buttons
$('.local-storage-btn').on('click', function () {
  var searchValue = $(this).text();
  cityNameFetch(searchValue);
});

updateLocalStorageButtons();
