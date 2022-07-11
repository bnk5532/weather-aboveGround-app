// var forecastBlocks = document.getElementById("forecastBlocks");
// console.log("works!")

// var dates = [
//     "7/8/2022",
//     "7/9/2022",
//     "7/10/2022",
//     "7/11/2022",
//     "7/11/2022"
// ];


// getForecastBlocks();

// function getForecastBlocks(){
//     // forecastBlocks.innerHTML="";
// //dates need to feed array from api for selected date. Today()+1 starting point.
//     for (var index = 0; index < dates.length; index++) {
//         var forecastBlocks = dates[index];
    
//         var row = document.createElement("div")
//         row.classList.add("row")
//         forecastBlocks.appendChild(row);

//         var datesEl = document.createElement("div")
//         datesEl.innerHTML = forecastBlocks
//         datesEl.classList.add("forecast-dates")
//         row.appendChild(datesEl);

//         var forecastCard = document.createElement("forecastCard")
//         forecastCard.placeholder = "Date, Temp, Wind, Humidity"
//         row.appendChild(forecastCard);

//     }

var currentWeather = $(".current-weather")
var previousSearches = [];

function getWeather(city) {
    var isError=false;
    currentWeather.empty()
    $("#forcastBlocks").empty();
    if(city){
        return;
    }

var openWeatherApi =
     "https://api.openweathermap.org/data/2.5/weather?q=" + city +
     "&units=imperial&appid=8037846fe62bc5e81d01cc8e74316bc3";

     fetch(openWeatherApi)
        .then(function(response) {
            return response.json();
        })
        //if city n/a based on code response that is anything than 200,false
        if(response.cod !== 200){
            alert("Location N/A, please try another city!");
            $("#city").val("");
            isError=true;
            getLocation();
            return;
        }
        //if valid city, save to local storage. Append list and save defined later.
        if(!isError){
            saveLocalStorage(city);
        }

        var currentDate = moment().format("MM/DD/YYYY");
        //weather icon id found in repsonse.weather.icon.
        var weatherIcon = response.weather[0].icon;
        var iconLibrary = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
        var cityName = $("<h3>").html(city + date)
        //orders list in order of city name before the weather icon. 
        currentWeather.prepend(cityName)
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
}