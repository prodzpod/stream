const { log, warn, error, send, sendByName } = require('../include');
const { isNullish, WASD, unentry } = require('../../@main/util_client');
module.exports.condition = 'windows';
let RULE = {
    // software and game development
    code: {
        rule: name => name.includes(" - Visual Studio Code"),
        name: "%NAME%:Chrome_WidgetWin_1:Code.exe",
        window: null,
    },
    'c#': {
        rule: name => name.includes(" - Microsoft Visual Studio"),
        name: "%NAME%:HwndWrapper[DefaultDomain;;af9ecdd9-3aed-4e32-bce9-ebeb2f58597a]:devenv.exe",
        window: null,
    },
    // art
    aseprite: {
        rule: name => name.startsWith("Aseprite"),
        name: "%NAME%:Aseprite.Window:Aseprite.exe",
        window: null,
    },
    blender: {
        rule: name => name.startsWith("Blender"),
        name: "%NAME%:GHOST_WindowClass:blender.exe",
        window: null,
    },
    fl: {
        rule: name => name.includes(" - FL Studio") && !name.includes("streaming.flp"),
        name: "%NAME%:TFruityLoopsMainForm:FL64.exe",
        window: null,
    },
    vegas: {
        rule: name => name.includes(" - VEGAS Pro"),
        name: "%NAME%:Vegas.Class.Frame:vegas140.exe",
        window: null,
    },
    // just joeling
    internet: {
        rule: name => name.includes(" - Google Chrome"),
        name: "%NAME%:Chrome_WidgetWin_1:chrome.exe",
        window: null,
    },
    notepad: {
        rule: name => name.includes("Untitled - Notepad"), // only capture unsaveds
        name: "%NAME%:Notepad:notepad.exe",
        window: null,
    },
    discord: {
        rule: name => name.includes(" - Discord"),
        name: "%NAME%:Chrome_WidgetWin_1:Discord.exe",
        window: null,
    },
    vlc: {
        rule: name => name.includes("- VLC media player"),
        name: "%NAME%:Qt5QWindowIcon:vlc.exe",
        window: null,
    },
    // video james, CEO of videojuego
    tetr: {
        rule: name => name.startsWith("TETR.IO"),
        name: "%NAME%:Chrome_WidgetWin_1:TETR.IO.exe",
        window: null,
    },
    noita: {
        rule: name => name.startsWith("Noita"),
        name: "%NAME%:SDL_app:noita.exe",
        window: null,
    }
};
module.exports.execute = async args => {
    let update = WASD.unpack(args[1]).map(x => {
        let o = unentry(WASD.unpack(x).map(y => [y.slice(0, y.indexOf(":")), y.slice(y.indexOf(":") + 1)]));
        for (let k of ['id', 'x', 'y', 'w', 'h', 'i']) if (o[k] !== undefined) {
            o[k] = Number(o[k]);
            if (Number.isNaN(o[k])) delete o[k];
        }
        return o;
    });
    let remove = WASD.unpack(args[2]).map(x => Number(x));
    // remove windows
    for (let k in RULE) if (remove.includes(RULE[k].window?.id)) {
        log("Unhooked Windows:", RULE[k].window?.name);
        sendByName("SetSceneItemEnabled", "stream::sources", k, {"sceneItemEnabled": false});
        RULE[k].window = null;
    }
    // link windows
    for (let k in RULE) {
        if (RULE[k].window) continue;
        let window = update.find(x => x.name && RULE[k].rule(x.name));
        if (!window) continue;
        RULE[k].window = window;
        sendByName("SetSceneItemEnabled", "stream::sources", k, {"sceneItemEnabled": true});
        log("Hooked Windows:", RULE[k].window?.name);
    }
    // update stuff
    let indices = Object.entries(RULE).filter(x => x[1].window).sort((a, b) => a[1].window.i - b[1].window.i).map(x => x[0]);
    let indicesToUpdate = update
        .map(window => Object.keys(RULE).find(x => RULE[x].window?.id == window.id))
        .filter(k => k)
        .map(x => [x, indices.indexOf(x)]);
    if (indicesToUpdate.length > 1) { // order swapped
        log("Order Changed:", indicesToUpdate);
        sendByName("SetSceneItemIndex", "stream::sources", indicesToUpdate[0][0], {"sceneItemIndex": Object.keys(RULE).length - 1});
    }
    for (let window of update) {
        let k = Object.keys(RULE).find(x => RULE[x].window?.id == window.id);
        if (!k) continue;
        if (window.name) send("SetInputSettings", {"inputName": k, "inputSettings": {"window": RULE[k].name.replace("%NAME%", window.name)}});
        if (window.x !== undefined || window.y !== undefined || window.w !== undefined || window.h !== undefined) {
            let o = {};
            if (window.x) o.positionX = window.x;
            if (window.y) o.positionY = window.y;
            // if (window.w) o.scaleX = window.w;
            // if (window.h) o.scaleY = window.h;
            log("Updating Transform:", k, o);
            sendByName("SetSceneItemTransform", "stream::sources", k, {"sceneItemTransform": o});
        }
    }
}