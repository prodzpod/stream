const { send, data, src } = require("../..");
const { formatTime, Math } = require("../../common");
module.exports.execute = async (subject) => {
    const COMMANDS = {
        "title": async () => data().stream.title,
        "subject": async () => data().stream.subject,
        "phase": async () => data().stream.phase,
        "category": async () => data().stream.category,
        "uptime": async () => formatTime(BigInt(data().stream.start), "hhh:mm:ss"),
        "gcp": async () => Math.prec((await src().screen.getGCP())[1]),
        "gcp2": async () => Math.prec((await src().screen.getGCP())[2]),
        "gcp3": async () => Math.prec((await src().screen.getGCP())[3]),
        "coherence": async () => Math.prec((await src().screen.getGCP())[0]),
    };
    if (COMMANDS[subject]) return [0, await COMMANDS[subject]()];
    return [0, "invalid subject"];
}