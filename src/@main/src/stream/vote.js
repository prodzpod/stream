const { send, src } = require("../..");
const { delay, WASD, nullish, remove, stringify, realtype } = require("../../common");
const { info, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!vote", "!poll"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    // .!vote title [...options] (time)
    // .!vote 1 OR !vote optionname | !vote (empty) for abstain
    let _args = args(text);
    if (_args.length >= 2) { // vote make
        if (!src().chat.checkPerms(3, from, chatter, message, text, emote, reply)) 
            { _reply("Insufficient Permission"); return [1, ""]; }
        let options = _args[1];
        if (options.length < 2) {
            _reply("Vote needs at least two options"); 
            return [1, ""]; 
        }
        module.exports.startVote(_args[0], options);
        _reply("Vote started! Title: " + _args[0]);
        await Promise.any([delay((_args[2] ?? 60) * 1000), new Promise(resolve => { currentVoteForceEnd = resolve })]);
        _reply(module.exports.printVote());
        currentVote = null;
        currentVoteForceEnd = null;
    } else { // vote
        if (currentVote === null) { _reply("No votes are active"); return [1, ""]; }
        let positionFrom = Object.keys(currentVote.options).find(x => currentVote.options[x].includes(chatter.twitch?.id)) ?? null;
        let positionTo = nullish(_args[0]) !== null ? (realtype(_args[0]) === "number" ? (Object.keys(currentVote.options)[_args[0] - 1] ?? undefined) : (Object.keys(currentVote.options).find(x => x.toLowerCase() === stringify(_args[0]).toLowerCase()) ?? undefined)) : null;
        if (positionTo === undefined) { _reply("Invalid Option, options: " + Object.keys(currentVote.options).join(", ")); return [1, ""]; }
        if (positionFrom?.toLowerCase() === positionTo?.toLowerCase()) {
            if (positionFrom === null) _reply(`You haven't voted yet \n${module.exports.printVote()}`);    
            else _reply(`You have already voted for ${positionTo} \n${module.exports.printVote()}`);
            return [0, ""];
        }
        if (positionFrom !== null) currentVote.options[positionFrom] = remove(currentVote.options[positionFrom], chatter.twitch.id);
        if (positionTo === null) _reply(`You have abstained from this vote \n${module.exports.printVote()}`);
        else {
            currentVote.options[positionTo].push(chatter.twitch.id);
            _reply(`You have voted for ${positionTo} \n${module.exports.printVote()}`);
        }
    }
    return [0, ""];
}

let currentVote = null;
let currentVoteForceEnd = null;
module.exports.startVote = (title, options) => {
    currentVote = {
        title: title,
        options: {}
    };
    for (let o of options) currentVote.options[stringify(o)] = [];
}

module.exports.printVote = () => {
    if (currentVote === null) return "";
    return `Title: ${currentVote.title} \n${Object.keys(currentVote.options).map(x => `${x}: ${currentVote.options[x].length}`).join(" \n")}`;
}

module.exports.endVote = () => currentVoteForceEnd?.();