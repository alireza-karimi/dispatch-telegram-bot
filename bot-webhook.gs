//// ####### ////
// Webhook Related Stuff

function getWebhookInfo() {
  var botToken = 'YOUR_TOKEN_GOES_HERE'; // Replace with your Telegram bot token

  var apiUrl = 'https://api.telegram.org/bot' + botToken + '/getWebhookInfo';

  var response = UrlFetchApp.fetch(apiUrl);
  var responseData = JSON.parse(response.getContentText());

  if (responseData.ok) {
    // Success, log the webhook info
    Logger.log('Webhook URL: ' + responseData.result.url);
    Logger.log('Has Custom Certificate: ' + responseData.result.has_custom_certificate);
    Logger.log('Pending Update Count: ' + responseData.result.pending_update_count);
    Logger.log('Max Connections: ' + responseData.result.max_connections);
  } else {
    // Failed, log the error
    Logger.log('Failed to get webhook info: ' + responseData.description);
  }
}


function setWebhook() {
  var botToken = 'YOUR_TOKEN_GOES_HERE'; // Replace with your Telegram bot token
  var webhookUrl = 'WEBHOOK_ENDPOINT_URL'; // Replace with your desired webhook URL

  var apiUrl = 'https://api.telegram.org/bot' + botToken + '/setWebhook?url=' + webhookUrl;
  var payload = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message', 'callback_query', 'inline_query'] // Include the types of updates you want to handle
    })
  };
  var response = UrlFetchApp.fetch(apiUrl, payload);

  // Check the response to ensure the webhook was set successfully
  var responseData = JSON.parse(response.getContentText());
  if (responseData.ok) {
    Logger.log('Webhook set successfully.');
  } else {
    Logger.log('Failed to set webhook: ' + responseData.description);
  }
}



//// ####### ////
// Send message in Telegram

function sendStickerInTelegram(chat_id, file_id) {

  var payload = JSON.stringify({
    'chat_id': chat_id,
    'sticker': file_id
  })

  var headers = {
    'content-type': 'application/json'
  }

  var requestOptions = {
      'method': 'POST',
      'payload': payload,
      'headers': headers
  };

  var token = 'YOUR_TOKEN_GOES_HERE';
  var telegramUrl = 'https://api.telegram.org/bot' + token + '/sendSticker';
  UrlFetchApp.fetch(telegramUrl, requestOptions);
}


function sendTelegramMessage(chatId, message) {
  var botToken = 'YOUR_TOKEN_GOES_HERE'; // Replace with your Telegram bot token
  var apiUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage';

  var payload = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  };

  UrlFetchApp.fetch(apiUrl, payload);
}


function sendTelegramMessageWithButton(chatId, message, buttonText, callbackData) {
  var botToken = 'YOUR_TOKEN_GOES_HERE'; // Replace with your Telegram bot token
  var apiUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage';

  var payload = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: message,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: buttonText,
              callback_data: callbackData
            }
          ]
        ]
      }
    })
  };

  UrlFetchApp.fetch(apiUrl, payload);
}


function sendTelegramMessageWithMultipleButtons(chatId, message, buttonsArray) {
  var botToken = 'YOUR_TOKEN_GOES_HERE'; // Replace with your Telegram bot token
  var apiUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage';

  var payload = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      text: message,
      reply_markup: {
        inline_keyboard: buttonsArray
      }
    })
  };

  return UrlFetchApp.fetch(apiUrl, payload);
}



//// ####### ////
// Edit message in Telegram


// Function to edit the button text in the original group message using the Telegram Bot API
function editButtonInGroupMessage(chatId, messageId, messageText, buttonText, callbackData) {
  var apiUrl = 'https://api.telegram.org/bot' + 'YOUR_TOKEN_GOES_HERE' + '/editMessageText';
  var payload = {
    chat_id: chatId,
    message_id: messageId,
    text: messageText,
    reply_markup: {
      inline_keyboard: [[{ text: buttonText, callback_data: callbackData }]],
    },
  };
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(apiUrl, options);
}

function editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray) {
  var apiUrl = 'https://api.telegram.org/bot' + 'YOUR_TOKEN_GOES_HERE' + '/editMessageText';
  var payload = {
    chat_id: chatId,
    message_id: messageId,
    text: messageText,
    reply_markup: {
      inline_keyboard: buttonsArray
    }
  };
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(apiUrl, options);
}


//// ####### ////
// Adding data to sheet

function addEventToSheet(message, event, chatId, messageId, userId, username, followedMessageId) {

  var timestamp = new Date();
  var time = timestamp.toLocaleTimeString();
  var timezone = Session.getScriptTimeZone();

  var customerName = message.match(/Customer Name: (.+)$/m)?.[1];
  var orderId = message.match(/Order ID: (.+)$/m)?.[1];
  var agent = message.match(/Agent: (.+)$/m)?.[1];
  var phoneNumber1 = message.match(/Phone Number 1: (.+)$/m)?.[1];
  var phoneNumber2 = message.match(/Phone Number 2: (.+)$/m)?.[1];
  var price = message.match(/Price: (.+)$/m)?.[1];
  var currency = price ? price.match(/(\w+)$/)[1] : '';
  var type = message.match(/Type: (.+)$/m)?.[1];
  var address = message.match(/Address: (.+)$/m)?.[1];
  var serviceDate = message.match(/Service Date: (.+)$/m)?.[1];
  var description = message.match(/Description: (.+)$/m)?.[1];
  var locationUrl = message.match(/Location URL: (.+)$/m)?.[1];
  var linkedOrder1Id = message.match(/Linked Order 1 ID: (.+)$/m)?.[1];
  var linkedOrder1Price = message.match(/Linked Order 1 Price: (.+)$/m)?.[1];
  var linkedOrder2Id = message.match(/Linked Order 2 ID: (.+)$/m)?.[1];
  var linkedOrder2Price = message.match(/Linked Order 2 Price: (.+)$/m)?.[1];

  // Store the information in a Google Sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("COD Events"); // Replace with the actual sheet name
  sheet.appendRow([time, timezone, customerName, orderId, agent, phoneNumber1, phoneNumber2, price, currency, type, address, serviceDate, description, locationUrl, linkedOrder1Id, linkedOrder1Price, linkedOrder2Id, linkedOrder2Price, event, chatId, messageId, userId, username, followedMessageId])

}


//// ####### ////
// Telegram Webhook Endpoint

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  // Check the update type
  if (data.message) {
    // Handle incoming messages
    handleMessage(data.message);
  } else if (data.callback_query) {
    // Handle button clicks (callback queries)
    handleCallbackQuery(data.callback_query);
  } else if (data.inline_query) {
    // Handle inline queries
    handleInlineQuery(data.inline_query);
  }

  // Return a 200 status code to acknowledge the webhook request
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setStatusCode(200);
}

function handleMessage(message) {
  // Your logic to handle incoming messages goes here

}

function handleCallbackQuery(callbackQuery) {

  // Your logic to handle button clicks (callback queries) goes here
  var chatId = callbackQuery.message.chat.id;
  var messageId = callbackQuery.message.message_id;
  var type = callbackQuery.data
  var userId = callbackQuery.from.id;
  var username = callbackQuery.from.username || "Unknown User";
  var messageText = callbackQuery.message.text

  if(type == 'take_order_button_clicked') {
    editButtonInGroupMessage(chatId, messageId, messageText, username + " took this order 🏍️", 'disabled')
    buttonsArray = [
      [{
        text: 'Customer Confirms Address ✅',
        callback_data: 'customer_confirms_address'
      }],
      [{
        text: 'Customer Rejects Address ❌',
        callback_data: 'customer_rejects_address'
      }]
    ]
    var response = sendTelegramMessageWithMultipleButtons(userId, messageText, buttonsArray);
    var responseData = JSON.parse(response.getContentText());
    var followedMessageId = responseData.result.message_id;
    addEventToSheet(messageText, type, chatId, messageId, userId, username, followedMessageId)
  }
  else if(type == 'customer_confirms_address'){
    buttonsArray = [
      [{
        text: 'Money Collected 💰',
        callback_data: 'money_collected'
      }],
      [{
        text: 'Customer Refused to Pay ❌',
        callback_data: 'customer_refuse_to_pay'
      }]
    ]
    editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    addEventToSheet(messageText, type, chatId, messageId, userId, username, messageId)
  }
  else if(type == 'customer_rejects_address'){
    buttonsArray = [
      [{
        text: 'Ok, Thanks ❤️ No Further Action',
        callback_data: 'disabled'
      }]
    ]
    editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    addEventToSheet(messageText, type, chatId, messageId, userId, username, messageId)
  }
  else if(type == 'money_collected') {
    buttonsArray = [
      [{
        text: 'Money Deposit in Office 🏢',
        callback_data: 'money_deposit_office'
      }],
      [{
        text: 'Money Deposit in Bank 🏦',
        callback_data: 'money_deposit_bank'
      }]
    ]
    editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    addEventToSheet(messageText, type, chatId, messageId, userId, username, messageId)
  }
  else if(type == 'customer_refuse_to_pay') {
    buttonsArray = [
      [{
        text: 'Ok, Thanks ❤️ No Further Action',
        callback_data: 'disabled'
      }]
    ]
    editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    addEventToSheet(messageText, type, chatId, messageId, userId, username, messageId)
  }
  else if(type == 'money_deposit_office') {
    buttonsArray = [
      [{
        text: 'Thanks ❤️ Done!',
        callback_data: 'disabled'
      }]
    ]
    editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    addEventToSheet(messageText, type, chatId, messageId, userId, username, messageId)
  }
  else if(type == 'money_deposit_bank') {
    buttonsArray = [
      [{
        text: 'Thanks ❤️ Done!',
        callback_data: 'disabled'
      }]
    ]
    editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    addEventToSheet(messageText, type, chatId, messageId, userId, username, messageId)
  }
  
}

function handleInlineQuery(inlineQuery) {
  // Your logic to handle inline queries goes here
  // Inline queries are when users type your bot's username in a chat and send a query
  // The bot can respond with inline results in the chat
}


