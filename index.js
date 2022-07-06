// const fetch = require('node-fetch');
import "dotenv/config";
import fetch from "node-fetch";
import twilio from "twilio";

const FROM_DATE = '2022-07-08T00:00'
const TO_DATE = '2022-07-18T00:00'
const FROM_PHONE_NUMBER = process.env.FROM_PHONE_NUMBER;
const TO_PHONE_NUMBER = process.env.TO_PHONE_NUMBER;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {

  while (true) {
    let response = await fetch(
      `https://api.waitwhile.com/v2/public/visits/gtaapassoffice/first-available-slots?fromDate=${FROM_DATE}&toDate=${TO_DATE}&maxNumSlots=150`
    );
    let responseJson = await response.json();
    console.log(new Date(), responseJson);
    if (responseJson.length > 0) {
      let msg = "found gtaa dates: ";
      for (let obj of responseJson) {
        console.log(obj.date);
        msg += ` ${obj.date}`;
      }
      msg += ` https://waitwhile.com/welcome/gtaapassoffice`
      let message = await client.messages.create({
        body: msg,
        from: FROM_PHONE_NUMBER,
        to: TO_PHONE_NUMBER,
      });
      console.log(message.sid);
      
      process.exit()
    }
    await sleep(5000);
  }
})();
