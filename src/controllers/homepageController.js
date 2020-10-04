require("dotenv").config();

import homepageService from '../services/homepageService';
import chatbotService from '../services/chatbotService';

const MY_VERIFY_FB_TOKEN = process.env.MY_VERIFY_FB_TOKEN;

let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};

let postWebhook = (req, res) =>{
    let body = req.body;

    console.log("Hooo")
    console.log("body : ", body, body.object)

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        console.log("Hi")
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            console.log("For Each!!")

            //check the incoming message from primary app or not; if secondary app, exit
            if (entry.standby) {
                let webhook_standby = entry.standby[0];
                if (webhook_standby && webhook_standby.message){
                    if (webhook_standby.message.text === "back" || webhook_standby.message.text === "exit"){
                        console.log("----------------");
                        console.log("sender_id ::::: ",webhook_standby.sender.id);
                        console.log("----------------");
                        //call function to the conversation to the primary app
                        //chatbotService.passThreadControl(sender_psid, "primary");
                    }
                }
                return;
            } ;

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                console.log("handle message")
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                console.log("handle post back")
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_FB_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

// Handles messages events
let handleMessage = async (sender_psid, received_message) => {

    //check the incoming message is a quick reply or not.
    if (received_message && received_message.quick_reply && received_message.quick_reply.payload){
        let payload = received_message.quick_reply.payload

        if (payload === "CATEGORIES") {
            await chatbotService.sendCategories(sender_psid);

        } else if (payload === "LOOKUP_ORDER") {
            await chatbotService.sendLookupOrder(sender_psid);

        } else if (payload === "TALK_AGENT") {
            await chatbotService.requestTalkToAgent(sender_psid);

        }

        return;
    }

    let response;

    // Check if the message contains text
    if (received_message.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Sends the response message
    await chatbotService.sendMessage(sender_psid, response);
};

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {

    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    switch (payload){

        case "GET_STARTED":
        case "RESTART_CONVERSATION":
            await chatbotService.sendMessageWelcomeNewUser(sender_psid);
            break;

        case "TALK_AGENT":
            await chatbotService.requestTalkToAgent(sender_psid);
            break;

        case "SHOW_HEADPHONES":
            await chatbotService.showHeadphones(sender_psid);
            break;

        case "SHOW_TV":
            await chatbotService.showTVs(sender_psid);
            break;

        case "SHOW_PLAYSTATION":
            await chatbotService.showPlaystation(sender_psid);
            break;

        case "CATEGORIES":
            await chatbotService.sendCategories(sender_psid);
            break;

        default:
            console.log("run default switch case.")
    }

    // Send the message to acknowledge the postback
    await chatbotService.sendMessage(sender_psid, response);
};

/*
// Sends response messages via the Send API
let callSendAPI = async (sender_psid, response) => {

    /!*await homepageService.markMessageRead(sender_psid);
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
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });*!/
};
*/

let handleSetupProfile = async (req, res) => {
    try {
        await homepageService.handleSetupProfileAPI();
        return res.redirect("/");
    }catch (e){
        console.log(e);
    }
};

let getSetupProfilePage = (req, res) => {
    return res.render("profile.ejs");
};

module.exports = {
    getHomepage: getHomepage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    handleSetupProfile: handleSetupProfile,
    getSetupProfilePage: getSetupProfilePage
};