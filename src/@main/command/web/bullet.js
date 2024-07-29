const { unbits, deidn, Math } = require("../../common");

module.exports.execute = async (text) => {
    return [0, longen(text)];
}

const MAIN = "0123456789+-*/.$()[]bafdsrxy~:;'";
const H = {
    ":h": "x",
    ":v": "y",
    "bullet": "b",
    "action": "a",
    "fire": "f",
    "dir": "d",
    "speed": "s",
    "_aim": "*",
    "_r": "/",
    "_seq": "+",
    "repeat": "r",
    "accel": "b",
    "wait": "x",
    "vanish": "y",
    ",": "x",
};

function _compile(raw) {
    if (raw[0] === ":") { // hbm
        raw = raw.slice(1);
        let vars = [];
        if (raw.startsWith("h:")) { raw = raw.slice(2); raw = "x" + raw; }
        else if (raw.startsWith("v:")) { raw = raw.slice(2); raw = "y" + raw; }
        while (raw.includes("\"")) {
            let start = raw.indexOf("\"");
            let end = raw.indexOf("\"", start + 1);
            let label = raw.slice(start + 1, end);
            let id = 0;
            if (label === "top") id = 0;
            else if (vars.includes(label)) id = vars.indexOf(label) + 1;
            else { vars.push(label); id = vars.length; }
            raw = raw.slice(0, start) + id + raw.slice(end + 1);
        }
        for (const k of ["bullet", "action", "fire"]) { let re = new RegExp(k + "\\*\\d+\\["); let i = 0; while (re.test(raw.slice(i))) {
            let start = raw.slice(i).match(re).index + i;
            let end = raw.indexOf("]", start + 1); if (end === -1) end = raw.length;
            let br = raw.indexOf("[", start);
            raw = raw.slice(0, br) + "[x" + raw.slice(br + 1, end).replaceAll(",", "x") + raw.slice(end);
            i = raw.indexOf("]", br + 1); if (end === -1) end = raw.length;
        }}
        for (const k of ["bullet", "action", "fire"]) { let re = new RegExp(k + "\\+\\d+\\["); let i = 0; while (re.test(raw.slice(i))) {
            let start = raw.slice(i).match(re).index + i;
            let end = raw.indexOf("]", start + 1); if (end === -1) end = raw.length;
            let br = raw.indexOf("[", start);
            raw = raw.slice(0, br) + "[x" + raw.slice(br + 1, end).replaceAll(",", "x") + raw.slice(end);
            i = raw.indexOf("]", br + 1); if (end === -1) end = raw.length;
        }}
        raw = raw.replace(/\s+/g, "");
        for (const k of Object.keys(H)) raw = raw.replaceAll(k, H[k]);
        raw = vars.join(",") + "!" + raw.replaceAll("$rank", "$$$$").replaceAll("$rand", "$$");
    }
    let _idx = raw.indexOf("^");
    if (_idx === -1) _idx = raw.indexOf("!");
    let names = false, compress = false;
    if (_idx >= 0 && raw[_idx] === "^") compress = true;
    if (_idx > 0) names = true;
    if (names) {
        names = raw.slice(0, _idx).split(",");
        raw = raw.slice(_idx + 1);
    } else if (_idx === 0) raw = raw.slice(1);
    if (compress) raw = _decompress(raw);
    let vars = names || [], str = raw;
    vars = ["top", ...vars];
    // pass 1: unzip :;'
    let _str = "", level = 0;
    for (let i = 0; i < str.length; i++) switch (str[i]) {
        case "[": level++; _str += "["; break;
        case "]": level--; _str += "]"; break;
        case "'": for (; level > 2; level--) _str += "]"; level = 2; break;
        case ";": for (; level > 1; level--) _str += "]"; level = 1; break;
        case ":": for (; level > 0; level--) _str += "]"; level = 0; break;
        default: _str += str[i]; break;
    } str = _str; if (level > 0) str = str + "]".repeat(level); _str = "";
    let label = "none";
    if (str[0] === "x") { label = "horizontal"; str = str.slice(1); } 
    else if (str[0] === "y") { label = "vertical"; str = str.slice(1); } 
    // pass 2: unzip implied []s
    let _state = 0;
    for (let i = 0; i < str.length; i++) {
        const letter = /[a-z]/.test(str[i]);
        if (_state === 0 && letter) _state = 1;
        else if (_state === 1 && str[i] === "[") _state = 0;
        else if (_state === 1 && (str[i] === "]" || letter)) { _str += "[]"; _state = letter ? 1 : 0; }
        _str += str[i]
    } str = _str;
    // pass 3: parse
    function sort(str) {
        if (str === "") return [];
        let ret = [], temp = { op: "", label: "", content: "" }; 
        while (str.length) {
            temp.op += str[0]; str = str.slice(1);
            if ("*/+".includes(str[0])) { temp.op += str[0]; str = str.slice(1); }
            let idx = str.indexOf("["); if (idx === -1) idx = str.length;
            temp.label = str.slice(0, idx); str = str.slice(idx + 1);
            let level = 1;
            while (str.length) {
                let c = str[0];
                str = str.slice(1);
                if (c === "[") level++;
                else if (c === "]") level--;
                if (level === 0) break;
                temp.content += c;
            }
            ret.push(temp); temp = { op: "", label: "", content: "" }; 
        }
        return ret.map(x => ({ op: x.op, label: x.label, content: sort(x.content) }));
    }
    return [{ op: "bulletml", label: label, content: sort(str) }, vars];
}
const END_BITS = 15;
const MAIN_BITS = 5;
function _decompress(str) {
    let ret = deidn(str).split("").map(x => x.codePointAt(0));
    for (let i = 0; i < ret.length; i += 2) { let temp = ret[i]; ret[i] = ret[i+1]; ret[i+1] = temp; }
    let ret2 = [];
    for (let i = 0; i < ret.length; i++) for (let j = 0; j < 8; j++) ret2.push((ret[i] & (1 << j)) ? 1 : 0);
    for (let i = Math.demod(ret2.length, 16) - 16; i >= 0; i -= 16) ret2.splice(i + END_BITS, 16 - END_BITS);
    let i = 0;
    let ret3 = "";
    while (i + MAIN_BITS < ret2.length) {
        let c = unbits(ret2.slice(i, i + MAIN_BITS))[0];
            ret3 += MAIN[c];
            i += MAIN_BITS;
    }
    return ret3.replace(/:0+$/, ":");
} 

function longen(raw) {
    let txt = `<?xml version="1.0" ?>\n<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\n\n<bulletml type="%%TYPE%%" xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\n\n%%MAIN%%\n\n</bulletml>\n`;
    let [data, vars] = _compile(raw.replaceAll("\xA0", " "));
    txt = txt.replace("%%TYPE%%", data.label);
    // pass 4: build xml
    function tonum(label) { 
        label = label.trim().replaceAll("$$", "$$rank");
        while (/(^|[\+\-\*/])\$($|[\+\-\*/])/.test(label)) label = label.replaceAll(/(^|[\+\-\*/])\$($|[\+\-\*/])/g, "$1$$rand$2"); 
        label = label.replace(/([^\d\.]|^)\./g, "$10.");
        return label;
    }
    function tostr(label) { if (label === "") return undefined; return vars[label] ?? "var" + label; }
    function xml(state, param) { return [`<${state}${Object.values(param).filter(x => x !== undefined).length ? " " : ""}${Object.entries(param).filter(x => x[1] !== undefined).map(x => `${x[0]}="${x[1]}"`).join(" ")}>`, `</${state}>`]; }
    function compile(op, parent, level) {
        let state = "", param = {}, content = "";
        // console.log("state:", parent, op, level);
        switch (`${parent}.${op.op}`) {
            case "bulletml.b": state = "bullet"; param.label = tostr(op.label); break;
            case "bullet.d": state = "direction"; param.type = "absolute"; content = tonum(op.label); break;
            case "bullet.d*": state = "direction"; param.type = "aim"; content = tonum(op.label); break;
            case "bullet.d/": state = "direction"; param.type = "relative"; content = tonum(op.label); break;
            case "bullet.d+": state = "direction"; param.type = "sequence"; content = tonum(op.label); break;
            case "bullet.s": state = "speed"; param.type = "absolute"; content = tonum(op.label); break;
            case "bullet.s/": state = "speed"; param.type = "relative"; content = tonum(op.label); break;
            case "bullet.s+": state = "speed"; param.type = "sequence"; content = tonum(op.label); break;
            case "bullet.a": state = "action"; param.label = tostr(op.label); break;
            case "bullet.a*": state = "actionRef"; param.label = tostr(op.label); break;
            case "bullet.a+": {
                let arr = op.content.map((x, i) => x.label.replaceAll("$0", i));
                return arr.map(x => compile({op: "a*", label: op.label, content: [{op: "x", label: x, content: []}]}, parent, level)).join("\n");
            }
            case "bulletml.a": state = "action"; param.label = tostr(op.label); break;
            case "action.r": state = "repeat"; content = `<times>${tonum(op.label)}</times>`; break;
            case "repeat.a": state = "action"; param.label = tostr(op.label); break;
            case "repeat.a*": state = "actionRef"; param.label = tostr(op.label); break;
            case "action.d": {
                state = "changeDirection"; 
                let [dir, term] = op.label.split("~");
                content = `<direction>${tonum(dir)}</direction><term>${tonum(term)}</term>`;
            } break;
            case "action.d/": {
                state = "changeDirection"; 
                let [dir, term] = op.label.split("~");
                content = `<direction type="relative">${tonum(dir)}</direction><term>${tonum(term)}</term>`;
            } break;
            case "action.d*": {
                state = "changeDirection"; 
                let [dir, term] = op.label.split("~");
                content = `<direction type="aim">${tonum(dir)}</direction><term>${tonum(term)}</term>`;
            } break;
            case "action.d+": {
                state = "changeDirection"; 
                let [dir, term] = op.label.split("~");
                content = `<direction type="sequence">${tonum(dir)}</direction><term>${tonum(term)}</term>`;
            } break;
            case "action.s": {
                state = "changeSpeed"; 
                let [speed, term] = op.label.split("~");
                content = `<speed>${tonum(speed)}</speed><term>${tonum(term)}</term>`;
            } break;
            case "action.s/": {
                state = "changeSpeed"; 
                let [speed, term] = op.label.split("~");
                content = `<speed type="relative">${tonum(speed)}</speed><term>${tonum(term)}</term>`;
            } break;
            case "action.b": state = "accel"; content = `<term>${tonum(op.label)}</term>`; break;
            case "accel.x": state = "horizontal"; param.type = "absolute"; content = tonum(op.label); break;
            case "accel.x/": state = "horizontal"; param.type = "relative"; content = tonum(op.label); break;
            case "accel.x+": state = "horizontal"; param.type = "sequence"; content = tonum(op.label); break;
            case "accel.y": state = "vertical"; param.type = "absolute"; content = tonum(op.label); break;
            case "accel.y/": state = "vertical"; param.type = "relative"; content = tonum(op.label); break;
            case "accel.y+": state = "vertical"; param.type = "sequence"; content = tonum(op.label); break;
            case "action.x": state = "wait"; content = tonum(op.label); break;
            case "action.y": state = "vanish"; break;
            case "action.a": state = "action"; param.label = tostr(op.label); break;
            case "action.a*": state = "actionRef"; param.label = tostr(op.label); break;
            case "action.a+": {
                let arr = op.content.map((x, i) => x.label.replaceAll("$0", i));
                return arr.map(x => compile({op: "a*", label: op.label, content: [{op: "x", label: x, content: []}]}, parent, level)).join("\n");
            }
            case "action.f": state = "fire"; param.label = tostr(op.label); break;
            case "action.f*": state = "fireRef"; param.label = tostr(op.label); break;
            case "action.f+": {
                let arr = op.content.map((x, i) => x.label.replaceAll("$0", i));
                return arr.map(x => compile({op: "f*", label: op.label, content: [{op: "x", label: x, content: []}]}, parent, level)).join("\n");
            }
            case "bulletml.f": state = "fire"; param.label = tostr(op.label); break;
            case "fire.d": state = "direction"; param.type = "absolute"; content = tonum(op.label); break;
            case "fire.d*": state = "direction"; param.type = "aim"; content = tonum(op.label); break;
            case "fire.d/": state = "direction"; param.type = "relative"; content = tonum(op.label); break;
            case "fire.d+": state = "direction"; param.type = "sequence"; content = tonum(op.label); break;
            case "fire.s": state = "speed"; param.type = "absolute"; content = tonum(op.label); break;
            case "fire.s/": state = "speed"; param.type = "relative"; content = tonum(op.label); break;
            case "fire.s+": state = "speed"; param.type = "sequence"; content = tonum(op.label); break;
            case "fire.b": state = "bullet"; param.label = tostr(op.label); break;
            case "fire.b*": state = "bulletRef"; param.label = tostr(op.label); break;
            case "bulletRef.x": state = "param"; content = tonum(op.label); break;
            case "actionRef.x": state = "param"; content = tonum(op.label); break;
            case "fireRef.x": state = "param"; content = tonum(op.label); break;
        }
        let [head, tail] = xml(state, param), space = " ".repeat(level);
        if (op.content.length) return `${space}${head}\n${content ? (space + " " + content + "\n") : ""}${op.content.map(x => compile(x, state, level + 1)).join("\n")}\n${space}${tail}`;
        else if (content) return `${space}${head}${content}${tail}`;
        else return `${space}${head.slice(0, -1)}/>`;
    }
    txt = txt.replace("%%MAIN%%", data.content.map(x => compile(x, data.op, 0)).join("\n\n"));
    return txt;
}
