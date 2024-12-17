const { send } = require("../..");
const { log, warn } = require("../../commonServer");

let ended = false;

module.exports.ending = () => {
    if (ended) { log("ending already triggered! please reset first"); return; } 
    send("obs", "send", "SetSceneItemEnabled", "intro", "startimage", {"sceneItemEnabled": true});
    send("obs", "send", "SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": false});
    send("obs", "send", "SetCurrentProgramScene", {"sceneName": "intro"});
    send("gizmo", "ending");
    setTimeout(() => send("obs", "send", "SetSceneItemEnabled", "stream::audio", "gizmo_audio", {"sceneItemEnabled": false}), 1000);
    warn("!!!!!ENDING TRIGGERED!!!!!");
    warn("!!!!!ENDING TRIGGERED!!!!!");
    warn("!!!!!ENDING TRIGGERED!!!!!");
    warn("!!!!!ENDING TRIGGERED!!!!!");
    warn("!!!!!ENDING TRIGGERED!!!!!");
    ended = true;
}

module.exports.reset = () => {
    ended = false;
    send("obs", "send", "SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": true});
    send("obs", "send", "SetSceneItemEnabled", "stream::audio", "gizmo_audio", {"sceneItemEnabled": true});
    log("ending reset!");
}