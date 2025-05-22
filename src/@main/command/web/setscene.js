const { src, data, send } = require("../..");
const { delay } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (i, o) => {
    data(`user.140410053.special.scene`, i);
    if (o.price.jesus[0] !== o.price.jesus[1]) 
        src().coin.set(109830946, o.price.jesus[0], o.price.jesus[1]);
    else src().coin.reset(109830946, o.price.jesus[0]);
    if (o.price.judas[0] !== o.price.judas[1]) 
        src().coin.set(1028054302, o.price.judas[0], o.price.judas[1]);
    else src().coin.reset(1028054302, o.price.judas[0]);
    log(i, o);
    switch (i) {
        case -2:
            await src().jesus.end();
            await src().module.end("obs", true);
            await send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": true});
            await send("obs", "send", "SetSceneItemEnabled", "collab", "veadotube", {"sceneItemEnabled": false});
            break;
        case -1:
            await src().module.start("obs", true);
            await delay(2000);
            await src().jesus.intermission(true);
            await src().jesus.start();
            await send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": false});
            await send("obs", "send", "SetSceneItemEnabled", "collab", "veadotube", {"sceneItemEnabled": true});
            await send("obs", "send", "PressInputPropertiesButton", {"inputName": "jesus::screen", "propertyName": "refreshnocache"});
            await send("obs", "send", "PressInputPropertiesButton", {"inputName": "jesus::recentexchanges", "propertyName": "refreshnocache"});
            await send("obs", "send", "PressInputPropertiesButton", {"inputName": "jesus::forrest", "propertyName": "refreshnocache"});
            await send("obs", "send", "SetSceneItemEnabled", "jesus::intermission", "streaming_audio (not)", {"sceneItemEnabled": true});
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::news1", filterName: "Move Value", filterSettings: {setting_float: 0}});
            await delay(20);
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::news1", filterName: "Move Value", filterEnabled: true});
            await delay(20);
            await send("obs", "send", "SetSourceFilterSettings", {sourceName: "jesus::news2", filterName: "Move Value", filterSettings: {setting_float: 0}});
            await delay(20);
            await send("obs", "send", "SetSourceFilterEnabled", {sourceName: "jesus::news2", filterName: "Move Value", filterEnabled: true});
            await delay(20);
            break;
        case 8:
            await send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": true});
            await send("obs", "send", "SetSceneItemEnabled", "collab", "veadotube", {"sceneItemEnabled": false});
            break;
        case 13:
            await send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": false});
            await send("obs", "send", "SetSceneItemEnabled", "collab", "veadotube", {"sceneItemEnabled": true});
            break;
        case 19:
            await src().jesus.end();
            await src().module.end("obs", true);
            await send("obs", "send", "SetSceneItemEnabled", "collab", "overlay", {"sceneItemEnabled": true});
            await send("obs", "send", "SetSceneItemEnabled", "collab", "veadotube", {"sceneItemEnabled": false});
            break;
    }
    if (i >= 0) await src().jesus.headline(TEXT[i] ?? false);
    if (i >= 0 && TEXT[i]) await src().jesus.button("intermission off");
    return [0, "done"];
}

const TEXT = [
    "New Coin Alert: $JESUS",
    false,
    "Cato Perrius situation is CRAZY (kills child (alledgedly))",
    false,
    "Special Podcast: what is next for $JESUS? w/ Mary and Peter",
    false,
    "Special Podcast: with the prodigy behind $JUDASproject",
    false,
    false,
    false,
    false,
    "Special Podcast: it's the tariffs man",
    "We Should All Go To Space",
    false,
    "Special Podcast: $JUDAS WORLD DOMINATION TOUR",
    false,
    "YOUR EQUITY IS SAFE",
    false
];