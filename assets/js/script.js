var forecastBlocks = document.getElementById("forecastBlocks");
console.log("works!")

var dates = [
    "7/8/2022",
    "7/9/2022",
    "7/10/2022",
    "7/11/2022",
    "7/11/2022"
];


getForecastBlocks();

function getForecastBlocks(){
    // forecastBlocks.innerHTML="";
//dates need to feed array from api for selected date. Today()+1 starting point.
    for (var index = 0; index < dates.length; index++) {
        var forecastBlocks = dates[index];
    
        var row = document.createElement("div")
        row.classList.add("row")
        forecastBlocks.appendChild(row);

        var datesEl = document.createElement("div")
        datesEl.innerHTML = forecastBlocks
        datesEl.classList.add("forecast-dates")
        row.appendChild(datesEl);

        var forecastCard = document.createElement("forecastCard")
        forecastCard.placeholder = "Date, Temp, Wind, Humidity"
        row.appendChild(forecastCard);

    }

}