const { split, WASD } = require("./common");
const { log, info, warn, error } = require("./ws");

let SOCIALS = {};
class Social {
    constructor(key, validAccounts) { this._key = key; this.validAccounts = validAccounts; SOCIALS[key] = this; }
    validAccounts = [];
    _accounts = {};
    connect = async (id) => { error(`Social ${this._key}.connect() is not defined!`); return null; }
    post = async (account, txt, images=[], tags=[]) => { error(`Social ${this._key}.post() is not defined!`); return null; }
    repost = async (account, id) => { error(`Social ${this._key}.repost() is not defined!`); return null; }
    _handle = async(account, fn, word) => {
        if (!this.validAccounts.includes(account)) { warn(`${account} is not a valid ${this._key} account!`); return; }
        log(`${word} to ${this._key}@${account}`);
        let id = null;
        for (let tries = 0; tries < 3; tries++) {
            if (!this._accounts[account]) this._accounts[account] = await this.connect(account);
            id = await fn(this._accounts[account]);
            if (!id) delete this._accounts[account];
            else break;
            log(`${word} to ${this._key}@${account} failed, retrying (try ${tries})`);
        }
        if (id) info(`${word} to ${this._key}@${account} with id ${WASD.pack(id)}!`);
        else warn(`${word} to ${this._key}@${account} failed! see if there are errors in networks`);
        return id;
    }
}
function getSocial(key) {
    let [social, account] = split(key, "@", 1);
    if (SOCIALS[social]) return [SOCIALS[social], account];
    warn(social + " does not exist!");
    return null;
}
module.exports.post = async (key, txt, images = [], tags = []) => {
    let social = getSocial(key);
    if (social) return await social[0]._handle(social[1], a => social[0].post(a, txt, images, tags), "Posting");
}
module.exports.repost = async (key, id) => {
    let social = getSocial(key);
    if (social) return await social[0]._handle(social[1], a => social[0].repost(a, id), "Reposting");
}
module.exports.Social = Social;