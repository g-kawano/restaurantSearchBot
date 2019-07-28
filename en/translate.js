var request = require('request-promise');
var GetAT = require('./getAccessToken');

const API_ENDPOINT = `https://translation.googleapis.com/v3beta1/projects/${process.env.PROJECT_ID}/locations/global:translateText`;

exports.translateMessage = async function (message) {
    try {
        var access_token = await GetAT.getNewAccessToken();

        var options = {
            uri: API_ENDPOINT,
            method: 'POST',
            form: {
                source_language_code: 'ja',
                target_language_code: 'en',
                contents: message
            },
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-type': 'application/json'
            }
        };

        var response = await request(options, function (err, response, result) {
            return result;
        });
        return JSON.parse(response).translations[0].translatedText;

    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}