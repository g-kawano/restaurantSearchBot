var request = require('request-promise');
const API_ENDPOINT = 'https://www.googleapis.com/oauth2/v4/token';
exports.getNewAccessToken = async function(){
    try{
        var options = {
            method: 'POST',
            uri: API_ENDPOINT,
            form: {
                client_id: process.env.GAPI_CLIENT_ID,
                client_secret: process.env.GAPI_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: process.env.GAPI_REFRESH_TOKEN
            },
        };            
        var response = await request(options, function(err, response, result) {
            return result;        
        });
        return JSON.parse(response).access_token;
    
    }catch(error){
        console.log(error.message);
        throw new Error(error.message);
    }
}