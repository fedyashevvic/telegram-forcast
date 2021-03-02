const fs = require('fs');

class City {
  constructor () {
    this.cityId = null;
    this.cityName = null;
    this.allCities = fs.readFileSync('city-list.json');
  }
  _updateCity(newCityId, newCityName) {
    this.cityId = newCityId;
    this.cityName = newCityName;
  }
  resetCity() {
    this.cityId = null;
    this.cityName = null;
  }
  getCityId() {
    return this.cityId;
  }
  getCityName() {
    return this.cityName;
  }
  findCity(city) {
    const cities = (JSON.parse(this.allCities));
    const foundCity = cities.find((x) => {
      return x.name.toLowerCase() == city.toLowerCase();
    });

    if (foundCity) {
      this._updateCity(foundCity.id, foundCity.name);
    } 
    
    return foundCity;
  }
  getNewCityTemplate() { 
    return (`
🌆🏙

Your city is ${this.cityName}

Now you can see the weather in ${this.cityName} by pressing "Current Weather" button on the keyboard OR you can select some other city by pressing "Change City" button.
    `);
  }
}

module.exports = City;
