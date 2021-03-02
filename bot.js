const TelegramBot = require('node-telegram-bot-api');
const City = require(`./objects/city.js`);
const BaseRequest = require(`./objects/model.js`);

const token = '1553846304:AAG7_a8z0xrEIkaYJ6HiU5Tmqr1wbLuBUFk';

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
  const foundCity = users[id].currentCity.findCity(userText);
  
  if (foundCity) {
    users[id].isCitySelected = true;
    returnMainKeyboard(id, users[id].currentCity.getNewCityTemplate());
  } else {
    bot.sendMessage(id, `The city is not found, please try another one...`);
  }
  
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
          [`Current Weather`, `Change City`]
      ]
    }
  })
}
function returnSelectCityMessage(chatId) {
  bot.sendMessage(chatId, `Please, select your city.

You can use the keyboard below for this or you can just type any city and I'll try to find it for you.

For example, try "New York".`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `Saint Petersburg`,
            callback_data: `Saint Petersburg`
          },
          {
            text: `Berlin`,
            callback_data: `Berlin`
          },
          {
            text: `Lisbon`,
            callback_data: `Lisbon`
          }
        ],
        [
          {
            text: `Paris`,
            callback_data: `Paris`
          },
          {
            text: `London`,
            callback_data: `London`
          },
          {
            text: `Sochi`,
            callback_data: `Sochi`
          }
        ],
      ],
    }
  })
};