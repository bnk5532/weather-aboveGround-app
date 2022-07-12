var currentWeather = $(".current-weather");
var previousSearches = [];

var getLocalStorage = function () {
  var storageData = JSON.parse(localStorage.getItem("previousSearches"));
  if (storageData !== null) {
    previousSearches = getLocalStorage;
    for (var i = 0; i < previousSearches.length; i++) {
      //only returns 5 previous results from localStorage upon browser refresh.
      if (i == 5) {
        break;
      }
      previouslySearchBtns = $("<a>").attr({
        class: "previous-city-searched",
        href: "#",
        "btn-id": index,
      });
      previouslySearchBtns.text(previousSearches[index]);
      $(".search-form").append(previouslySearchBtns);
    }
  }
};

function getWeather(city) {
  var isError = false;
  currentWeather.empty();
  $("#forcastBlocks").empty();
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

    var currentDate = moment().format("MM/DD/YYYY");
    //weather icon id found in repsonse.weather.icon.
    var weatherIcon = response.weather[0].icon;
    var iconLibrary = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
    var cityName = $("<h3>").html(city + currentDate);
    //orders list in order of city name before the weather icon.
    currentWeather.prepend(cityName);
    //appends corresponding icon from open weather library url to the city name.
    currentWeather.append($("<img>").attr("src", iconLibrary));
    //math.ceil rounds up for temp. Response.main... extracts data from api response.
    var temperature = Math.ceil(response.main.temp);
    // &#8457 is html code for degrees fahrenheit.
    currentWeather.append($("<p>").html("Temperature: " + temp + " &#8457"));
    var humidity = response.main.humidity + "&#37;";
    var feelsLike = Math.ceil(response.main.feels_like);
    currentWeather.append($("<p>").html("Feels Like: " + feelsLike));
    currentWeather.append($("<p>").html("Humidity: " + humidity));
    //wind in different cat w/i api response.
    var wind = response.wind.speed;
    currentWeather.append($("<p>").html("Wind: " + wind + " MPH"));
    var pressure = response.main.pressure;
    currentWeather.append($("<p>").html("Pressure: " + pressure + " millibars"));

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
          $("<p>").html("UV Index: <span>" + oneCall.current.uvi + "</span>")
        );
        /* Set UV Priority Warning */
        if (oneCall.current.uvi <= 2) {
          $("span").attr("class", "btn btn-okay");
        } else if (oneCall.current.uvi > 2 && oneCall.current.uvi <= 7) {
          $("span").attr("class", "btn btn-warning");
        } else {
          $("span").attr("class", "btn btn-danger");
        }

        //5-day forcecast loop
        for (var i = 1; i < 6; i++) {
          var lowCard = $("<div>").attr(
            "class",
            "col fiveDay bg-primary text-white rounded-lg p-2"
          );
          $("#forecastBlocks").append(lowCard);
          var theDate = new Date(
            oneCall.daily[index].dt * 1000
          ).toLocaleDateString("en-US");
          /* Display Date */
          lowCard.append($("<h4>").html(theDate));
          var weatherIcon = oneCall.daily[i].weather[0].icon;
          var iconLibrary =
            "http://openweathermap.org/img/w/" + weatherIcon + ".png";
          lowCard.append($("<img>").attr("src", iconLibrary));
          var temp = Math.ceil(oneCall.daily[index].temp["day"]);
          lowCard.append($("<p>").html("Temp: " + temp + " &#8457"));
          var humidity = oneCall.daily[index].humidity;
          lowCard.append($("<p>").html("Humidity: " + humidity));
        }
      });
  });
}

$("#runSearch").on("click", function () {
  var city = $("#city").val();
  getWeather(city);
  $("#city").val("");
  console.log("clicky works")
});

var saveLocalStorage = function (city) {
  var inArray = previousSearches.includes(city);
  if (!inArray && city !== "") {
    previousSearches.push(city);
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
    var previouslySearchBtns = $("<a>").attr({
      class: "previous-city-searched", href: "#","btn-id": previousSearches.length});
    previouslySearchBtns.text(city);
    $(".search-form").append(previousSearches);
  }
};

$(".search-form").on("click", function (event) {
  var cityAgain = event.target.innerHTML;
  $("#city").val(cityAgain);
  getWeather(cityAgain);
});

getLocalStorage();


function showLocal() {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&appid=8037846fe62bc5e81d01cc8e74316bc3"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      getWeather(response.name);
      $("#city").val(response.name);
      saveLocalStorage(response.name);
    });
}
