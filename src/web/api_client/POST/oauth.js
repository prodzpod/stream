const fs = require('fs');
const path = require('path');
module.exports.execute = async (query, body) => {
    try {
        if (query.token) fs.writeFileSync(path.join(__dirname, '../../../../../secret', 'stream_session.json'), JSON.stringify({token: query.token})) // lol its outside the directory
        return [200, {msg: 'ok'}];
    } catch {
        return [500, {msg: 'uh oh'}];
    }
}