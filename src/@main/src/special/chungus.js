const { send, src, data } = require("../..");
const { remove, random, numberish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");
const getID = (name) => Object.values(data().user).find(x => String(x?.twitch?.login)?.toLowerCase() === String(name)?.toLowerCase())?.twitch?.id;

module.exports.predicate = ["!c", "!chungus", "!chungusgame"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    if (!COMMANDS[_args[0]]) {
        let cmds = []; let visited = [];
        for (const k in COMMANDS) {
            if (visited.includes(COMMANDS[k])) continue;
            cmds.push(k); visited.push(COMMANDS[k]);
        }
        _reply(`[🍄🐰] Usage: !chungus [${cmds.join("/")}] [options...] | go to https://prod.kr/lala/chungus/ to manage inventory`);
    } else {
        let cdata = data().chungus.user[chatter.twitch.id]; 
        if (!cdata) {
            cdata = INITIAL_USERDATA();
            data("chungus.user." + chatter.twitch.id, cdata);
        }
        await COMMANDS[_args[0]](_reply, chatter, cdata, ..._args.slice(1));
    }
    return [0, ""];
}

const INITIAL_USERDATA = () => ({
    watered: [false, false], // this stream / this fruit
    money: 0,
    select: [null, null, null], // inventory idx
    inventory: []
});

/*
* STAT_RANGE { min: int, max: int, min_per_star: int, max_per_star: int }
* SOURCE { (type: "",) name: str, sweet: STAT_RANGE, sour: STAT_RANGE, spicy: STAT_RANGE, value: STAT_RANGE }
* ITEM { type: enum("fruit", "food"...) name: str, star: int, sweet: int, sour: int, spicy: int, value: int }
*/
function Stat(min, max, min_per_star, max_per_star) { return {min: min, max: max, min_per_star: min_per_star, max_per_star: max_per_star}; }
function Source(type, name, sweet, sour, spicy, value) { return {type: type, name: name, sweet: sweet, sour: sour, spicy: spicy, value: value} }
const FRUITS = [
    Source("fruit", "Apple", Stat(125, 250, 50, 100), Stat(10, 100, 2, 10), Stat(10, 100, 2, 10), Stat(6, 12, 3, 5)),
    Source("fruit", "Pear", Stat(100, 200, 25, 75), Stat(50, 150, 10, 25), Stat(10, 100, 2, 10), Stat(6, 12, 3, 5)),
    Source("fruit", "Lemon", Stat(10, 100, 2, 10), Stat(125, 250, 50, 100), Stat(10, 100, 2, 10), Stat(6, 12, 3, 5)),
    Source("fruit", "Lime", Stat(10, 100, 2, 10), Stat(100, 200, 25, 75), Stat(50, 150, 10, 25), Stat(6, 12, 3, 5)),
    Source("vegetable", "Pepper", Stat(10, 100, 2, 10), Stat(10, 100, 2, 10), Stat(125, 250, 50, 100), Stat(6, 12, 3, 5)),
    Source("vegetable", "Paprika", Stat(50, 150, 10, 25), Stat(10, 100, 2, 10), Stat(100, 200, 25, 75), Stat(6, 12, 3, 5)),
    Source("fruit", "Mango", Stat(50, 150, 10, 25), Stat(50, 150, 10, 25), Stat(10, 100, 2, 10), Stat(6, 12, 3, 5)),
    Source("vegetable", "Broccoli", Stat(25, 75, 5, 25), Stat(25, 75, 5, 25), Stat(25, 75, 5, 25), Stat(10, 20, 5, 10)),
    Source("fish", "Tuna", Stat(10, 100, 2, 10), Stat(50, 150, 10, 25), Stat(100, 200, 25, 75), Stat(10, 20, 5, 10)),
    Source("plant", "Mushroom", Stat(10, 150, 0, 250), Stat(10, 150, 0, 250), Stat(10, 150, 0, 250), Stat(10, 20, 5, 10)),
];
const FOOD_TYPES = [
    Source(null, "Salad", Stat(50, 200, 10, 75), Stat(50, 200, 10, 50), Stat(10, 50, 5, 10), Stat(2, 10, 2, 5)),
    Source(null, "Juice", Stat(100, 200, 25, 75), Stat(10, 100, 2, 10), Stat(50, 150, 10, 25), Stat(3, 5, 2, 4)),
    Source(null, "Punch", Stat(100, 200, 25, 75), Stat(50, 150, 10, 25), Stat(10, 100, 2, 10), Stat(4, 7, 3, 4)),
    Source(null, "Kebab", Stat(5, 20, 1, 5), Stat(10, 50, 25, 75), Stat(50, 100, 50, 100), Stat(9, 18, 2, 5)),
    Source(null, "Soup", Stat(50, 150, 10, 25), Stat(50, 150, 10, 25), Stat(50, 150, 10, 25), Stat(3, 4, 2, 3)),
    Source(null, "Candy", Stat(150, 250, 30, 100), Stat(10, 100, 2, 10), Stat(10, 100, 2, 10), Stat(1, 2, 3, 4)),
];
const STATS = ["sweet", "sour", "spicy", "value"];
const COOKABLE = ["fruit", "vegetable", "fish", "plant", "meat"];
const COMMANDS = {
    water: (_reply, chatter, profile) => {
        if (profile.watered[0]) { _reply("[🍄🐰] You've already watered the plant this stream!"); return; }
        profile.watered = [true, true]; data("chungus.user." + chatter.twitch.id, profile);
        let water = data().chungus.water;
        water[0] += 1;
        if (water[0] >= water[1]) harvest(_reply, water[1]);
        else {
            data("chungus.water", water);
            _reply(`[🍄🐰] Successfully watered! Progress: ${water[0]} / ${water[1]}`);
            send("web", "ws", "lala", "water", water[0]);
        }
    },
    cook: (_reply, chatter, profile, ...select) => {
        if (!select?.length) { _reply("[🍄🐰] Usage: !chungus cook [inventory number or name]"); return; }  
        select = getSelection(profile, select);
        if (select === -1) { _reply("[🍄🐰] This item does not exist in your inventory. see !chungus inventory"); return; }
        let fruit = profile.inventory[select];
        if (!COOKABLE.includes(fruit.type)) { _reply(`[🍄🐰] ${describe(fruit)} cannot be cooked!`); return; }
        profile.inventory.splice(select, 1);
        profile.select = profile.select.map(x => x > select ? x - 1 : x);
        let food_source = random(FOOD_TYPES);
        let star = getStars(2 /* todo: cooking power */, 3);
        let food = { type: "food", name: `${fruit.name} ${food_source.name}`, star: fruit.star + star };
        for (let stat of STATS) {
            food[stat] = fruit[stat] + Math.floor(random(food_source[stat].min, food_source[stat].max) + (star * 2 * random(food_source[stat].min_per_star, food_source[stat].max_per_star)));
        }
        if (food.star > 5) food.value *= ((food.star - 5) + 1); // x1.5 for masterwork, x2 for mythical
        let found = false;
        for (let i = 0; i < 3; i++) if (!profile.select[i]) {
            profile.select[i] = profile.inventory.length;
            found = true;
            break;
        }
        _reply(`[🍄🐰] Successfully Created ${describe(food)}! ${found ? "The food was automatically added to your menu." : "To add the food into your menu, use !chungus select " + profile.inventory.length}`);
        profile.inventory.push(food);
        data("chungus.user." + chatter.twitch.id, profile);
    },
    sell: (_reply, chatter, profile, ...select) => {
        if (!select?.length) { _reply("[🍄🐰] Usage: !chungus sell [inventory number or name]"); return; }  
        select = getSelection(profile, select);
        if (select === -1) { _reply("[🍄🐰] This item does not exist in your inventory. see !chungus inventory"); return; }
        let tosell = profile.inventory[select];
        if (tosell.value <= 0) { _reply(`[🍄🐰] ${describe(tosell)} cannot be sold!`); return; }
        profile.inventory.splice(select, 1);
        profile.select = profile.select.map(x => x === select ? null : (x > select ? x - 1 : x));
        profile.money += tosell.value;
        _reply(`[🍄🐰] Successfully sold ${describe(tosell)} for ${tosell.value}ణ!`);
        data("chungus.user." + chatter.twitch.id, profile);
    },
    select: select,
    deselect: (_reply, chatter, profile, slot) => {
        if (slot <= 0 || slot > 3) { _reply("[🍄🐰] Usage: !chungus deselect [slot(1, 2 or 3)]"); return; }  
        if (profile.select[slot - 1] === null) { _reply("[🍄🐰] This slot is already empty!"); return; }
        profile.select[slot - 1] = null;
        _reply(`[🍄🐰] Successfully deletected slot ${slot}!`);
        data("chungus.user." + chatter.twitch.id, profile);
    },
    restaurant: select,
    menu: select,
    inventory: inventory,
    inv: inventory,
    me: inventory,
    profile: inventory,
    pay: (_reply, chatter, profile, to, amount) => {
        if (!to || !amount || typeof numberish(amount) !== "number") { _reply("[🍄🐰] Usage: !chungus pay [name without @] [ణ amount]"); return; }  
        let target = data().user[to] ?? data().user[getID(to)];
        if (!target) { _reply("[🍄🐰] User not found!"); return; }  
        let ptarget = data().chungus.user[target.twitch.id] ?? INITIAL_USERDATA();
        amount = Number(amount);
        if (amount < 0) { _reply("[🍄🐰] Cannot give negative ణ!"); return; }
        amount = Math.min(amount, profile.money);
        profile.money -= amount; ptarget.money += amount;
        _reply(`[🍄🐰] Transferred ${amount}ణ to ${target.twitch.name}!`);
        data("chungus.user." + chatter.twitch.id, profile);
        data("chungus.user." + target.twitch.id, ptarget);
    },
    give: (_reply, chatter, profile, to, ...select) => {
        if (!to || !select?.length) { _reply("[🍄🐰] Usage: !chungus give [name without @] [inventory number or name]"); return; }  
        let target = data().user[to] ?? data().user[getID(to)];
        if (!target) { _reply("[🍄🐰] User not found!"); return; }  
        let ptarget = data().chungus.user[target.twitch.id] ?? INITIAL_USERDATA();
        select = getSelection(profile, select);
        if (select === -1) { _reply("[🍄🐰] This item does not exist in your inventory. see !chungus inventory"); return; }
        if (profile.inventory[select].untradable) { _reply("[🍄🐰] This item is untradable!"); return; }
        let item = profile.inventory.splice(select, 1)[0];
        ptarget.inventory.push(item);
        profile.select = profile.select.map(x => x === select ? null : (x > select ? x - 1 : x));
        _reply(`[🍄🐰] Transferred ${describe(item)} to ${target.twitch.name}!`);
        data("chungus.user." + chatter.twitch.id, profile);
        data("chungus.user." + target.twitch.id, ptarget);
    },
    leaderboard: (_reply, chatter, profile, category, page=1) => {
        if (!category || !STATS.includes(category.toLowerCase()) || typeof numberish(page) !== "number") { _reply("[🍄🐰] Usage: !chungus leaderboard [sweet/sour/spicy/value] [page (default:1)]"); return; }  
        category = category.toLowerCase();
        const USERS = data().chungus.user;
        let lb = [];
        for (let id in USERS) lb.push([id, category === "value" ? USERS[id].money : USERS[id].select.reduce((a, x) => x === null ? a : a + USERS[id].inventory[x][category], 0)]);
        let pages = Math.ceil(lb.length / 10);
        if (page <= 0 || page > pages) page = 1;
        _reply(`[🍄🐰] ${category[0].toUpperCase() + category.slice(1)}ness Leaderboard (page ${page}/${pages}) | \n${lb.sort((a, b) => b[1] - a[1]).slice(10 * (page - 1), 10 * page).map((x, i) => (10 * (page - 1) + i + 1) + ": " + (data().user[x[0]]?.twitch?.name ?? "Unknown User") + ": " + x[1] + {"sweet": "🍏", "sour": "🍋", "spicy": "🌶", "value": "ణ"}[category]).join(" | \n")}`);
    },
    help: info,
    info: info,
}
function getStars(_chance, max) {
    let chance = 1 / Math.max(1, _chance);
    for (let i = 0; i < max; i += 0.5) {
        if (Math.random() < chance) return i;
    } return max;
}
function harvest(_reply, prevwater) {
    const fruit_source = random(FRUITS);
    let fruit = { type: fruit_source.type, name: fruit_source.name, star: getStars(Math.log10(prevwater) + 1, 3) };
    for (let stat of STATS) {
        fruit[stat] = Math.floor(random(fruit_source[stat].min, fruit_source[stat].max) + (fruit.star * 2 * random(fruit_source[stat].min_per_star, fruit_source[stat].max_per_star)));
    }
    const newwater = prevwater + 2;
    send("web", "ws", "lala", "water", 0, newwater);
    const USERS = data().chungus.user;
    for (let k in USERS) {
        if (!USERS[k].watered[1]) continue;
        USERS[k].watered[1] = false;
        USERS[k].inventory.push(JSON.parse(JSON.stringify(fruit)));
    }
    data("chungus", {water: [0, newwater], user: USERS});
    send("web", "ws", "lala", "water", 0, newwater);
    _reply(`[🍄🐰] The plant is fully grown! Every participant was given a brand new ${describe(fruit)}. (progress: 0 / ${newwater})`);
}
function getSelection(profile, select) {
    if (Array.isArray(select)) select = select.join(" ");
    if (!Number.isNaN(parseInt(select))) { // index
        select = Number(select);
        if (select % 1 !== 0 || select <= 0 || select > profile.inventory.length) return -1;
        return select - 1;
    }
    return profile.inventory.findIndex(x => describe(x, true).toLowerCase().startsWith(select.trim().toLowerCase())) // name
}
function select(_reply, chatter, profile, slot, ...select) {
    if (!select?.length || slot < 0 || slot > 3) { _reply("[🍄🐰] Usage: !chungus select [slot(1, 2 or 3)] [inventory number or name]"); return; }  
    select = getSelection(profile, select);
    if (select === -1) { _reply("[🍄🐰] This item does not exist in your inventory. see !chungus inventory"); return; }
    let food = profile.inventory[select];
    if (food.type !== "food") { _reply(`[🍄🐰] ${describe(food)} is not a completed food!`); return; }
    if (profile.select.indexOf(select) !== -1) { _reply(`[🍄🐰] ${describe(food)} is already selected!`); return; }
    if (slot === 0) {
        let idx = profile.select.indexOf(null);
        if (idx !== -1) profile.select[idx] = select;
        else profile.select = [...profile.select.slice(1), select];
    } else profile.select[slot - 1] = select;
    _reply(`[🍄🐰] Successfully selected ${describe(food)}!`);
    data("chungus.user." + chatter.twitch.id, profile);
}
function describe(item, more=false) {
    let ret = "";
    if (item.star >= 1) ret += "[";
    if (item.star >= 6) ret += ({
        6: "🌟Masterwork",
        7: "🌀Mythical",
        8: "🌌Legendary",
        // to come...
    })[Math.floor(item.star)] ?? " ? ? ? ";
    else for (let i = 0; i < Math.floor(item.star); i++) ret += "★";
    if (item.star >= 1) ret += "] ";
    ret += item.name;
    if (more) {
        let subret = "";
        if (COOKABLE.includes(item.type) || item.type === "food") {
            subret += `${item.sweet}🍏/${item.sour}🍋/${item.spicy}🌶`;
            if (item.value > 0) subret += ", ";
        }
        if (item.value > 0) subret += `sell: ${item.value}ణ`
        if (subret !== "") ret += `(${subret})`;
    }
    return ret;
}
function inventory(_reply, chatter, profile, name, page=1) {
    if (typeof numberish(page) !== "number") { _reply("[🍄🐰] Usage: !chungus inventory [name without @ (default: yourself)] [page (default:1)]"); return; }  
    if (!Number.isNaN(parseInt(name))) { page = name; name = undefined; }
    if (name) {
        let user = Object.values(data().user).find(x => String(x?.twitch?.login)?.toLowerCase() === String(name)?.toLowerCase());
        if (!user) { _reply("[🍄🐰] Could not find the user!"); return; }
        profile = data().chungus.user[user.twitch.id] ?? INITIAL_USERDATA();
        name = user.twitch.name;
    } else name = chatter.twitch.name;
    let pages = Math.floor((profile.inventory.length - 5.5) / 10) + 2;
    if (page <= 0 || page > pages) page = 1;
    let txt = "";
    if (page === 1) {
        let total = {}; for (let category of ["sweet", "sour", "spicy"]) total[category] = 0;
        for (let idx of profile.select) {
            if (idx === null) continue;
            for (let category of ["sweet", "sour", "spicy"]) total[category] += profile.inventory[idx][category];
        }
        txt += `Total Stat: ${total.sweet}🍏/${total.sour}🍋/${total.spicy}🌶 | \n`;
        txt += `${profile.money}ణ | \n`;
    }
    let inv = page === 1 ? profile.inventory.slice(0, 5) : profile.inventory.slice(5 + 10 * (page - 2), 15 + 10 * (page - 2));
    let i = page === 1 ? 1 : (6 + 10 * (page - 2));
    for (let entry of inv) { txt += `${i}: ${describe(entry, true)} | \n`; i++; }
    if (page === 1 && pages > 1) txt += "(use !chungus inventory [page] to see the rest of the inventory!)";
    _reply(`[🍄🐰] ${name}'s Inventory (page ${page}/${pages}) | go to https://prod.kr/lala/chungus/ to manage inventory | \n${txt}`);
}
function info(_reply, chatter, profile) { _reply("[🍄🐰] chungusgame v1.0 || chungusgame is a side-stream minigame where you can water plants. your water regenerates every lala stream, and when enough people water the plant you recieve a random fruit. You can then cook that fruit into a random food that has 3 stats and a sell value. You can select up to 3 foods as your \"menu\", the goal is to maximize the stat of your total menu. || twitch.tv/lala_amanita || prodzpod 2025"); }