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
      return x.name.toLowerCase() == city.toLowerCase() || x.name.toLowerCase().includes(city.toLowerCase());
    });
    this._updateCity(foundCity.id, foundCity.name);
    console.log(this.cityName);
    
  }
}

module.exports = City;
