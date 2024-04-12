const { sendByName } = require('../include');
module.exports.condition = 'unbrb';
module.exports.execute = async _ => {
    sendByName("SetSceneItemEnabled", "stream", "stream::brb", {"sceneItemEnabled": false});
    sendByName("SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": true});
}