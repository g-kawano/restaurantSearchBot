

exports.buildCarouselMessages = async function(restList, presentLocation){
    
    const carouselColumns = restList.map(element =>{
        return {
            title: element.name,
            text: element.name_kana,
            actions: [
                {
                    "type": "uri",
                    "label": "詳細",
                    "uri": element.url
                },
                {
                    type: "uri",
                    label: "道順を調べる",
                    uri: `http://maps.google.com/maps?saddr=${presentLocation.latitude},${presentLocation.longitude}&daddr=${element.latitude},${element.longitude}&dirflg=w`,
                }
            ],
        };
    });

    const messages = [{
        type: 'template',
        altText: 'お近くのレストランをご案内します',
        template: {
          type: 'carousel',
          columns: carouselColumns,
        },
      }];

      return messages;
};
