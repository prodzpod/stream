//? PROD
//? Language: Javascript
//? Control Flow: 
//?   [x] sanity check
//?   [v] load data
//?   [v] initialize all modules
//?   [v] s t a y c u t e
const fs = require('fs');
const PNG = require('pngjs').PNG;

const COLOR_CHANGE_NOT_REQUIRED = -1;
function printOverengineeredASCIIArtLOL(fname, palette) { return new Promise(resolve => {
    let occurance = {};
    fs.createReadStream(fname).pipe(new PNG()).on('parsed', function() {
        const png = this;
        const pixels = iota(png.height).map(y => iota(png.width).map(x => {
            const idx = (png.width * y + x) << 2;
            const color = Array.from(png.data.subarray(idx, idx + 3)).map(x => x.toString(16).toUpperCase().padStart(2, '0')).join("");
            if (palette[color] === undefined) throw `[PROD@INIT: ASCII ART] color ${color} does not exist`;
            occurance[color] ??= 0;
            let ret = [...palette[color]];
            if (typeof ret[0] === 'function') ret[0] = ret[0](occurance[color]);
            else if (ret[0].length > 1) ret[0] = ret[0][occurance[color] % ret[0].length];
            occurance[color] += 1;
            return ret;
        }));
        const trueWidth = pixels.map(row => {
            for (let i = row.length - 1; i >= 0; i--) if (row[i][0] !== " ") return i + 1;
            return 0;
        })
        let currentColor = 15; // white
        for (let y = 0; y < pixels.length; y++) {
            let txt = "";
            for (let x = 0; x < trueWidth[y]; x++) {
                const [char, color] = pixels[y][x];
                if (color !== COLOR_CHANGE_NOT_REQUIRED && color !== currentColor) {
                    txt += `\x1b[38;5;${color}m`;
                    currentColor = color;
                }
                txt += char;
            }
            if (y === pixels.length - 1) txt += `\x1b[0m`;
            console.log(txt);
        }
        resolve(0);
    });
    function iota(n) { let ret = []; for (let i = 0; i < n; i++) ret.push(i); return ret; };
});}

(async function __main__() {

console.log("");
await printOverengineeredASCIIArtLOL("asciiart.png", {
    // blank
    "000000": [" ", COLOR_CHANGE_NOT_REQUIRED], 
    // squares
    "CBDAFF": [".", 153], 
    "96B5FF": ["-", 44], 
    "5A8BFF": ["+", 37],
    "2263FF": ["#", 67], 
    // moon
    "FFF3C3": [".", 228], 
    "FFE687": ["-", 227], 
    "FFD947": ["+", 15],
    "FFCB00": ["#", 221], 
    // prod
    "FFE1B0": [".", 11],
    "FFCE80": ["-", 226], 
    "FFB640": ["+", 220],
    "FF9E00": ["#", 214], 
    "2C3452": ["#", 19], // bow ribbon
    "407C3C": ["#", 28], // tail ribbon
    "FF00E1": [">:3c", 11],
    // caption/title
    "C3FFFA": [".", 228],
    "9AFFF6": ["-", 227],
    "71FFF2": ["+", 226], 
    "D9FFD1": ["#", 220],
    "00CFBD": ["*", 49], 
    "00FFE9": ["PRODZPODPRODUCTIONS", 11], 
});
console.log("prod.stream v2.0, https://prod.kr");
console.log(`have a good day \x1b[38;5;49m<3\x1b[0m`);
console.log("");
// #REGION boot up @main/server
if (process.argv.some(x => x === "-v" || x === "--verbose")) require("./src/@main/commonServer").setLogLevel("ALL");
await require("./src/@main/index").init();
// #REGION boot up the rest of the things
if (process.argv.every(x => x !== "-m" && x !== "--minimal")) for (let k of module.exports.initModules) 
    require("./src/@main/src/@meta/module").start(k, process.argv.some(x => x === "-d" || x === "--debug"));
})();

module.exports.initModules = ["twitch", "discord", "web", "qat", "gpt", "gcp"];
module.exports.streamModules = ["obs", "tracker" /*, "fl"*/];