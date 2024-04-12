const { sendByName, send } = require('../include');
module.exports.condition = 'endstream';
module.exports.execute = async _ => {
    sendByName("SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": false});
    sendByName("SetSceneItemEnabled", "stream", "stream::sources", {"sceneItemEnabled": false});
    send("StopStream", {});
    send("StopRecord", {});
}