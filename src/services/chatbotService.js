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
         let userName = await homepageService.getFacebookUserName(sender_psid);

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

let sendCategories = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            //send a generic template message
            let response = {
                "attachment":{
                    "type":"template",
                    "payload":{
                        "template_type":"generic",
                        "elements":[
                            {
                                "title":"Welcome!",
                                "image_url":"https://petersfancybrownhats.com/company_image.png",
                                "subtitle":"We have the right hat for everyone.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com/view?item=103",
                                    "webview_height_ratio": "tall",
                                },
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://petersfancybrownhats.com",
                                        "title":"View Website"
                                    },{
                                        "type":"postback",
                                        "title":"Start Chatting",
                                        "payload":"DEVELOPER_DEFINED_PAYLOAD"
                                    }
                                ]
                            },
                            {
                                "title":"Welcome 1!",
                                "image_url":"https://petersfancybrownhats.com/company_image.png",
                                "subtitle":"We have the right hat for everyone.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com/view?item=103",
                                    "webview_height_ratio": "tall",
                                },
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://petersfancybrownhats.com",
                                        "title":"View Website"
                                    },{
                                        "type":"postback",
                                        "title":"Start Chatting",
                                        "payload":"DEVELOPER_DEFINED_PAYLOAD"
                                    }
                                ]
                            },
                            {
                                "title":"Welcome 2!",
                                "image_url":"https://petersfancybrownhats.com/company_image.png",
                                "subtitle":"We have the right hat for everyone.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com/view?item=103",
                                    "webview_height_ratio": "tall",
                                },
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://petersfancybrownhats.com",
                                        "title":"View Website"
                                    },{
                                        "type":"postback",
                                        "title":"Start Chatting",
                                        "payload":"DEVELOPER_DEFINED_PAYLOAD"
                                    }
                                ]
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("DONE!");

        } catch (e){
            reject(e);
        }
    });
};

let sendLookupOrder = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            resolve("DONE!")
        } catch (e){
            reject(e);
        }
    });
};

let requestTalkToAgent = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            resolve("DONE!")
        } catch (e){
            reject(e);
        }
    });
};

module.exports = {
    sendMessage: sendMessage,
    sendMessageWelcomeNewUser: sendMessageWelcomeNewUser,
    sendCategories: sendCategories,
    sendLookupOrder: sendLookupOrder,
    requestTalkToAgent: requestTalkToAgent
}
