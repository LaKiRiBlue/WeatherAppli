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
        const minTemperature = Math.round(forecastItem[0].main.temp_min - 273.15);
        const maxTemperature = Math.round(forecastItem[0].main.temp_max - 273.15);
        const windSpeed = forecastItem[0].wind.speed;

        // Create weather item element
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');
        weatherItem.innerHTML = `
          <p id="day">${day}</p>
          <p id="date">${date.toLocaleDateString('en-GB')}</p>
          <p id="description">${description}</p>
          <p id="temp">${temperature}°C</p>
          <p id="min">Min: ${minTemperature}°C</p>
          <p id="max">Max: ${maxTemperature}°C</p>
          <p id="wind">Wind Speed: ${windSpeed} m/s</p>
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
  // Event listeners
submitBtn.addEventListener('click', () => {
  saveUserChoice(cityInput.value.trim());
  getWeather();
});
cityInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    saveUserChoice(cityInput.value.trim());
    getWeather();
  }
});

// Function to save the user's city choice in local storage
function saveUserChoice(city) {
  localStorage.setItem('userCity', city);
}

// Function to get the user's city choice from local storage
function getUserChoice() {
  return localStorage.getItem('userCity');
}

// Function to set the city input value from local storage
function setCityInputValue() {
  const userCity = getUserChoice();
  if (userCity) {
    cityInput.value = userCity;
  }
}

// Function to initialize the application
function initializeApp() {
  setCityInputValue();
  getWeather();
}

// Call initializeApp() when the page loads
window.addEventListener('load', initializeApp);

// Function to get minimum and maximum temperatures of a day
function getMinMaxTemperatures(forecast) {
  let minTemperature = Infinity;
  let maxTemperature = -Infinity;

  forecast.forEach(forecastItem => {
    const temperature = Math.round(forecastItem.main.temp - 273.15);
    minTemperature = Math.min(minTemperature, temperature);
    maxTemperature = Math.max(maxTemperature, temperature);
  });

  return {
    minTemperature,
    maxTemperature
  };
}

  

  // my unique unsplash key is: STSm40hyPGKvpCl9Puek4EvD9emy9To5OKKDLSa-7uc
  // my OpenWeather unique key is: f64bf53ebc03ad5529597e7df1fdcf0e