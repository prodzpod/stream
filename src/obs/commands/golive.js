const { sendByName, send } = require('../include');
module.exports.condition = 'golive';
module.exports.execute = async _ => {
    send("SetCurrentProgramScene", {"sceneName": "stream"});
    sendByName("SetSceneItemEnabled", "stream", "stream::sources", {"sceneItemEnabled": false});
    send("StartStream", {});
    send("StartRecord", {});
}