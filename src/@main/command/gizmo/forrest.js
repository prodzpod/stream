const { src, send, data } = require("../..");
const { time } = require("../../common");

module.exports.execute = async phase => {
    switch (phase) {
        case "start":
            data("stream", {
                phase: 99,
                title: "🌟𝙋𝙕𝙋𝘿🌙 Interview with SaladForrest @ https://pooltoy.live",
                subject: "Interview",
                category: "Special Events",
                start: time(),
                users: []
            });
            send("twitch", "info", "Special Events", "🌟𝙋𝙕𝙋𝘿🌙 Interview with SaladForrest @ https://pooltoy.live");
            send("obs", "send", "SetSceneItemEnabled", "collab", "fg forrest", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "collab", "bg forrest", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "collab", "activate windows", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "collab", "stream::sources", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "final art", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "stream", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "collab", "bg 2", {"sceneItemEnabled": true});
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "CRT", "filterEnabled": true});
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "NTSC", "filterEnabled": true});
            data("user.108372992.special.lock", 1); // lock
            await src().module.start("fl", true);
            await src().module.start("forrest", true);
            break;
        case "justchatting":
            send("obs", "send", "SetSceneItemEnabled", "collab", "fg forrest", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "bg forrest", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "stream::sources", {"sceneItemEnabled": true});
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "CRT", "filterEnabled": false});
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "NTSC", "filterEnabled": false});
            send("gizmo", "room", "JustChatting");
            break;
        case "guy":
            data("user.108372992.special.lock", 0);
            send("twitch", "send", 108372992, "[🌙] The magic blocking \"!guy\" seemingly fades away...");
            break;
        case "final":
            send("fl", "send", 8, 127);
            send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "stream::sources", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "final art", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "collab", "stream", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "stream", "overlay", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "stream", "stream::sources", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "stream", "stream::brb", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "stream", "overlay", {"sceneItemEnabled": true});
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "CRT", "filterEnabled": true});
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "NTSC", "filterEnabled": true});
            break;
        case "fadeout":
            send("fl", "send", 8, 0);
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "CRT", "filterEnabled": false});
            send("obs", "send", "SetSourceFilterEnabled", {"sourceName": "collab", "filterName": "NTSC", "filterEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "final art", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "stream", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "bg 2", {"sceneItemEnabled": false});
            send("gizmo", "room", "MainRoom");
            break;
        case "interview":
            send("obs", "send", "SetSceneItemEnabled", "collab", "activate windows", {"sceneItemEnabled": false});
            send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": true});
            send("obs", "send", "SetSceneItemEnabled", "collab", "bg 2", {"sceneItemEnabled": true});
            break;
    }        
}