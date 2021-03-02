const fetch = require('node-fetch');

// const forcastTemplate = () => {
//   // const weekDay = ;
//   // const 

//   return (`
// 🗓 - Monday (2021-02-26)

// 🌨 Snow ☔️Rain ☁️Foggy ☀️Sun
// Temperature: +7
// Feels Like: -10
// Wind Speed: 8 m/s
// Direction: SE`); 

// }
class BaseRequest {
  constructor(cityId) {
    this.cityId = cityId;
    this.lastRequest = null;
    this.apiLink = null;
    this.weatherData = null;
    this.sevenDaysApi = null;
  }
  getCurrentWeather() {
    this.apiLink = `https://api.openweathermap.org/data/2.5/weather?id=${this.cityId}&appid=7b9f67b52832ae2d71b832446b81dc5b`;

    return fetch(this.apiLink);
  }
  async getSevenDaysWeather() {
    this.sevenDaysApi = `https://api.openweathermap.org/data/2.5/forecast?id=${this.cityId}&appid=7b9f67b52832ae2d71b832446b81dc5b`;

    return fetch(this.sevenDaysApi);
  }
  setWeather(data) { 
    this.weatherData = data;
  }
  transformWeatherData(data) {
    return `
☀️☁️🌧🌨
Current Weather in ${data.name}

Now it's: ${data.weather[0].description == `snow` ? `🌨 Snow` : data.weather[0].description}
Current Temperature: ${(+data.main.temp - 273.15).toFixed(1)}
Feels Like: ${(+data.main.feels_like - 273.15).toFixed(1)}

Wind Speed: ${data.wind.speed} m/s
Direction: ${data.wind.deg}
    `
  }

  // 🌨 Snow ☔️ Rain ☁️ Foggy ☀️ Sun
}

module.exports = BaseRequest;