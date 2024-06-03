const { send } = require("../..")

module.exports.start = () => {
    send("obs", "send", "SetCurrentProgramScene", {"sceneName": "stream"});
    send("obs", "send", "StartStream", {});
    send("obs", "send", "StartRecord", {});
}

module.exports.brb = () => {
    send("obs", "send", "SetSceneItemEnabled", "stream", "stream::brb", {"sceneItemEnabled": true});
    send("obs", "send", "SetSceneItemEnabled", "stream", "stream::sources", {"sceneItemEnabled": false});
    send("obs", "send", "SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": false});
}

module.exports.unbrb = () => {
    send("obs", "send", "SetSceneItemEnabled", "stream", "stream::sources", {"sceneItemEnabled": true});
    send("obs", "send", "SetSceneItemEnabled", "stream", "stream::brb", {"sceneItemEnabled": false});
    send("obs", "send", "SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": true});
}

module.exports.end = () => {
    send("obs", "send", "StopStream", {});
    send("obs", "send", "StopRecord", {});
}