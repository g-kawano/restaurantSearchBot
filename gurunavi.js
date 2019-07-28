var request = require('request-promise');


const GURUNAVI_API_ENDPOINT = 'https://api.gnavi.co.jp/RestSearchAPI/v3/';

exports.getrestaurant = async function(latitude,longitude,category_l){
        try{
            var options = {
                uri: GURUNAVI_API_ENDPOINT,
                qs: {
                    keyid: process.env.API_KEY,
                    category_l: category_l,
                    latitude: latitude,
                    longitude: longitude,
                    hit_per_page:3
                },
                headers: {
                    'Content-type': 'application/json'
                },
                json: true // Automatically parses the JSON string in the response
            };
            var response = await request(options, function(err, response, result) {
                return result;
            });
            return response;
            
        }catch(error){
            console.log(error.message);
            var errorMessage = JSON.parse(error.message.slice(5)).error[0].message;
            return errorMessage;
        }
}