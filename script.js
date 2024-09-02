const apiKey = "a24d79c0d83d41089ba50319242508";
const weatherDataEle = document.querySelector("#weatherdata");
const cityInput = document.getElementById("searchName");
const formEle = document.getElementsByClassName("search-box");
const imgIcon = document.getElementsByClassName("wIcon");

let city = "Delhi";
const cityValue = cityInput.value || city;

let weatherChart = null;

function getWeatherData(cityValue) {
    // Trim any extra spaces from the input city value
    cityValue = cityValue.trim();

    if (!cityValue) {
        alert("Please enter a valid city name.");
        return;
    }

    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityValue}&days=7&aqi=yes&alerts=no`;
    
    console.log("Fetching weather data for:", cityValue);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Please enter a valid city name.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            if (weatherChart) {
                weatherChart.destroy();
            }

            // Display city name
            const cityN = data.location.name;
            const paragraph = document.createElement('div');
            paragraph.textContent = cityN;
            const displayContainer = document.getElementById('cityname');
            displayContainer.innerHTML = "";
            displayContainer.appendChild(paragraph);

            // Display temperature
            const temperature = Math.floor(data.current.temp_c);
            const paragraph1 = document.createElement('div');
            paragraph1.textContent = temperature + "°C";
            const displayTemp = document.getElementById('temp');
            displayTemp.innerHTML = "";
            displayTemp.appendChild(paragraph1);

            // Get and display the current date
            const currentDates = new Date();
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = currentDates.toDateString();
            const displayDate = document.getElementById('currentdate');
            displayDate.innerHTML = "";
            displayDate.appendChild(paragraph2);

            // Get and display the current time
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const paragraph3 = document.createElement('p');
            paragraph3.textContent = currentTime;
            const displayTime = document.getElementById('tme');
            displayTime.innerHTML = "";
            displayTime.appendChild(paragraph3);

            // Display weather condition
            const condText = data.current.condition.text;
            const paragraph4 = document.createElement('p');
            paragraph4.textContent = condText;
            const displayDisc = document.getElementById('desc');
            displayDisc.innerHTML = "";
            displayDisc.appendChild(paragraph4);

            // Display weather condition icon
            const condIcon = data.current.condition.icon;
            const paragraph5 = document.createElement('img');
            paragraph5.src = `https:${condIcon}`;
            const displayIcon = document.getElementById('icon');
            displayIcon.innerHTML = "";
            displayIcon.appendChild(paragraph5);

            // Display humidity
            const humid = data.current.humidity;
            const paragraph6 = document.createElement('p');
            paragraph6.textContent = humid + " %";
            const displayHumid = document.getElementById('humidity');
            displayHumid.innerHTML = "";
            displayHumid.appendChild(paragraph6);

            // Display air quality index
            const aqi = data.current.air_quality['gb-defra-index'];
            const paragraph7 = document.createElement('p');
            paragraph7.textContent = aqi + " gdi";
            const displayAQI = document.getElementById('airQuality');
            displayAQI.innerHTML = "";
            displayAQI.appendChild(paragraph7);

            // Display visibility
            const visiblity = data.current.vis_km;
            const paragraph8 = document.createElement('p');
            paragraph8.textContent = visiblity + " km";
            const displayVis = document.getElementById('visiblity');
            displayVis.innerHTML = "";
            displayVis.appendChild(paragraph8);

            // Display UV index
            const uvRay = data.current.uv;
            const paragraph9 = document.createElement('p');
            paragraph9.textContent = uvRay;
            const displayUVray = document.getElementById('uvIndex');
            displayUVray.innerHTML = "";
            displayUVray.appendChild(paragraph9);

            // Display wind speed
            const windspeed = data.current.wind_kph;
            const paragraph10 = document.createElement('p');
            paragraph10.textContent = windspeed + " kph";
            const displayWind = document.getElementById('windSpeed');
            displayWind.innerHTML = "";
            displayWind.appendChild(paragraph10);

            // Display chance of rain
            const chanceofRain = data.forecast.forecastday[0].day.daily_chance_of_rain;
            const paragraph11 = document.createElement('p');
            paragraph11.textContent = chanceofRain + " %";
            const displayRain = document.getElementById('rainChance');
            displayRain.innerHTML = "";
            displayRain.appendChild(paragraph11);

            // Fetching chart data
            const currentDate = new Date().toISOString().split('T')[0];
            const todayForecast = data.forecast.forecastday.find(day => day.date === currentDate);
            if (todayForecast) {
                const labels = todayForecast.hour.map(hourData => {
                    const time = new Date(hourData.time);
                    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                });

                const temperatures = todayForecast.hour.map(hourData => hourData.temp_c);
                const ctx = document.getElementById('weatherChart').getContext('2d');
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                weatherChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Temperature (°C)',
                            data: temperatures,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time'
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'Temperature (°C)'
                                },
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            } else {
                alert('No weather chart data found for the current date');
            }

            const forecastDays = data.forecast.forecastday;
            const tableBody = document.querySelector('table tbody');

            // Clear existing rows before adding new ones
            tableBody.innerHTML = '';

            // Populate the table with forecast data
            forecastDays.forEach(item => {
                const date = new Date(item.date);
                const dayName = date.toLocaleString('en-US', { weekday: 'short' });
                const temp = Math.floor(item.day.avgtemp_c);
                const iconCode = item.day.condition.icon;
                const iconUrl = `https:${iconCode}`;

                // Creating a new table row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${dayName}</td>
                    <td><img src="${iconUrl}" alt="Weather icon" style="width: 40px;"></td>
                    <td>${temp}°</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            alert('Error: ' + error.message);
            console.error('Error fetching weather data:', error);
        });
}

window.onload = function () {
    const cityValue = cityInput.value || city;
    getWeatherData(cityValue);
};

document.getElementById('searchicon').addEventListener('click', function (event) {
    const cityValue = cityInput.value || city;
    getWeatherData(cityValue);
});
