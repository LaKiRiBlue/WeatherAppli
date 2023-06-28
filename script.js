// API key for OpenWeatherMap
const apiKey = 'f64bf53ebc03ad5529597e7df1fdcf0e';

// Elements
const cityInput = document.getElementById('city-input');
const submitBtn = document.getElementById('submit-btn');
const cityPhoto = document.getElementById('city-photo');
const weatherInfo = document.getElementById('weather-info');

// Event listeners
submitBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    getWeather();
  }
});

// Function to fetch weather data
function getWeather() {
  const city = cityInput.value.trim();

  if (city === '') {
    alert('Please enter a city name');
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      const forecast = data.list;
      const dailyForecast = groupForecastByDay(forecast);

      // Clear previous weather information
      weatherInfo.innerHTML = '';

      dailyForecast.forEach(forecastItem => {
        const date = new Date(forecastItem[0].dt_txt);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temperature = Math.round(forecastItem[0].main.temp - 273.15);
        const description = forecastItem[0].weather[0].description;

        // Create weather item element
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');
        weatherItem.innerHTML = `
          <p>${day}</p>
          <p>${description}</p>
          <p>${temperature}°C</p>
        `;

        // Append weather item to weather info container
        weatherInfo.appendChild(weatherItem);
      });

      // Display city photo
      getCityPhoto(city);
    })
    .catch(error => {
      console.log('Error:', error);
      alert(error.message);
    });
}

// Function to group forecast data by day
function groupForecastByDay(forecast) {
  const dailyForecast = {};

  forecast.forEach(forecastItem => {
    const date = forecastItem.dt_txt.split(' ')[0];

    if (dailyForecast[date]) {
      dailyForecast[date].push(forecastItem);
    } else {
      dailyForecast[date] = [forecastItem];
    }
  });

  return Object.values(dailyForecast);
}

// Function to fetch city photo
function getCityPhoto(city) {
    const unsplashAccessKey = 'STSm40hyPGKvpCl9Puek4EvD9emy9To5OKKDLSa-7uc'; // Replace with your Unsplash API access key
    const apiUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashAccessKey}`;
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch city photo');
        }
        return response.json();
      })
      .then(data => {
        if (data.urls && data.urls.regular) {
          const photoUrl = data.urls.regular;
          cityPhoto.style.backgroundImage = `url(${photoUrl})`;
        } else {
          cityPhoto.innerHTML = 'Photo not available';
        }
      })
      .catch(error => {
        console.log('Error:', error);
        cityPhoto.innerHTML = 'Photo not available';
      });
  }
  

  // my unique unsplash key is: STSm40hyPGKvpCl9Puek4EvD9emy9To5OKKDLSa-7uc
  // my OpenWeather unique key is: f64bf53ebc03ad5529597e7df1fdcf0e