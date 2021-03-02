const TelegramBot = require('node-telegram-bot-api');
const City = require(`./city.js`);
const BaseRequest = require(`./model.js`);

const token = '1633059316:AAHoPknusYOkKzBGYGWkVVG3CKAATCtp9dg';

const bot = new TelegramBot(token, {polling: true});
let id = null;
const users = {};


bot.onText(/\/start/, (msg) => {
  if (users[msg.chat.id]) {
    bot.sendMessage(id, `The bot provides you with the following commands:\n/setCity - enter your city\n/now - get current weather`)
  }
  if (!users[msg.chat.id]) { 
    id = msg.chat.id;

    users[id] = {
      name: msg.from.first_name,
      currentCity: new City(),
      userid: id,
      authorised: true,
      isCitySelected: false,
      resetCountry() {
        this.isCitySelected = false,
        this.currentCity.resetCity();
      }
    };
    bot.sendMessage(id, `Hello, ${users[id].name}!`);
    returnSelectCityMessage(id);
  }
});

bot.on('message', (msg) => {
  const userMessage = msg.text;
  if (users[id] && !users[id].isCitySelected) {
    updateCurrentCity(userMessage);
  }
  switch(userMessage) {
    case `Current Weather`:
      getCurrentForecast();
      break;
    case `7 Days Forecast`:
      bot.sendMessage(id, `This feature is still under development..`);
      break;
    case `Change City`: 
      users[id].resetCountry();
      bot.sendMessage(id, `Changing City..`, {
        reply_markup: { 
          remove_keyboard: true
        }
      })
      returnSelectCityMessage(id);
      break;
  }
});


bot.on("polling_error", console.log);

bot.on(`callback_query`, query => {
  updateCurrentCity(query.data);
})

function updateCurrentCity(text) {
  const userText = text; 
  users[id].currentCity.findCity(userText);
  users[id].isCitySelected = true;

  returnMainKeyboard(id, `Your city is ${users[id].currentCity.cityName} ${users[id].currentCity.cityId}\nPlese use keyboard to interact with the bot.`);
}

function getCurrentForecast() {
  if (users[id].currentCity.getCityId()) {
    const model = new BaseRequest(users[id].currentCity.cityId);
    model.getCurrentWeather()
      .then(response => response.json())
      .then((data) => {
        console.log(data)
        const weatherTemp = model.transformWeatherData(data);
        bot.sendMessage(id, weatherTemp)
      })
  }
}

function returnMainKeyboard(chatId, message) {
  bot.sendMessage(chatId, message, {
    reply_markup: {
      keyboard: [
          [`Current Weather`, `7 Days Forecast`],
          [`Change City`]
      ]
    }
  })
}
function returnSelectCityMessage(chatId) {
  bot.sendMessage(chatId, `Enter your city below.`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `Saint Petersburg`,
            callback_data: `Saint Petersburg`
          },
          {
            text: `Moscow`,
            callback_data: `Moscow`
          }
        ],
        [
          {
            text: `Sochi`,
            callback_data: `Sochi`
          },
          {
            text: `Lisbon`,
            callback_data: `Lisbon`
          }
        ],
      ],
    }
  })
};