const { sendByName } = require('../include');
module.exports.condition = 'brb';
module.exports.execute = async _ => {
    sendByName("SetSceneItemEnabled", "stream", "stream::brb", {"sceneItemEnabled": true});
    sendByName("SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": false});
}