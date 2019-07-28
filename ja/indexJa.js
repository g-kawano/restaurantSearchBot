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
                text: "位置情報を送信してね！"
            }
         ]
     });
    
    await Line.postMessage(welcomemessage);

    callback(null, "");

  }

  async function searchrestaurant(payload, callback) {
      
      var data = querystring.parse(payload.postback.data);
      
      
      var resultSet = await Gurunavi.getrestaurant(data.latitude,data.longitude,data.category_l);
      console.log(resultSet);
      
      var messages = resultSet =="指定された条件の店舗が存在しません" 
      ?  [{
          type: "text", 
          text: "近くにお探しのお店は見つかりませんでした。"
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
                    "altText": "店のカテゴリを選んでください。",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "和食",
                                "displayText": "和食",
                                "data": `category_l=RSFST01000&latitude=${latitude}&longitude=${longitude}`
                                
                            },
                            {
                                "type": "postback",
                                "label": "中華",
                                "displayText": "中華",
                                "data": `category_l=RSFST14000&latitude=${latitude}&longitude=${longitude}`
                                
                            },
                            {
                                "type": "postback",
                                "label": "洋食",
                                "displayText": "洋食",
                                "data": `category_l=RSFST13000&latitude=${latitude}&longitude=${longitude}`
                                
                            },
                            {
                                "type": "postback",
                                "label": "アジア・エスニック料理",
                                "displayText": "アジア・エスニック料理",
                                "data": `category_l=RSFST15000&latitude=${latitude}&longitude=${longitude}`
                                
                            }
                            ],
                            "title": "店のカテゴリ",
                            "text": "店のカテゴリを選んでください"
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

exports.jaApp = async (event, context, callback) => {
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
