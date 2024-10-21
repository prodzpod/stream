const { send, src, incrementData, data } = require("../..");
const { delay, WASD, nullish, remove, stringify, Math, realtype } = require("../../common");
const { info, log } = require("../../commonServer");
const { args, chat } = require("../chat/chat");

module.exports.predicate = ["!prediction", "!gamble", "!gamba", "!predictions", "!bet"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    // .!prediction title [...options] (time)
    // .!prediction (number OR name) amount
    // .!endprediction number
    let _args = args(text);
    if (_args.length < 2) { _reply("usage: !prediction (number or name) (amount)"); return [1, ""]; }
    if (realtype(_args[1]) === "array") { // prediction make
        if (!src().chat.checkPerms(3, from, chatter, message, text, emote, reply)) 
            { _reply("Insufficient Permission"); return [1, ""]; }
        let options = _args[1];
        if (options.length < 2) {
            _reply("Prediction needs at least two options"); 
            return [1, ""]; 
        }
        if (currentPrediction !== null) { _reply("Prediction is still going"); return [0, ""]; }
        module.exports.startPrediction(_args[0], options);
        _reply("Prediction started! Title: " + _args[0]);
        await Promise.any([delay((_args[2] ?? 60) * 1000), new Promise(resolve => { currentPredictionForceEnd = resolve })]);
        _reply("Prediction Locked In! \n" + module.exports.printPrediction());
        currentPredictionForceEnd = null;
    } else { // Prediction
        if (_args[1].toLowerCase?.() === "all") _args[1] = chatter.economy?.iu ?? 0;
        if (currentPredictionForceEnd === null) { _reply("No Predictions are active"); return [1, ""]; }
        if (realtype(_args[1]) !== "number") { _reply("usage: !prediction (number or name) (amount)"); return [1, ""]; }
        let positionFrom = Object.keys(currentPrediction.options).find(x => Object.keys(currentPrediction.options[x]).includes(chatter.twitch?.id)) ?? null;
        let positionTo = nullish(_args[0]) !== null ? (realtype(_args[0]) === "number" ? (Object.keys(currentPrediction.options)[_args[0] - 1] ?? undefined) : (Object.keys(currentPrediction.options).find(x => x.toLowerCase() === stringify(_args[0]).toLowerCase()) ?? undefined)) : null;
        if (positionTo === undefined || positionTo === null) { _reply("Invalid Option, options: " + Object.keys(currentPrediction.options).join(", ")); return [1, ""]; }
        if (positionFrom !== null && positionFrom?.toLowerCase() !== positionTo?.toLowerCase()) {
            _reply("You've chose " + positionFrom + " already"); return [1, ""];
        }
        if (_args[1] <= 0) { _reply("Bets must be positive"); return [1, ""]; }
        if (src().user.cost(_reply, chatter, _args[1])) {
            currentPrediction.options[positionTo][chatter.twitch.id] ??= 0;
            currentPrediction.options[positionTo][chatter.twitch.id] += _args[1];
            _reply(`You have chosen ${positionTo} for ${currentPrediction.options[positionTo][chatter.twitch.id]}iu \n${module.exports.printPrediction()}`);
        }
        else { _reply("Insufficient Balance"); return [1, ""]; }
    }
    return [0, ""];
}

let currentPrediction = null;
let currentPredictionForceEnd = null;
module.exports.startPrediction = (title, options) => {
    currentPrediction = {
        title: title,
        options: {}
    };
    for (let o of options) currentPrediction.options[stringify(o)] = {};
}

module.exports.printPrediction = () => {
    if (currentPrediction === null) return "";
    return `Title: ${currentPrediction.title} \n${Object.keys(currentPrediction.options).map(x => `${x}: ${Math.sum(...Object.values(currentPrediction.options[x]))}`).join(" \n")}`;
}

module.exports.endPrediction = (_reply, number) => {
    currentPredictionForceEnd?.();
    if (number === undefined) { // refund
        _reply("Prediction Ended! result: refund");
        for (let k of Object.values(currentPrediction.options))
            for (let chatter of Object.keys(k)) {
                incrementData(`user.${chatter}.economy.iu`, k[chatter]);
                send("web", "iu", chatter, data().user[chatter].economy.iu);
            }
    } else {
        let winner = nullish(number) !== null ? (realtype(number) === "number" ? (Object.keys(currentPrediction.options)[number - 1] ?? undefined) : (Object.keys(currentPrediction.options).find(x => x.toLowerCase() === stringify(number).toLowerCase()) ?? undefined)) : null;
        _reply("Prediction Ended! result: " + winner);
        let multiplier = Math.sum(...Object.values(currentPrediction.options[winner]));
        if (multiplier !== 0) {
            multiplier = Math.sum(...Object.values(currentPrediction.options).map(x => Math.sum(...Object.values(x)))) / multiplier;
            for (let chatter of Object.keys(currentPrediction.options[winner])) {
                incrementData(`user.${chatter}.economy.iu`, multiplier * currentPrediction.options[winner][chatter]);
                send("web", "iu", chatter, data().user[chatter].economy.iu);
            }
        }
    }
    currentPrediction = null;
}