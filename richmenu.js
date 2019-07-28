var request = require('request-promise');
exports.setRichMenu = async function (userId, richMenuId) {
    try {
        var options = {
            uri: `https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`,
            headers: {
                "Authorization": "Bearer " + process.env.CHANNEL_ACCESS_TOKEN
            },
            method: 'POST',
        };
        var response = await request(options, function (err, response, result) {
            return result;
        });
        return response;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}
exports.getRichMenuId = async function (userId) {
    try {
        var options = {
            uri: `https://api.line.me/v2/bot/user/${userId}/richmenu`,
            headers: {
                "Authorization": "Bearer " + process.env.CHANNEL_ACCESS_TOKEN
            },
            method: 'GET',
        };
        var response = await request(options, function (err, response, result) {
            return result;
        });
        return response;
    } catch (error) {
        return await getDefaultRichMenuId();
    }
}
async function getDefaultRichMenuId () {
    try {
        var options = {
            uri: "https://api.line.me/v2/bot/user/all/richmenu",
            headers: {
                "Authorization": "Bearer " + process.env.CHANNEL_ACCESS_TOKEN
            },
            method: 'GET',
        };
        var response = await request(options, function (err, response, result) {
            return result;
        });
        return response;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}