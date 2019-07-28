const Line = require('./line');
const RichMenu = require('./richmenu');
const Ja = require('./ja/indexJa');
const En = require('./en/indexEn');

async function replyPlaneMessage(payload, callback, text) {
    var welcomemessage = JSON.stringify({
        replyToken: payload.replyToken,
        messages: [
            {
                type: "text",
                text: text
            }
        ]
    });
    await Line.postMessage(welcomemessage);
    callback(null, "");
}
async function setLanguage(lang, payload, callback) {
    switch (lang) {
        case "ja":
            await RichMenu.setRichMenu(payload.source.userId, process.env.RICHMENU_ID_JA);
            await replyPlaneMessage(payload, callback, "日本語に設定しました。");
            break;
        case "en":
            await RichMenu.setRichMenu(payload.source.userId, process.env.RICHMENU_ID_EN);
            await replyPlaneMessage(payload, callback, "Completed changing the settings to English");
            break;
    }
}
async function getLanguageSettings(payload, callback) {
    // ユーザに紐づいたリッチメニューのIDを取得
    var response = await RichMenu.getRichMenuId(payload.source.userId);
    var richMenuId = JSON.parse(response).richMenuId;
    // 取得したリッチメニューIDから言語設定を返す
    switch (richMenuId) {
        case process.env.RICHMENU_ID_JA:
            return 'ja';
        case process.env.RICHMENU_ID_EN:
            return 'en';
    }
}
async function selectAppByLanguage(event, context, callback) {
    const payload = event.events[0];
    var langSettings = await getLanguageSettings(payload, callback);
    switch (langSettings) {
        case "ja":
            await Ja.jaApp(event, context, callback);
            break;
        case "en":
            await En.enApp(event, context, callback);
            break;
    }
}
exports.handler = async (event, context, callback) => {
    const payload = event.events[0];
    // リッチメニューからのメッセージ
    if (payload.type === 'message' && payload.message.type === 'text') {
        // 言語設定
        if (payload.message.text === "日本語に設定して") {
            await setLanguage("ja", payload, callback);
        }
        else if (payload.message.text === "Please set to English") {
            await setLanguage("en", payload, callback);
        }
        //　レストラン検索
        else {
            await selectAppByLanguage(event, context, callback);
        }
    }
    // レストラン検索
    else {
        await selectAppByLanguage(event, context, callback);
    }
};