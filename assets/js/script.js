var currentWeather = $(".current-weather");
var forecastHeader = $(".forecast-header");
var previousSearches = [];



function getWeather(city) {
  var isError = false;
  currentWeather.empty();
    $("#forecastBlocks").empty()
  if (!city) {
    return;
  }
  var openWeatherApi =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=8037846fe62bc5e81d01cc8e74316bc3";

  fetch(openWeatherApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      //if city n/a based on code response that is anything than 200,false
      if (response.cod !== 200) {
        // alert("Location N/A, please try another city!");
        $("#city").val("");
        isError = true;
        return;
      }
      //if valid city, save to local storage. Append list and save defined later.
      if (!isError) {
        saveLocalStorage(city);
      }

      var currentDate = moment().format(" MM/DD/YYYY");
      //weather icon id found in repsonse.weather.icon.
      var weatherIcon = response.weather[0].icon;
      var iconLibrary =
        "http://openweathermap.org/img/w/" + weatherIcon + ".png";
      var cityName = $("<h3>").html(city + currentDate);
      //orders list in order of city name before the weather icon.
      currentWeather.prepend(cityName);
      //appends corresponding icon from open weather library url to the city name.
      currentWeather.append($("<img>").attr("src", iconLibrary));
      //math.ceil rounds up for temp. Response.main... extracts data from api response.
      var temperature = Math.ceil(response.main.temp);
      // &#8457 is html code for degrees fahrenheit.
      currentWeather.append($("<p>").html("Temperature: " + temperature + " &#8457"));
      var humidity = response.main.humidity + "&#37;";
      var feelsLike = Math.ceil(response.main.feels_like);
      currentWeather.append($("<p>").html("Feels Like: " + feelsLike + " &#8457"    ));
      currentWeather.append($("<p>").html("Humidity: " + humidity));
      //wind in different cat w/i api response.
      var wind = response.wind.speed;
      currentWeather.append($("<p>").html("Wind: " + wind + " mph"));
      var pressure = response.main.pressure;
      currentWeather.append(
        $("<p>").html("Pressure: " + pressure + " millibars")
      );

      //UV lat/longs required.
      var oneCallUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon +
        "&exclude=minutely,hourly&units=imperial&appid=8037846fe62bc5e81d01cc8e74316bc3";
      return fetch(oneCallUrl)
        .then(function (oneCall) {
          return oneCall.json();
        })
        .then(function (oneCall) {
          currentWeather.append(
            $("<p>").html("UV index: <span>" + oneCall.current.uvi + "</span>")
          );
          if (oneCall.current.uvi <= 2) {
            $("span").attr("class", "btn btn-success");
          } else if (oneCall.current.uvi > 2 && oneCall.current.uvi <= 7) {
            $("span").attr("class", "btn btn-warning");
          } else {
            $("span").attr("class", "btn btn-danger");
          }
          fheader = document.getElementById("forecast-header")
          fheader.classList.remove('hide')
          //5-day forcecast loop -- today+1 in loop w/i = 1
          for (var i = 1; i < 6; i++) {
            var lowCard = $("<div>").attr(
              "class",
              "col m-2 bg-primary text-white rounded-lg p-2"
            );
            $("#forecastBlocks").append(lowCard);
            var theDate = new Date(
              oneCall.daily[i].dt * 1000
            ).toLocaleDateString("en-US");
            lowCard.append($("<h4>").html(theDate));
            var weatherIcon = oneCall.daily[i].weather[0].icon;
            var iconLibrary =
              "http://openweathermap.org/img/w/" + weatherIcon + ".png";
            lowCard.append($("<img>").attr("src", iconLibrary));
            var temp = Math.ceil(oneCall.daily[i].temp["day"]);
            lowCard.append($("<p>").html("Temp: " + temp + " &#8457"));
            var humidity = oneCall.daily[i].humidity;
            lowCard.append($("<p>").html("Humidity: " + humidity + " &#37"));
            var wind = oneCall.daily[i].wind_speed;
            lowCard.append($("<p>").html("Wind: " + wind + " mph"));
          }
        });
    });
}


$("#runSearch").on("click", function () {
    var city = $("#city").val();
    getWeather(city);
    $("#city").val("");
    
    console.log(classList);
});

function removeHide() {
    forecastHeader.classList.remove("hide");
};

var getLocalStorage = function () {
    $(".search-list").empty();
    var storageData = JSON.parse(localStorage.getItem("previousSearches"));
    if (storageData !== null) {
      previousSearches = storageData.reverse();

      console.log(previousSearches)
      historyList = ""
      for (const history of previousSearches) {
        $(".search-list").append(`<button type="submit" class="btn previous-city-searched">${history}</button>`)
      }
  
    //   for (var i = 0; i < previousSearches.length; i++) {
    //     //only returns 5 previous results from localStorage upon browser refresh.
    //     if (i == 5) {
    //       break;
    //     }
    //     previouslySearchBtns = $(".search-list").attr({
    //       class: "previous-city-searched",
    //       href: "#",
    //       "btn-id": i
    //     });
    //     previouslySearchBtns.text(previousSearches[i]);
    //     $(".search-list").append(previouslySearchBtns);
      }
    };

var saveLocalStorage = function (city) {
    console.log(previousSearches)
  var inArray = previousSearches.includes(city);
  if (!inArray && city !== "") {
    previousSearches.push(city);
    if (previousSearches.length >=5){
        console.log("Length greater than 5")
        previousSearches.shift()
        console.log(previousSearches)
    }
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
    getLocalStorage()
  }
};

$(".search-list").on("click", function (event) {
  var cityAgain = event.target.innerHTML;
  $("#city").val(cityAgain);
  getWeather(cityAgain);
});

getLocalStorage();
