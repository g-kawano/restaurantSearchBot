var Line = require('../line');
var Gurunavi = require('../gurunavi');
var Utils = require('./utils');
const querystring = require('querystring');


async function handleDefaultMessage(payload, callback) {

    var welcomemessage = JSON.stringify({
        replyToken: payload.replyToken,
        messages: [
            {
                type: "text", 
                text: "Please send location information"
            }
         ]
     });
    
    await Line.postMessage(welcomemessage);

    callback(null, "");

  }

  async function searchrestaurant(payload, callback) {
      
      var data = querystring.parse(payload.postback.data);
      
      var resultSet = await Gurunavi.getrestaurant(data.latitude,data.longitude,data.category_l);
      var messages = resultSet =="指定された条件の店舗が存在しません" 
      ?  [{
          type: "text", 
          text: "The shop was not found."
         }]
      : await Utils.buildCarouselMessages(resultSet.rest,data);
      
      var replayrestaurant = JSON.stringify({
          replyToken: payload.replyToken,
          messages
          
      });
      
      await Line.postMessage(replayrestaurant);
      
      callback(null, "");
      
  }


  async function handleLocationMessage(payload, callback) {
    try {

        var latitude = payload.message.latitude;
        var longitude = payload.message.longitude;
        
        const replymessage = JSON.stringify({
            replyToken: payload.replyToken,
            messages: [
                {
                    "type": "template",
                    "altText": "Please select a store category.",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "Japanese food",
                                "displayText": "Japanese food",
                                "data": `category_l=RSFST01000&latitude=${latitude}&longitude=${longitude}`
                                
                            },
                            {
                                "type": "postback",
                                "label": "Chinese cuisine",
                                "displayText": "Chinese cuisine",
                                "data": `category_l=RSFST14000&latitude=${latitude}&longitude=${longitude}`
                                
                            },
                            {
                                "type": "postback",
                                "label": "Western food",
                                "displayText": "Western food","data": `category_l=RSFST13000&latitude=${latitude}&longitude=${longitude}`
                                
                            },
                            {
                                "type": "postback",
                                "label": "Asian ethnic food",
                                "displayText": "Asian ethnic food",
                                "data": `category_l=RSFST15000&latitude=${latitude}&longitude=${longitude}`
                                
                            }
                            ],
                            "title": "store category",
                            "text": "Please select a store category."
                    }
                }
            ]
        });
    
    await Line.postMessage(replymessage);
    
    callback(null,"");

    }
    catch (error) {
        return callback(new Error(error.message));
      }
    }

exports.enApp = async (event, context, callback) => {
    const payload = event.events[0];

    switch (payload.type){
        case 'message':
            if (payload.message.type === 'location') {
                await handleLocationMessage(payload, callback);
                
            }else{
                await handleDefaultMessage(payload, callback);
            }
            
        case 'postback':
            await searchrestaurant(payload, callback);
    }
  };
