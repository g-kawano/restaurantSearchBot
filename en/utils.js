const Trans = require('./translate');

exports.buildCarouselMessages = async function(restList, presentLocation){
    console.log("翻訳するよーーーーーーーーーー");
    const carouselColumns = await Promise.all(restList.map(async(element) =>{
        var translatedName = await Trans.translateMessage(element.name);
        return {
            text: translatedName,
            actions: [
                {
                    "type": "uri",
                    "label": "Detail",
                    "uri": element.url
                },
                {
                    type: "uri",
                    label: "Find directions",
                    uri: `http://maps.google.com/maps?hl=en&saddr=${presentLocation.latitude},${presentLocation.longitude}&daddr=${element.latitude},${element.longitude}&dirflg=w`,
                }
            ],
        };
    }));

    const messages = [{
        type: 'template',
        altText: 'We will guide you to a nearby restaurant',
        template: {
          type: 'carousel',
          columns: carouselColumns,
        },
      }];
      
      console.log(messages);

      return messages;
};
