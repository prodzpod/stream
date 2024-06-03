const fs = require('fs');
const path = require('path');
module.exports.execute = async (query, body) => {
    try {
        if (query.token) fs.writeFileSync(path.join(__dirname, '../../../../../secret', 'stream_session.json'), JSON.stringify({streamerLogin: "prodzpod", streamerID: "140410053", botID: "g584kjzcj1tr15ouxg0fko2ybnckxh", token: query.token, refresh: query.refresh})) // lol its outside the directory
        return [200, {msg: 'ok'}];
    } catch {
        return [500, {msg: 'uh oh'}];
    }
}