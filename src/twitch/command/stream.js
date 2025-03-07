const { fetch } = require("../api");
const { log } = require("../ws");

module.exports.execute = async name => {
    if (Array.isArray(name)) {
        let ret = {};
        for (let i = 0; i < name.length; i += 100) {
            const todo = name.slice(i, i + 100);
            let res = await fetch("GET", "streams?first=100&user_login=" + todo.join("&user_login="));
            if (res[0] != 200) { return [1, {}]; }
            res = res[1].data;
            for (let user of res) ret[user.user_login] = user;
        }
        return [0, ret];
    }
    else {
        let ret = {user_login: name};
        const res = await fetch("GET", "streams", ret);
        if (res[0] !== 200) return [-1, res];
        else if (res[1].data.length) {
            res[1].data[0].user = (await require("./user").execute(Number(res[1].data[0].user_id)))?.[1];
            return [0, res[1].data[0]];
        }
    }
    return [1, ""];
}