var https = require('https');


exports.postMessage = async function(messages){
    try {

        opts = {
            hostname: 'api.line.me',
            path: '/v2/bot/message/reply',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Content-Length": Buffer.byteLength(messages),
                "Authorization": "Bearer " + process.env.CHANNEL_ACCESS_TOKEN
            },
            method: 'POST',
        };
        
        var req = https.request(opts, function(res) {
        res.on('payload', function(res) {
            console.log(res.toString());
        }).on('error', function(e) {
                console.log('ERROR: ' + e.stack);
            });
        });
        await req.write(messages);
        await req.end();

    } catch (error) {
      throw new Error(error.message);
    }
    
}

