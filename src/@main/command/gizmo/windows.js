const { send } = require("../..");
const { WASD, unentry } = require("../../common");
const { log, debug } = require("../../commonServer");
// TODO: rewrite in gizmo2 style
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
    cygwin: {
        rule: name => name === "~",
        name: "%NAME%:mintty:mintty.exe",
        window: null,
    },
    bepin: {
        rule: name => name.includes("BepInExGUI"),
        name: "%NAME%:Window Class:bepinex_gui.exe",
        window: null,
    },
    assetstudio: {
        rule: name => name.includes("AssetStudioGUI"),
        name: "%NAME%:WindowsForms10.Window.8.app.0.378734a_r3_ad1:AssetStudioGUI.exe",
        window: null,
    },
    ilspy: {
        rule: name => name.includes("ILSpy"),
        name: "%NAME%:HwndWrapper[ILSpy;;ac8547a7-b5d9-4c7f-b37f-133545679eaf]:ILSpy.exe",
        window: null,
    },
    unity: {
        rule: name => name.includes(" - Unity "),
        name: "%NAME%:UnityContainerWndClass:Unity.exe",
        window: null,
    },
    r2modman: {
        rule: name => name.startsWith("r2modman"),
        name: "%NAME%:Chrome_WidgetWin_1:r2modman.exe",
        window: null,
    },
    gms: {
        rule: name => name.includes(" - GameMaker"),
        name: "%NAME%:SDL_app:GameMaker.exe",
        window: null,
    },
    stelldev: {
        rule: name => name === "Startellers DEV",
        name: "%NAME%:YYGameMakerYY:Startellers.exe",
        window: null,
    },
    stelldemo: {
        rule: name => name === "Startellers DEMO",
        name: "%NAME%:YYGameMakerYY:Startellers.exe",
        window: null,
    },
    emacs: {
        rule: name => name.includes(" - GNU Emacs at "),
        name: "%NAME%:Emacs:emacs.exe",
        window: null,
    },
    wwise: {
        rule: name => name.includes(" - Wwise "),
        name: "%NAME%:Afx#3A00007FF624FF0000#3A0#3A0000000000000000#3A0000000000000000#3A000000003C9D05EB:Wwise.exe",
        window: null,
    },
    // art
    aseprite: {
        rule: name => name.includes("Aseprite"),
        name: "%NAME%:Aseprite.Window:Aseprite.exe",
        window: null,
    },
    blender: {
        rule: name => name.includes(" - Blender"),
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
    kdenlive: {
        rule: name => name.includes(" - Kdenlive"),
        name: "Kdenlive:Qt672QWindowIcon:kdenlive.exe",
        window: null,
    },
    krita: {
        rule: name => name.includes(" - Krita"),
        name: "Krita:Qt5QWindowIcon:krita.exe",
        window: null,
    },
    audacity: {
        rule: name => name.includes("Audacity"),
        name: "%NAME%:wxWindowNR:Audacity.exe",
        window: null,
    },
    paint: {
        rule: name => name.includes(" - Paint"),
        name: "%NAME%:MSPaintApp:mspaint.exe",
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
    },
    nosignal: {
        rule: name => name.startsWith("no signal"),
        name: "%NAME%:Engine:no-signal.exe",
        window: null,
    },
    vilzin: {
        rule: name => name.startsWith("Kill Vilzin"),
        name: "%NAME%:SDL_app:main.exe",
        window: null,
    },
    rd: {
        rule: name => name.includes("Rhythm Doctor"),
        name: "%NAME%:UnityWndClass:Rhythm Doctor.exe",
        window: null,
    },
    ror2: {
        rule: name => name === "Risk of Rain 2",
        name: "%NAME%:UnityWndClass:Risk of Rain 2.exe",
        window: null,
    },
    corekeeper: {
        rule: name => name === "Core Keeper",
        name: "%NAME%:UnityWndClass:CoreKeeper.exe",
        window: null,
    },
    celeste: {
        rule: name => name === "Celeste",
        name: "%NAME%:WindowsForms10:Window.8.app.0.3a48e15_r13_ad1:Celeste.exe",
        window: null,
    },
    hacknet: {
        rule: name => name === "Hacknet",
        name: "%NAME%:SDL_app:Hacknet.exe",
        window: null,
    },
    infidhells: {
        rule: name => name === "InfidHells",
        name: "%NAME%:UnityWndClass:InfidHells.exe",
        window: null,
    }
};
module.exports.execute = async (...args) => {
    let update = WASD.unpack(args[0]).map(x => {
        let o = unentry(WASD.unpack(x).map(y => [y.slice(0, y.indexOf(":")), y.slice(y.indexOf(":") + 1)]));
        for (let k of ['id', 'x', 'y', 'w', 'h', 'i']) if (o[k] !== undefined) {
            o[k] = Number(o[k]);
            if (Number.isNaN(o[k])) delete o[k];
        }
        return o;
    });
    let remove = WASD.unpack(args[1]).map(x => Number(x));
    // remove windows
    for (let k in RULE) if (remove.includes(RULE[k].window?.id)) {
        log("Unhooked Windows:", RULE[k].window?.name);
        send("obs", "send", "SetSceneItemEnabled", "stream::sources", k, {"sceneItemEnabled": false});
        RULE[k].window = null;
    }
    // link windows
    for (let k in RULE) {
        if (RULE[k].window) continue;
        let window = update.find(x => x.name && RULE[k].rule(x.name));
        if (!window) continue;
        RULE[k].window = window;
        send("obs", "send", "SetSceneItemEnabled", "stream::sources", k, {"sceneItemEnabled": true});
        if (window.name) send("obs", "send", "SetInputSettings", {"inputName": k, "inputSettings": {"window": RULE[k].name.replace("%NAME%", window.name)}});
        log("Hooked Windows:", RULE[k].window?.name);
    }
    // update stuff
    let indices = Object.entries(RULE).filter(x => x[1].window).sort((a, b) => a[1].window.i - b[1].window.i).map(x => [x[0], x[1].window.i, update?.find(y => x[1].window.id === y.id)?.i ?? x[1].window.i]);
    let prev = indices.sort((a, b) => a[1] - b[1]).map(x => x[0]); 
    let cur = indices.sort((a, b) => a[2] - b[2]).map(x => x[0]); 
    // log("window:", prev, cur);
    for (let i = 0; i < cur.length; i++) {
        if (prev[i] === cur[i]) continue;
        debug("Order Changed:", i, prev[i], cur[i]);
        send("obs", "send", "SetSceneItemIndex", "stream::sources", cur[i], {"sceneItemIndex": Object.keys(RULE).length - i});
        prev = [cur[i], ...prev.filter(x => x !== cur[i])];
    }
    for (let w of indices) RULE[w[0]].window.i = w[2];
    for (let window of update) {
        let k = Object.keys(RULE).find(x => RULE[x].window?.id == window.id);
        if (!k) continue;
        if (window.x !== undefined || window.y !== undefined || window.w !== undefined || window.h !== undefined) {
            let o = {};
            if (window.x) o.positionX = window.x;
            if (window.y) o.positionY = window.y;
            // if (window.w) o.scaleX = window.w;
            // if (window.h) o.scaleY = window.h;
            debug("Updating Transform:", k, o);
            send("obs", "send", "SetSceneItemTransform", "stream::sources", k, {"sceneItemTransform": o});
        }
    }
    return [0, ""];
}

module.exports.reset = () => {
    for (let k of Object.keys(RULE)) RULE[k].window = null;
}