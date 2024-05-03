const { send, log, warn, error } = require('../../include');
const { streamInfo } = require('../../../@main/include');
const { Math } = require('../../../@main/util_client');
const MINUTE = 60*1000;
const HOUR = 60*MINUTE;
const DAY = 24*HOUR;
const WEEK = 7*DAY;
module.exports.condition = '!uptime'
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    let info = streamInfo();
    let start = info.start;
    let time = new Date(new Date().getTime() - start);
    if (start == -1) {
        time = Math.posmod(20*HOUR - (new Date().getTime()), WEEK);
        date = new Date(time);
        let tts = "";
        if (time > (WEEK - HOUR) || time < (5*MINUTE)) tts = "Starting Soon";
        else if (time < HOUR) tts = `${date.getUTCMinutes()} minute${date.getUTCMinutes() == 1 ? "" : "s"} away`;
        else if (time < DAY) tts = `${date.getUTCHours()} hour${date.getUTCHours() == 1 ? "" : "s"} away`;
        else tts = `${date.getUTCDay()} day${date.getUTCDay() == 1 ? "" : "s"} away`;
        send(`We are currently offline, Stream is at every Thursday 20:00 GMT. (${tts}!)`, user, data);
    }
    else send(`We've been going for ${time.getUTCHours()}:${time.getUTCMinutes()}:${time.getUTCSeconds()}! Currently we're in phase ${info.phase}.`, user, data);
    return 0;
}