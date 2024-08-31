const WebSocket = require('ws');
const zlib = require("zlib");
const { log, error, send } = require('./ws');
const { Color, nullish } = require('./common');

let ws, model = [];
module.exports.init = () => {
    // Connection opened
    ws = new WebSocket("wss://colonq.computer/bullfrog/api/channel/listen/model");
    ws.addEventListener("open", _ => log("open"));
    ws.addEventListener("message", x => zlib.gunzip(x.data, (_, d) => handleClonk(d)));
    ws.addEventListener("error", error);
    ws.addEventListener("close", (code) => { log(code); process.exit(); });
    for (let i = 0; i < 64; i++) {
        model[i] = [];
        for (let j = 0; j < 64; j++) {
            model[i][j] = [0, 0, 0, "  "];
        }
    }
}
module.exports.model = () => model;
module.exports.end = () => ws?.close();
module.exports.printClonk = printClonk;

function handleClonk(bytes) {
    let idx = 0;
    let len = Buffer.byteLength(bytes);
    let state = "init";
    let prevstate = [0, 0, ""];
    let x = 0, y = 0;
    function get(n) { let r = bytes.slice(idx, idx + n); idx += n; return n == 1 ? r[0] : Array.from(r); }
    function letter() { let str = get(4).reverse(); let ret = 0; for (let i = 0; i < 4; i++) ret += str[i] * (1 << (8 * i)); return String.fromCodePoint(ret); }
    while (idx < len) switch (state) {
        case "init":
            state = get(1) ? "diff" : "keyframe";
            if (state == "diff") get(4);
            else { x = -1; y = 0; }
            break;
        case "keyframe":
            x++; if (x == 64) { x = 0; y++; }
            prevstate = [x, y, state];
            state = "cell";
            break;
        case "diff":
            prevstate = [get(1), get(1), state];
            state = "cell";
            break;
        case "cell":
            [x, y, state] = prevstate;
            if (!get(1)) {
                model[x][y] = [0, 0, 0, "  "];
                break;
            } else {
                get(1); // unused
                let r = get(1), g = get(1), b = get(1), cp = letter(), opt = get(1);
                if (opt) cp = cp + letter();
                model[x][y] = [r, g, b, cp];
            }
            break;
    }
    let currentColor = 0;
    let blanks = 0;
    let ret = "";
    for (let i = 0; i < model.length; i++) for (let j = 0; j < model[i].length; j++) {
        let cell = model[j][i];
        if (nullish(cell[3])) { // not blanks
            if (blanks > 0) ret += blanks.toString(); 
            let color = (cell[0] << 16) + (cell[1] << 8) + cell[2];
            if (color !== currentColor) {
                currentColor = color;
                ret += "\x02" + Color.toHex(color).slice(-6);
            } else if (blanks > 0) ret += "\x03";
            ret += cell[3].padEnd(2, " ");
            blanks = 0;
        } else {
            if (!blanks) ret += "\x01";
            blanks += 2;
        }
    }
    send("tracker", ret);
}
function printClonk() { return transpose(model).map(x => x.map(y => y[3]).join("")).join("\n"); }
function transpose(arr) { 
    let ret = [];
    for (let _ in arr[0]) ret.push([]);
    for (let i = 0; i < arr.length; i++) for (let j = 0; j < arr[i].length; j++) ret[j][i] = arr[i][j];
    return ret;
};