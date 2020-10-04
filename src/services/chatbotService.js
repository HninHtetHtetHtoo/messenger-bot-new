require("dotenv").config();

import request from 'request';
import homepageService from "./homepageService";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SECONDARY_RECEIVER_ID = process.env.SECONDARY_RECEIVER_ID;

let sendMessage = (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
       try {
           console.log("HHI")
           await homepageService.markMessageRead(sender_psid);
           await homepageService.sendTypingOn(sender_psid);

           // Construct the message body
           let request_body = {
               "recipient": {
                   "id": sender_psid
               },
               "message": response
           };

           console.log("req : ", request_body)

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
         console.log("Hi")
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
                                "title":"HeadPhones",
                                "image_url":"https://petersfancybrownhats.com/company_image.png",
                                "subtitle":"Boss Noise Cancelling Wireless Bluetooth HeadPhones",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://bit.ly/webHeadphones",
                                    "webview_height_ratio": "tall",
                                },
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://bit.ly/webHeadphones",
                                        "title":"View On Website"
                                    },{
                                        "type":"postback",
                                        "title":"Show HeadPhones",
                                        "payload":"SHOW_HEADPHONES"
                                    }
                                ]
                            },
                            {
                                "title":"TV",
                                "image_url":"https://bit.ly/imageTV",
                                "subtitle":"We have the right hat for everyone.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://bit.ly/webTelevision",
                                    "webview_height_ratio": "tall",
                                },
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://bit.ly/webTelevision",
                                        "title":"View On Website"
                                    },{
                                        "type":"postback",
                                        "title":"Show TVs",
                                        "payload":"SHOW_TV"
                                    }
                                ]
                            },
                            {
                                "title":"Playstation",
                                "image_url":"https://bit.ly/imagePlaystation",
                                "subtitle":"We have the right hat for everyone.",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://bit.ly/webPlaystation",
                                    "webview_height_ratio": "tall",
                                },
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":"https://bit.ly/webPlaystation",
                                        "title":"View On Website"
                                    },{
                                        "type":"postback",
                                        "title":"Show Playstation",
                                        "payload":"SHOW_PLAYSTATION"
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
    return new Promise(async (resolve, reject) => {
        try {
            //send a text message
            let response = {
                "text" : "Ok. Someone will be with you in a few minutes ^^"
            }

            await sendMessage(sender_psid, response)

            //change this conversation to page inbox
            await passThreadControl(sender_psid)

            resolve("DONE!")
        } catch (e){
            reject(e);
        }
    });
};

let showHeadphones = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            resolve("DONE!")
        } catch (e){
            reject(e);
        }
    });
};

let showTVs = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            resolve("DONE!")
        } catch (e){
            reject(e);
        }
    });
};

let showPlaystation = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {
            resolve("DONE!")
        } catch (e){
            reject(e);
        }
    });
};

let passThreadControl = (sender_psid) => {
    return new Promise((resolve, reject) => {
        try {

            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "target_app_id": SECONDARY_RECEIVER_ID,
                "metadata": "Pass thread control to inbox chat."
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": `https://graph.facebook.com/v6.0/me/pass_thread_control?access_token=${PAGE_ACCESS_TOKEN}`,
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

module.exports = {
    sendMessage: sendMessage,
    sendMessageWelcomeNewUser: sendMessageWelcomeNewUser,
    sendCategories: sendCategories,
    sendLookupOrder: sendLookupOrder,
    requestTalkToAgent: requestTalkToAgent,
    showHeadphones: showHeadphones,
    showTVs: showTVs,
    showPlaystation: showPlaystation
}
