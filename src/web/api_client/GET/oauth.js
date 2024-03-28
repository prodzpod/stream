const fs = require('fs');
const path = require('path');
const { randomHex } = require('../../../@main/util_client');
const { clientKey } = require('../../../twitch/include');
module.exports.state = "";
module.exports.execute = async (query, body) => {
    try {
        if (!JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../../secret', 'stream_session.json'))).token) throw Error();
        return [304, {msg: 'Token already exists, delete file to generate new one'}];
    } catch {
        if (query.state) return [200, {match: query.state == this.state, secret: process.env.TWITCH_BOT_SECRET, key: clientKey}];
        this.state = randomHex(32);
        return [200, {state: this.state, key: clientKey}];
    }
}