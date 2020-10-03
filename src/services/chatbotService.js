require("dotenv").config();

import request from 'request';
import homepageService from "./homepageService";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let sendMessage = (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
       try {
           await homepageService.markMessageRead(sender_psid);
           await homepageService.sendTypingOn(sender_psid);

           // Construct the message body
           let request_body = {
               "recipient": {
                   "id": sender_psid
               },
               "message": response
           };

           // Send the HTTP request to the Messenger Platform
           request({
               "uri": "https://graph.facebook.com/v6.0/me/messages",
               "qs": { "access_token": PAGE_ACCESS_TOKEN },
               "method": "POST",
               "json": request_body
           }, (err, res, body) => {
               if (!err) {
                   resolve('message sent!')
               } else {
                   reject("Unable to send message:" + err);
               }
           });
       }catch (e){
           reject(e);
       }
    });
};

let sendMessageWelcomeNewUser = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
     try {
         let userName = homepageService.getFacebookUserName(sender_psid);

         //send text msg
         let responseText = {
             "text" : `Hi ${userName}! Welcome to MyBuy store. I'm a MyBuy chatbot. May I help you?`
         };

         //send image
         let responseImage = {
             "attachment": {
                 "type": "image",
                 "payload":{
                     "url": "https://i.pinimg.com/originals/8c/9a/07/8c9a079986a4ce112882fea6db3ffdee.gif"
                 }
             }
         };

         let responseText2 = {
             "text" : "Please use the menu below to navigate through the features."
         };

         //add quick reply
         let responseQuickReply = {
             "text": "What can I do to help you?",
             "quick_replies":[
                 {
                     "content_type":"text",
                     "title":"Categories",
                     "payload":"CATEGORIES",
                 },
                 {
                     "content_type":"text",
                     "title":"Lookup Order",
                     "payload":"LOOKUP_ORDER",
                 },
                 {
                     "content_type":"text",
                     "title":"Talk to an agent",
                     "payload":"TALK_AGENT",
                 }
             ]
         }

         await sendMessage(sender_psid, responseText);
         await sendMessage(sender_psid, responseImage);
         await sendMessage(sender_psid, responseText2);
         await sendMessage(sender_psid, responseQuickReply);
         resolve("DONE!")

     }catch (e) {
         reject(e);
     }
  });
};

module.exports = {
    sendMessage: sendMessage,
    sendMessageWelcomeNewUser: sendMessageWelcomeNewUser
}
