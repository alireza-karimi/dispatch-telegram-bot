function getOrderBikerName(messageId, event) {

  var spreadsheetUrl = 'YOUR_LOGS_SHEET_ADDRESS'; // Replace with the URL of your spreadsheet
  var notificationsSheetName = 'COD Events'; // Replace with the name of your sheet containing notifications data
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = spreadsheet.getSheetByName(notificationsSheetName);
  var messageIds = sheet.getRange("U:U").getValues().flat().map(String);
  var events = sheet.getRange("S:S").getValues().flat().map(String);
  var usernames = sheet.getRange("W:W").getValues().flat();
  for (var i = 0; i < messageIds.length; i++) {
    if (String(messageIds[i]).trim() === String(messageId).trim() && events[i].toLowerCase() === event.toLowerCase()) {
      return usernames[i];
    }
  }
  
  return null;
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


// Function to send a Telegram message with a button
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

  return UrlFetchApp.fetch(apiUrl, payload);
}

// Function to edit a Telegram message
function editTelegramMessageWithButton(chatId, messageId, message, buttonText, callbackData) {
  var botToken = 'YOUR_TOKEN_GOES_HERE'; // Replace with your Telegram bot token
  var apiUrl = 'https://api.telegram.org/bot' + botToken + '/editMessageText';

  var payload = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
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


  try {
    UrlFetchApp.fetch(apiUrl, payload);
  } catch (e) {
    // Log the error or perform any other action you want
    return ['Error editing Telegram message: ' + e, 400]
  }

  return ['Data Edited in Bot', 200]
}

function editTelegramMessageText(chatId, messageId, newText) {
  var botToken = 'YOUR_TOKEN_GOES_HERE'; // Replace with your Telegram bot token
  var apiUrl = 'https://api.telegram.org/bot' + botToken + '/editMessageText';

  // Get the current inline keyboard data
  var bikerUserName = getOrderBikerName(messageId, 'take_order_button_clicked');
  if (bikerUserName) {
    buttonText = bikerUserName + " took this order 🏍️"
    callbackData = 'disabled'
  }
  else {
    buttonText = 'Take This Order 🤠'
    callbackData = 'take_order_button_clicked'
  }

  var payload = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: newText,
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

  try {
    UrlFetchApp.fetch(apiUrl, payload);
  } catch (e) {
    // Log the error or perform any other action you want
    return ['Error editing Telegram message: ' + e, 400]
  }

  return ['Data Edited in Bot', 200]
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


function test() {
  // console.log(getTelegramMessage('-756327219', 150));
  // console.log(getOrderBikerName('156', 'take_order_button_clicked'))
  console.log(updateBikerDirectMessageWithNewOrderDetails(1233434345, 'message'))
}


function updateEventsWithNewOrderDetails(orderId, customerName, agent, phoneNumber1, phoneNumber2, price, currency, serviceType, address, ServiceDate, description, locationUrl, linkedOrder1Id, linkedOrder1Price, linkedOrder2Id, linkedOrder2Price) {

  var spreadsheetUrl = 'YOUR_LOGS_SHEET_ADDRESS'; // Replace with the URL of your spreadsheet
  var notificationsSheetName = 'COD Events'; // Replace with the name of your sheet containing notifications data
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = spreadsheet.getSheetByName(notificationsSheetName);

  var orderIds = sheet.getRange("D:D").getValues().flat().map(function(value) {
    return String(value).trim(); // Convert to string and remove leading/trailing whitespaces
  });


  for (var i = 0; i < orderIds.length; i++) {
    if (String(orderIds[i]).trim() === String(orderId).trim()) {
      var rowToUpdate = i + 1;
      sheet.getRange(rowToUpdate, 3).setValue(customerName);
      sheet.getRange(rowToUpdate, 5).setValue(agent);
      sheet.getRange(rowToUpdate, 6).setValue("https://wa.me/" + phoneNumber1);
      sheet.getRange(rowToUpdate, 7).setValue("https://wa.me/" + phoneNumber2);
      sheet.getRange(rowToUpdate, 8).setValue(price + " " + currency);
      sheet.getRange(rowToUpdate, 9).setValue(currency);
      sheet.getRange(rowToUpdate, 10).setValue(serviceType);
      sheet.getRange(rowToUpdate, 11).setValue(address);
      sheet.getRange(rowToUpdate, 12).setValue(ServiceDate);
      sheet.getRange(rowToUpdate, 13).setValue(description);
      sheet.getRange(rowToUpdate, 14).setValue(locationUrl);
      sheet.getRange(rowToUpdate, 15).setValue(linkedOrder1Id);
      sheet.getRange(rowToUpdate, 16).setValue(linkedOrder1Price);
      sheet.getRange(rowToUpdate, 17).setValue(linkedOrder2Id);
      sheet.getRange(rowToUpdate, 18).setValue(linkedOrder2Price);
    }
  }
}


function updateBikerDirectMessageWithNewOrderDetails(orderId, messageText) {
  var spreadsheetUrl = 'YOUR_LOGS_SHEET_ADDRESS'; // Replace with the URL of your spreadsheet
  var notificationsSheetName = 'COD Events'; // Replace with the name of your sheet containing notifications data
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = spreadsheet.getSheetByName(notificationsSheetName);
  var messageId = 0

  var orderIds = sheet.getRange("D:D").getValues().flat().map(function(value) {
    return String(value).trim(); // Convert to string and remove leading/trailing whitespaces
  });
  console.log(orderIds)
  // Find the index of the input orderId
  var index = orderIds.indexOf(String(orderId).trim());
  console.log(index)
  if (index !== -1) {
    var events = sheet.getRange("S:S").getValues().flat().map(String);
    var followedMessageIds = sheet.getRange("X:X").getValues().flat();
    var userIds = sheet.getRange("V:V").getValues().flat();
    var events = sheet.getRange("S:S").getValues().flat();
    // Iterate over all rows with the input orderId
    for (var i = 0; i < orderIds.length; i++) {
      if (String(orderIds[i]).trim() === String(orderId).trim() && events[i] === 'take_order_button_clicked') {
        messageId = followedMessageIds[i]
        chatId = userIds[i]
        break;
      }
    }
    for (var i = 0; i < orderIds.length; i++) {
      if (String(orderIds[i]).trim() === String(orderId).trim()) {
        type = events[i] // getting the last type
      }
    }


    // Updating message in biker direct

    if(type == 'take_order_button_clicked') {
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
      editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
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
    }
    else if(type == 'customer_rejects_address'){
      buttonsArray = [
        [{
          text: 'Ok, Thanks ❤️ No Further Action',
          callback_data: 'disabled'
        }]
      ]
      editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
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
    }
    else if(type == 'customer_refuse_to_pay') {
      buttonsArray = [
        [{
          text: 'Ok, Thanks ❤️ No Further Action',
          callback_data: 'disabled'
        }]
      ]
      editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    }
    else if(type == 'money_deposit_office') {
      buttonsArray = [
        [{
          text: 'Thanks ❤️ Done!',
          callback_data: 'disabled'
        }]
      ]
      editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    }
    else if(type == 'money_deposit_bank') {
      buttonsArray = [
        [{
          text: 'Thanks ❤️ Done!',
          callback_data: 'disabled'
        }]
      ]
      editMessageWithMultipleButtons(chatId, messageId, messageText, buttonsArray)
    }

  }

}


function doPost(e) {
  // Retrieve data from the request
  var data = JSON.parse(e.postData.contents);

  // Extract the required information from the request
  var customerName = data.customer_name;
  var orderId = data.order_id;
  var agent = data.agent
  var phoneNumber1 = data.phone_number1;
  var phoneNumber2 = data.phone_number2;
  var price = data.price;
  var currency = data.currency;
  var serviceType = data.serviceType;
  var address = data.address;
  var serviceDate = data.service_date;
  var description = data.description;
  var locationUrl = data.location_url;
  var linkedOrder1Id = data.linked_order_1_id;
  var linkedOrder1Price = data.linked_order_1_price;
  var linkedOrder2Id = data.linked_order_2_id;
  var linkedOrder2Price = data.linked_order_2_price;

  var timestamp = new Date();
  var time = timestamp.toLocaleTimeString();
  var timezone = Session.getScriptTimeZone();

  // Store the information in a Google Sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("COD Requests"); // Replace with the actual sheet name

  // Check if the order ID already exists in the sheet
  var orderIds = sheet.getRange("D:D").getValues().flat().map(function(value) {
    return String(value).trim(); // Convert to string and remove leading/trailing whitespaces
  });
  var formattedOrderId = String(orderId).trim(); // Convert to string and remove leading/trailing whitespaces
  var orderIndex = orderIds.indexOf(formattedOrderId);

  // Send a new message in Telegram
    var message = "New order received:\n" +
      "Customer Name: " + customerName + "\n" +
      "Order ID: " + orderId + "\n" +
      "Agent: " + agent + "\n" + 
      "Phone Number 1: https://wa.me/" + phoneNumber1 + "\n" +
      "Phone Number 2: https://wa.me/" + phoneNumber2 + "\n" +
      "Price: " + price + " " + currency + "\n" +
      "Type: " + serviceType + "\n" +
      "Address: " + address + "\n" +
      "Service Date: " + serviceDate + "\n" +
      "Description: " + description + "\n" +
      "Location URL: " + locationUrl + "\n" +
      "Linked Order 1 ID: " + linkedOrder1Id + "\n" +
      "Linked Order 1 Price: " + linkedOrder1Price + "\n" +
      "Linked Order 2 ID: " + linkedOrder2Id + "\n" +
      "Linked Order 2 Price: " + linkedOrder2Price;

  if (orderIndex === -1) {

    var response = sendTelegramMessageWithButton('-756327219', message, 'Take This Order 🤠', 'take_order_button_clicked');
    var responseData = JSON.parse(response.getContentText());
    var messageId = responseData.result.message_id;

    sheet.appendRow([time, timezone, customerName, orderId, agent, phoneNumber1, phoneNumber2, price, currency, serviceType, address, serviceDate, description, locationUrl, linkedOrder1Id, linkedOrder1Price, linkedOrder2Id, linkedOrder2Price, messageId]);

    // Return the JSON response with a 200 status code
    var response = {
      status: "success",
      message: "Data Added in Bot"
    };
    var jsonResponse = JSON.stringify(response);
    return ContentService.createTextOutput(jsonResponse).setMimeType(ContentService.MimeType.JSON);
    
  } else {
    
    // Order ID already exists, retrieve the messageId from the sheet and edit the previous message in Telegram
    var messageId = sheet.getRange(orderIndex + 1, 19).getValue();
    var telegramResponse = editTelegramMessageText('-756327219', messageId, message);
    var telegramResponseMessage = telegramResponse[0];
    var telegramResponseCode = telegramResponse[1];

    if(telegramResponseCode == 200) {

      // Update the data in the sheet
      var rowToUpdate = orderIndex + 1;
      sheet.getRange(rowToUpdate, 3).setValue(customerName);
      sheet.getRange(rowToUpdate, 5).setValue(agent);
      sheet.getRange(rowToUpdate, 6).setValue(phoneNumber1);
      sheet.getRange(rowToUpdate, 7).setValue(phoneNumber2);
      sheet.getRange(rowToUpdate, 8).setValue(price);
      sheet.getRange(rowToUpdate, 9).setValue(currency);
      sheet.getRange(rowToUpdate, 10).setValue(serviceType);
      sheet.getRange(rowToUpdate, 11).setValue(address);
      sheet.getRange(rowToUpdate, 12).setValue(serviceDate);
      sheet.getRange(rowToUpdate, 13).setValue(description);
      sheet.getRange(rowToUpdate, 14).setValue(locationUrl);
      sheet.getRange(rowToUpdate, 15).setValue(linkedOrder1Id);
      sheet.getRange(rowToUpdate, 16).setValue(linkedOrder1Price);
      sheet.getRange(rowToUpdate, 17).setValue(linkedOrder2Id);
      sheet.getRange(rowToUpdate, 18).setValue(linkedOrder2Price);


      // Check if a notification needs to be sent
      var event = 'take_order_button_clicked';
      var spreadsheetUrl = 'YOUR_LOGS_SHEET_ADDRESS'; // Replace with the URL of your spreadsheet
      var notificationsSheetName = 'COD Events'; // Replace with the name of your sheet containing notifications data
      var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
      var notificationsSheet = spreadsheet.getSheetByName(notificationsSheetName);
      var notificationsData = notificationsSheet.getDataRange().getValues();
      for (var i = 1; i < notificationsData.length; i++) {
        var orderIdInNotification = String(notificationsData[i][3]).trim(); // Assuming orderId is in column D
        var eventInNotification = String(notificationsData[i][18]).trim(); // Assuming event type is in column Q
        var userId = String(notificationsData[i][21]).trim(); // Assuming userId is in column V
        if (orderIdInNotification === String(orderId).trim() && eventInNotification === event) {
          // Send a notification to the user specified in the userId column
          var notificationMessage = "The order with ID " + orderId + " has been edited.";
          sendTelegramMessage(userId, notificationMessage);

          // Updating all data in events sheet
          updateEventsWithNewOrderDetails(orderId, customerName, agent, phoneNumber1, phoneNumber2, price, currency, serviceType, address, serviceDate, description, locationUrl, linkedOrder1Id, linkedOrder1Price, linkedOrder2Id, linkedOrder2Price)

          // Updating biker direct message with new order details
          updateBikerDirectMessageWithNewOrderDetails(orderId, message)

          break;
        }
      }

      // Return the JSON response with a 200 status code
      var response = {
        status: "success",
        message: telegramResponseMessage
      };
      var jsonResponse = JSON.stringify(response);
      return ContentService.createTextOutput(jsonResponse).setMimeType(ContentService.MimeType.JSON);
    }
    else {
      // Return the JSON response with a 400 status code
      var response = {
        status: "failed",
        message: telegramResponseMessage
      };
      var jsonResponse = JSON.stringify(response);
      return ContentService.createTextOutput(jsonResponse).setMimeType(ContentService.MimeType.JSON);
    }
    

  }

}



