const { src, data, send } = require("../..");
const { nullish, time, numberish, realtype, stringify } = require("../../common");
const { log } = require("../../commonServer");
module.exports.execute = async (query) => {
    log(query);
    let users = JSON.parse(stringify(Object.values(data().user)));
    if (query.select) {
        let ranks = query.select.split(",").map(x => x.trim()).filter(x => x.startsWith("rankby:")).map(x => x.slice("rankby:".length));
        if (ranks.length > 0) {
            for (let rank of ranks) {
                let desc = false;
                if (rank.startsWith("desc:")) { desc = true; rank = rank.slice("desc:".length); }
                users = module.exports.orderby(users, rank, desc);
            }
            module.exports.orderby(users, "twitch.id", false, false);
            query.select += ",rank";
        }
    }
    if (query.where) {
        let keys = query.where.split(",").map(x => {
            if (x.includes("<") || x.includes("=") || x.includes(">")) {
                for (let sig of ["!=", ">=", "<=", ">", "<", "="]) {
                    let idx = x.indexOf(sig);
                    if (idx != -1) return [x.slice(0, idx).trim().split("."), sig, numberish(x.slice(idx + sig.length).trim())]; 
                }
            } else return [x.trim().split("."), "exists", null];
        });
        users = users.filter(user => keys.every(key => {
            let target = user;
            for (let p of key[0]) target = target?.[p] ?? undefined;
            if (key[1] === "exists") return target !== undefined;
            if (target === undefined) switch (typeof(key[2])) {
                case "number": target = 0; break;
                case "boolean": target = false; break;
                case "string": target = ""; break;
            }
            switch (key[1]) {
                case "=": return target == key[2];
                case "!=": return target != key[2];
                case "<": return target < key[2];
                case "<=": return target <= key[2];
                case ">": return target > key[2];
                case ">=": return target >= key[2];
            }
        }));
    }
    if (query.orderby) users = module.exports.orderby(users, query.orderby, query.desc);
    if (query.select) {
        let ret = [];
        let selects = query.select.split(",").map(x => x.trim()).filter(x => !x.startsWith("rankby:"));
        if (selects.length > 0) {
            for (let user of users) {
                let data = {};
                for (let keys of selects) {
                    let from = user; let to = data;
                    for (let key of keys.split(".").slice(0, -1)) {
                        from = from?.[key] ?? undefined;
                        if (from === undefined) break;
                        to[key] ??= {};
                        to = to[key];
                    }
                    if (from === undefined) continue;
                    to[keys.split(".").at(-1)] = from[keys.split(".").at(-1)];
                }
                ret.push(data);
            }
            users = ret;
        }
    }
    query.count = numberish(query.count);
    if (realtype(query.count) === "number") { users = users.slice(0, query.count); }
    return [0, users];
}

module.exports.orderby = (users, orderby, desc = false, genrank = true) => {
    let pair = users.map(x => [x, x]);
    for (let user of pair)
        for (let key of orderby.split(".").map(x => x.trim())) user[1] = user[1]?.[key] ?? undefined;
    pair.sort((a, b) => {
        if (a[1] === undefined) switch (typeof(b[1])) {
            case "number": a[1] = 0; break;
            case "bigint": a[1] = 0n; break;
            case "boolean": a[1] = false; break;
            case "object": a[1] = {}; break;
            case "string": a[1] = ""; break;
            case "undefined": return 0;
        }
        if (b[1] === undefined) switch (typeof(a[1])) {
            case "number": b[1] = 0; break;
            case "bigint": b[1] = 0n; break;
            case "boolean": b[1] = false; break;
            case "object": b[1] = {}; break;
            case "string": b[1] = ""; break;
        }
        let res = (a[1] > b[1]) ? 1 : (a[1] === b[1]) ? 0 : -1;
        return desc ? -res : res;
    });
    if (genrank) {
        let pastRank = 1; let pastOrder = undefined;
        for (let i = 0; i < pair.length; i++) { 
            pair[i][0].rank ??= {}; 
            if (pastOrder !== pair[i][1]) { pastRank = i + 1; pastOrder = pair[i][1]; }
            pair[i][0].rank[orderby] = pastRank;
        };
    }
    return pair.map(x => x[0]);
}