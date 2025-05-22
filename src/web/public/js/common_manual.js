var WASD = {"pack":(...words) => {
        function _pack(x) {
            x = array(x);
            const type = realtype(x);
            if (type === "array") return `[${x.map(y => _pack(y)).join(" ")}]`;
            if (type === "object") return `{${Object.entries(x).map(y => `${_pack(WASD.toString(y[0]))} ${_pack(y[1])}`).join(" ")}}`;
            x = x?.toString().trim() ?? "";
            if (x === "") return '""';
            if (x.startsWith("\0")) x = " " + x.slice(1);
            if (/\s/.test(x) || x.startsWith('"') || x.includes("[") || x.includes("]") || x.includes("{") || x.includes("}")) 
                return `"${x.replaceAll('"', '""')}"`;
            else return x;
        }
        return words.map(x => _pack(x)).join(" ");
    },"unpack":str => {
        if (typeof str !== "string") str = str?.toString() ?? "";
        function _unpack(str) {
            let ret = [];
            str = str.trim();
            while (str.length > 0) {
                let end = 0, substr = "", _endChar = "}", forceString = false;
                switch (str[0]) {
                    case "[": _endChar = "]"; // passthrough to other
                    case "{":
                        let lvl = 1, quote = false, _startChar = str[0];
                        for (end = 1; end < str.length; end++) {
                            if (str[end] === "\"") quote = !quote;
                            else if (!quote && str[end] === _startChar) lvl++;
                            else if (!quote && str[end] === _endChar) lvl--;
                            if (lvl <= 0) break;
                        }
                        substr = _unpack(str.slice(1, end)); end++;
                        if (str[0] !== "[") substr = unentry(group(substr, 2)); // un-kv-ify
                        break;
                    case "\"":
                        let res = /((?:[^"]|^)(?:"")*")(?:[^"]|$)/.exec(str.slice(1));
                        end = res.index + res[1].length + 1;
                        substr = str.slice(1, end - 1).replaceAll("\"\"", "\"");
                        if (substr.startsWith(" ")) { substr = substr.slice(1); forceString = true; }
                        break;
                    default: 
                        end = /\s|$/.exec(str).index; 
                        substr = str.slice(0, end);
                        break;
                }
                ret.push(forceString ? substr : unstringify(substr));
                str = str.slice(end).trim();
            }
            return ret;
        }
        return _unpack(str);
    },"toString":str => {
        if (realtype(unstringify(str)) !== "string") return `\0${stringify(str)}`
        else return str;
    }};
var trueish = o => {
    o = nullish(o);
    if (o === null) o = false;
    switch (typeof o) {
        case "boolean": return o;
        case "number": case "bigint": return o > 0 ? o : 0;
    }
    return o;
};
var nullish = o => {
    o = unstringify(o);
    if (o === undefined || o === null || Number.isNaN(o)) return null;
    switch (realtype(o)) {
        case "string": return o.trim() === "" ? null : o;
        case "array": return o.length === 0 ? null : o;
        case "map": case "set": return o.size === 0 ? null : o;
        case "object": return Object.keys(o).length === 0 ? null : o;
    }
    return o;
};
var numberish = o => { 
    if (Array.isArray(o)) return o; 
    let str = o?.toString().trim();
    if (str === "∞" || str === "♾") return Infinity; 
    if (str === "-∞" || str === "-♾") return -Infinity; 
    const ret = Number(o); 
    return str === "" || Number.isNaN(ret) || !Math.between(-Math.pow(2, 53), ret, Math.pow(2, 53)) ? o : ret; 
};
var array = o => { if (!Array.isArray(o) && o?.length) return o; if (typeof o === "string") return o; if (o instanceof Map) return unentry(a.entries()); try { const ret = Array.from(o); return ret.length !== 0 ? ret : o; } catch { return o; }};
var unstringify = str => {
    if (typeof str !== "string") return str;
    str = str.trim();
    switch (str.toLowerCase()) {
        case "": case "null": return null;
        case "undefined": return undefined;
        case "nan": return NaN;
        case "true": return true;
        case "false": return false;
        default:
            if (str[0] === "{" || str[0] === "[") try { return JSON.parse(str); } catch (_) { return str; }
            return numberish(str);
    }
};
var stringify = str => {
    if (typeof str === "string") return str;
    const type = realtype(str);
    switch (type) {
        case "array": return JSON.stringify(stringifyArray(str));
        case "object": return JSON.stringify(stringifyObject(str));
        case "set": return JSON.stringify(stringifyArray(array(str)));
        case "map": return JSON.stringify(stringifyObject(array(str)));
        case "function": return str + "";
        default: return String(str);
    }
};
var realtype = a => {
    if (Array.isArray(a)) return "array";
    if (a instanceof Map) return "map";
    if (a instanceof Set) return "set";
    if (a === null) return "null";
    if (Number.isNaN(a)) return "nan";
    if (a instanceof RegExp) return "regex";
    return typeof a;
};
var looselyEqual = (a, b, replaceArrays=true) => {
    a = array(nullish(a)); b = array(nullish(b));
    let type = [realtype(a), realtype(b)];
    if (replaceArrays) {
        if (type[0] === "map") a = a.keys(); if (type[0] === "object") a = Object.keys(a);
        if (type[1] === "map") b = b.keys(); if (type[1] === "object") b = Object.keys(b);
        type = type.map(x => ["map", "object"].includes(x) ? "array" : x);
        if (type.includes("array")) {
            if (type[0] !== "array") a = [a]; if (type[1] !== "array") b = [b];
            for (let _a of a) for (let _b of b) if (looselyEqual(_a, _b, false)) return true;
            return false;
        }
    }
    if (type[0] === "map") a = unentry(a.entries()); if (type[1] === "map") b = unentry(b.entries());
    if (type[0] === "set") a = Array.from(a); if (type[1] === "set") b = Array.from(b);
    if (["map", "object", "set", "array"].includes(type[0])) a = JSON.stringify(a);
    if (["map", "object", "set", "array"].includes(type[1])) b = JSON.stringify(b);
    if (type[0] === "function" && type[1] === "function") return a+"" === b+"";
    if (type[0] === "function") return trueish(a(b));
    if (type[1] === "function") return trueish(b(a));
    if (type[0] === "regex") return a.test(b.toString());
    if (type[1] === "regex") return b.test(a.toString());
    return a.toString().trim().toLowerCase() === b.toString().trim().toLowerCase();
};
var BigMath = {"min":(a, b) => BigInt(a) > BigInt(b) ? BigInt(b) : BigInt(a),"max":(a, b) => BigInt(a) > BigInt(b) ? BigInt(a) : BigInt(b),"abs":n => BigInt(n) * (BigInt(n) >= 0n ? 1n : -1n),"sign":n => BigInt(n) > 0n ? 1n : (BigInt(n) === 0n ? 0n : -1n),"clamp":(x, a, b) => { BigMath.min(BigMath.max(BigInt(x), BigMath.min(a, b)), BigMath.max(a, b)) },"between":(a, b, c, d) => {
        if (d === undefined) return BigMath.min(a, c) <= BigInt(b) && BigInt(b) <= BigMath.max(a, c);
        return BigMath.max(BigMath.min(a, b), BigMath.min(c, d)) <= BigMath.min(BigMath.max(a, b), BigMath.max(c, d));
    },"div":(n, a) => {
        n = BigInt(n) * BigMath.sign(a); a = BigMath.abs(a);
        if (n === 0n) return 0n; // also covers div by 0
        if (n > 0n) return n / a;
        return ((n + 1n) / a) - 1n;
    },"demod":(n, a) => BigInt(n) / BigInt(a) * BigInt(a),"posmod":(n, a) => ((BigInt(n) % BigMath.abs(a)) + BigInt(a)) % BigMath.abs(a) * BigMath.sign(a)};
var random = (a, b) => {
    a = nullish(a);
    b = nullish(b);
    if (a === null) return Math.random();
    switch (typeof a) {
        case "number":
            if (typeof b !== "number") b = 0;
            const max = Math.max(a, b); const min = Math.min(a, b);
            return Math.random() * (max - min) + min;
        case "string":
            a = a.split("");
            // passthrough to OBJECT/ARRAY
        case "object":
            if (Array.isArray(a)) return a[Math.floor(Math.random() * a.length)];
            // WEIGHTED ARRAY: { VALUE: WEIGHT }
            let ret = Math.random() * Math.sum(Object.values(a));
            for (let k in a) { if (ret < a[k]) return k; ret -= a[k]; }
            return Object.keys(a).at(-1);
        case "function":
            return a(Math.random());
    }
};
String.prototype.toProperCase = function () { return this.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) };
String.prototype.hashCode = function () { let hash = 0, i, chr; if (this.length === 0) return hash; for (i = 0; i < 32; i++) { chr = this.charCodeAt(i % this.length); hash = ((hash << 5) - hash) + chr; hash |= 0; } return hash; };
var occurance = (str, sub) => {
    let ret = 0, ptr = 0;
    let oc = str.indexOf(sub, ptr);
    while (oc !== -1) { ret++; ptr = oc + 1; oc = str.indexOf(sub, ptr); }
    return ret;
};
var zeroPad = (o, zeroes) => {
    o = nullish(o); zeroes = trueish(zeroes); if (!zeroes) zeroes = 0;
    if (o === null) return "0".repeat(zeroes);
    switch (typeof o) {
        case "string": return o.padStart(zeroes, "0");
        case "boolean": return (o ? "1" : "0").padStart(zeroes, "0");
        case "object":
            if (!Array.isArray(o)) o = Object.values(o);
            for (let i = o.length; i <= zeroes; i++) o.push(0);
            return o;
        case "number":
            o = Math.prec(o, 3);
            return (Math.sign(o) !== -1 ? "" : "-") + 
                Math.abs(o).toString().padStart(zeroes, "0");
        case "bigint":
            return (BigMath.sign(o) !== -1n ? "" : "-") + 
                BigMath.abs(o).toString().padStart(zeroes, "0");
    }
    throw `${o} could not be zero padded (wtf is this lol)`;
};
var randomHex = n => { let ret = ""; for (let i = 0; i < n; i++) ret += Math.floor(Math.random() * 16).toString(16).toLowerCase(); return ret; };
var ID_ADJECTIVE = ["acceptable","accidental","activate","adamant","alexa play","alien","among","anime","arcane","ascended","atomic","awesome","baba is","baby","bat","big","blazing","blue","boneless","box","buff","chain","chants of","chill","clear","clown","cold","complex","cooked","cool","copper","corporate","cracking the","crazy","crypt of the","cryptic","cute","dawn of","day","dead","deep","diamond","diary of a wimpy","digital","do the","do the","download","dragon","dumb","dungeons and","e","electric","eleventh","environmentally friendly","epic","evil","fake","farming","fe","fifth","fire","first","fishing","flexible","flying","font of","forth","fourth","freaky","free","fried","fruit","gnu","gooning","green","grow","heroes of the","hollow","holy","horse","hot","how to","http","huge","im at","infinite","insane","internet","iron","island of","je ne","john","jump","kinning","last","legend of","libre","lil'","live","losing","loud","magic","majjekal","make some","marvel","mediocre","meh","metaphor for","mighty morphin","mine","mister","mithril","mixed","musical","mythical","negative","nerf","netherite","nice","node","odd","ok google define","old","online","open","open world","order by","pet","piece of","pirate","play","pocket","poor","positive","potion of","proud","quiet","quirky","radical","raw","react","reader x","read","real","red","regular","rich","risk of","rogue","rune","second","settlers of","sharkboy and","short","shovel","sick","simple","skill","slug","smart","sonic","space","speed","star","steel","stop seeing start","straw","strong","summer","super","sussy","tall","test","that","the archives of","there might be","thinky","third","thirty dollar","this","this is","tin","tiny","transcendental","tricky","twelveth","twenty one","typing","uncut","undertime","unreal","vampire","vampire","virtual","warm","weak","weird","what is","when is","where is","who is","why is","wiccan","winning","winter","wired","wit","x","yellow","you","you are on","young","yume","yung","zombie","zooted"];
var ID_NOUN = ["-factor","-inator","-man",".assetbundle",".bat",".dll",".el",".exe",".gd",".html",".js",".json",".lua",".py",".rs",".sh",".tar.gz",".xnb","age","andy","apple","armor","aspect","avenue","bakka","balatro","banban","barrel roll","battle advanced","beats","beee","bender","bird","blow","blue","boston","boxy boo","boy","broadcast","browser","cake","castle","cat","celeste","chair","chamber","cheese","chicken","church","circus","citizen","club to the club go go to the club","coffee","combination pizza hut and taco bell","cooking","cord","couple","craft","creation","crew","crossbow","crossword","crystals","dance","death","dew","dimension","domain","donkey","dot","duck","eagle","egg","era","escapade","farms","field","fish","fluttershy","fly","fog","force","forge","games","gang","gear","gems","girl","goose","gpt","green","gun","haiku","haircut","hard","heart","heaven","hell","hexagon","hoe","homestuck","house","huggy wuggy","hunter","in minecraft","income tax","in 4k","insight","internet","irl","is coming","issue","item","joel","juris prudence","kickflip","knight","knowledge","l","language","line","linelith","linux","looking","lore","mail","male","man","man","man","man","man","man","man","man","man","man","mana","metal","minigame","mmorpg","mode","money","monster","mouse","necrodancer","neopets","news","ngl","nikki","noise","noita","of fire and ice","of the dead","ong","overdose","palace","paper","party","peace","pet","pickaxe","pie","pig","plane","plant","plate","playing","pod","portal","prod","puzzle","rain","realm","red","rise","rn","rock","rod","roguelike","running","sais quoi","salad","sauce","scimitar","scissor","serpent","session","skin","slopper","solstice","soup","source","speed","staff","storm","street","style","sudoku","survivor","sus","swimming","sword","symbolism","taiji","taxes","tbf","tbh","tea","tentacles","the elements","thing","this","thoughts","time","tissue","tuber","universe","update","us","voices","wagon","wand","war","werewolf","windows","wisdom","witness","woman","wordle","words","world","worm","wyvern","yahtzee","yellow","zpod"];
var getIdentifier = () => {
    let number = Math.floor(random(100));
    let adj = random(ID_ADJECTIVE);
    let noun = random(ID_NOUN);
    let isBack = Math.random() < 0.5;
    let txt = adj + (/^[A-Z0-9]$/i.test(noun[0]) ? " " : "") + noun;
    if (isBack) txt = txt + " " + number.toString();
    else txt = number.toString() + " " + txt;
    return txt;
};
var split = (arr, sep, lim = 0) => {
    const isString = typeof arr === "string";
    if (!Array.isArray(sep)) sep = [sep];
    for (let i = 0; i < sep.length; i++) if (realtype(sep[i]) === "regex") sep[i] = new RegExp("^" + sep[i].source, sep[i].flags);
    let ret = [], ptr = 0, i = 0;
    while (i < arr.length) {
        let s = sep.find(x => isString ? (realtype(x) === "regex" ? x.test(arr.slice(i)) : arr.startsWith(x, i)) : looselyEqual(arr[i], x));
        if (s) {
            if (realtype(s) === "regex") s = s.exec(arr.slice(i))[0];
            ret.push(arr.slice(ptr, i));
            ptr = i + (isString ? (s.length) : 1); i = ptr - 1;
            if (lim > 0 && ret.length >= lim) break;
        }
        i++;
    }
    ret.push(arr.slice(ptr));
    if (lim > 0) for (let i = arr.length; i <= lim; i++) ret.push("");
    return ret;
};
var remove = (arr, ...thing) => arr.filter(x => !thing.includes(x));
var unique = arr => { let found = []; for (let i = 0; i < arr.length; i++) if (!found.includes(arr[i])) found.push(arr[i]); return found; };
var intersect = (a, b) => a.filter(k => b.includes(k));
var group = (arr, n) => {
    n = trueish(n);
    if (!n) throw `invalid (0 or negative?) n in group()`;
    let ret = [];
    for (let i = 0; i < arr.length; i += n) ret.push(arr.slice(Math.floor(i), Math.floor(i + n)));
    return ret;
};
var zip = (...args) => {
    let convertBack = true;
    const arr = args.slice(0, -1).map(x => {
        if (Array.isArray(x)) { convertBack = false; return x; } 
        return [x];
    }); const fn = args.at(-1);
    const length = Math.max(...arr.map(x => x.length));
    let ret = [];
    for (let i = 0; i < length; i++) ret.push(fn(...arr.map(x => x[i])));
    return convertBack ? ret[0] : ret;
};
var lastFindIndex = (arr, fn) => { for (let i = arr.length - 1; i >= 0; i--) if (fn(arr[i], i, arr)) return i; return -1; };
var lastFind = (arr, fn, def=undefined) => { const idx = lastFindIndex(arr, fn); return idx === -1 ? def : arr[idx]; };
var inPlaceSort = (arr, fn) => arr.map((x, i) => [x, i]).sort((a, b) => {
    let ret = fn(a[0], b[0]);
    if (ret !== 0) return ret;
    return a[1] - b[1];
}).map(x => x[0]);
var safeAssign = (a, b) => {
    if (realtype(a) === "object" && realtype(b) === "object" && !Array.isArray(a) && !Array.isArray(b)) return Object.assign(a, b);
    return b;
};
var unentry = kvpair => {
    let ret = {};
    for (let kv of kvpair) ret[kv[0]] = kv[1];
    return ret;
};
var transpose = a => {
    a = array(a);
    if (Array.isArray(a)) {
        if (a.length === 0) return [];
        let length = Math.max(...a.map(x => x.length));
        let ret = [];
        for (let i = 0; i < length; i++) ret[i] = a.map(x => x[i]);
        return ret;
    }
    return unentry(Object.entries(a).map(x => x.reverse()));
};
var filterKey = (o, fn) => unentry(Object.entries(o).filter(x => fn(x[0])));
var filterValue = (o, fn) => unentry(Object.entries(o).filter(x => fn(x[1])));
var mapKey = (o, fn) => unentry(Object.entries(o).map(x => fn(x[0])));
var mapValue = (o, fn) => unentry(Object.entries(o).map(x => fn(x[1])));
var Color = {"NAMES":{"aliceblue ":"F0F8FFFF","antiquewhite ":"FAEBD7FF","aqua ":"00FFFFFF","aquamarine ":"7FFFD4FF","azure ":"F0FFFFFF","beige ":"F5F5DCFF","bisque ":"FFE4C4FF","black ":"000000FF","blanchedalmond ":"FFEBCDFF","blue ":"0000FFFF","blueviolet ":"8A2BE2FF","brown ":"A52A2AFF","burlywood ":"DEB887FF","cadetblue ":"5F9EA0FF","chartreuse ":"7FFF00FF","chocolate ":"D2691EFF","coral ":"FF7F50FF","cornflowerblue ":"6495EDFF","cornsilk ":"FFF8DCFF","crimson ":"DC143CFF","cyan ":"00FFFFFF","darkblue ":"00008BFF","darkcyan ":"008B8BFF","darkgoldenrod ":"B8860BFF","darkgray ":"A9A9A9FF","darkgreen ":"006400FF","darkgrey ":"A9A9A9FF","darkkhaki ":"BDB76BFF","darkmagenta ":"8B008BFF","darkolivegreen ":"556B2FFF","darkorange ":"FF8C00FF","darkorchid ":"9932CCFF","darkred ":"8B0000FF","darksalmon ":"E9967AFF","darkseagreen ":"8FBC8FFF","darkslateblue ":"483D8BFF","darkslategray ":"2F4F4FFF","darkslategrey ":"2F4F4FFF","darkturquoise ":"00CED1FF","darkviolet ":"9400D3FF","deeppink ":"FF1493FF","deepskyblue ":"00BFFFFF","dimgray ":"696969FF","dimgrey ":"696969FF","dodgerblue ":"1E90FFFF","firebrick ":"B22222FF","floralwhite ":"FFFAF0FF","forestgreen ":"228B22FF","fuchsia ":"FF00FFFF","gainsboro ":"DCDCDCFF","ghostwhite ":"F8F8FFFF","gold ":"FFD700FF","goldenrod ":"DAA520FF","gray ":"808080FF","green ":"008000FF","greenyellow ":"ADFF2FFF","grey ":"808080FF","honeydew ":"F0FFF0FF","hotpink ":"FF69B4FF","indianred ":"CD5C5CFF","indigo ":"4B0082FF","ivory ":"FFFFF0FF","khaki ":"F0E68CFF","lavender ":"E6E6FAFF","lavenderblush ":"FFF0F5FF","lawngreen ":"7CFC00FF","lemonchiffon ":"FFFACDFF","lightblue ":"ADD8E6FF","lightcoral ":"F08080FF","lightcyan ":"E0FFFFFF","lightgoldenrodyellow ":"FAFAD2FF","lightgray ":"D3D3D3FF","lightgreen ":"90EE90FF","lightgrey ":"D3D3D3FF","lightpink ":"FFB6C1FF","lightsalmon ":"FFA07AFF","lightseagreen ":"20B2AAFF","lightskyblue ":"87CEFAFF","lightslategray ":"778899FF","lightslategrey ":"778899FF","lightsteelblue ":"B0C4DEFF","lightyellow ":"FFFFE0FF","lime ":"00FF00FF","limegreen ":"32CD32FF","linen ":"FAF0E6FF","magenta ":"FF00FFFF","maroon ":"800000FF","mediumaquamarine ":"66CDAAFF","mediumblue ":"0000CDFF","mediumorchid ":"BA55D3FF","mediumpurple ":"9370DBFF","mediumseagreen ":"3CB371FF","mediumslateblue ":"7B68EEFF","mediumspringgreen ":"00FA9AFF","mediumturquoise ":"48D1CCFF","mediumvioletred ":"C71585FF","midnightblue ":"191970FF","mintcream ":"F5FFFAFF","mistyrose ":"FFE4E1FF","moccasin ":"FFE4B5FF","navajowhite ":"FFDEADFF","navy ":"000080FF","oldlace ":"FDF5E6FF","olive ":"808000FF","olivedrab ":"6B8E23FF","orange ":"FFA500FF","orangered ":"FF4500FF","orchid ":"DA70D6FF","palegoldenrod ":"EEE8AAFF","palegreen ":"98FB98FF","paleturquoise ":"AFEEEEFF","palevioletred ":"DB7093FF","papayawhip ":"FFEFD5FF","peachpuff ":"FFDAB9FF","peru ":"CD853FFF","pink ":"FFC0CBFF","plum ":"DDA0DDFF","powderblue ":"B0E0E6FF","purple ":"800080FF","rebeccapurple ":"663399FF","red ":"FF0000FF","rosybrown ":"BC8F8FFF","royalblue ":"4169E1FF","saddlebrown ":"8B4513FF","salmon ":"FA8072FF","sandybrown ":"F4A460FF","seagreen ":"2E8B57FF","seashell ":"FFF5EEFF","sienna ":"A0522DFF","silver ":"C0C0C0FF","skyblue ":"87CEEBFF","slateblue ":"6A5ACDFF","slategray ":"708090FF","slategrey ":"708090FF","snow ":"FFFAFAFF","springgreen ":"00FF7FFF","steelblue ":"4682B4FF","tan ":"D2B48CFF","teal ":"008080FF","thistle ":"D8BFD8FF","tomato ":"FF6347FF","turquoise ":"40E0D0FF","transparent":"FF00FF00","none":"FF00FF00","violet ":"EE82EEFF","wheat ":"F5DEB3FF","white ":"FFFFFFFF","whitesmoke ":"F5F5F5FF","yellow ":"FFFF00FF","yellowgreen ":"9ACD32FF"},"from":(o, g, b, a) => {
        if (g !== undefined) {
            o = [o, g, b];
            if (a !== undefined) o.push(a);
        }
        switch (typeof o) {
            case "number":
                if (Number.isNaN(o)) o = "";
                else if (o < 0) o = "FF00FF00";
                else o = o.toString(16); // passthrough to string
            case "string":
                let name = NAMES[o.toLowerCase().trim()];
                if (name) o = name;
                else {
                    o = o.toUpperCase().replace(/[^0-9A-F]+/g, "");
                    switch (o.length) {
                        case 0: o = "FF00FF00"; break; // magenta transparent because it"s what"s used for monogame model as well
                        case 1: o = o.repeat(6) + "FF"; break;
                        case 2: o = o.repeat(3) + "FF"; break;
                        case 3: o = o[0].repeat(2) + o[1].repeat(2) + o[2].repeat(2) + "FF"; break;
                        case 4: o = o[0].repeat(2) + o[1].repeat(2) + o[2].repeat(2) + o[3].repeat(2); break;
                        case 5: o = "0" + o + "FF"; break;
                        case 6: o = o + "FF"; break;
                        case 7: o = "0" + o; break;
                        case 8: break;
                        default: o = o.slice(0, 8); break;
                    } 
                }
                o = [parseInt(o.slice(0, 2), 16), parseInt(o.slice(2, 4), 16), parseInt(o.slice(4, 6), 16), parseInt(o.slice(6, 8), 16)]
                break;
            case "object":
                if (!Array.isArray(o)) {
                    let ret = [], ks = [
                        ["r", "R", "x", "X", "red", "Red", "RED"],
                        ["g", "G", "y", "Y", "green", "Green", "GREEN"],
                        ["b", "B", "z", "Z", "blue", "Blue", "BLUE"],
                        ["a", "A", "w", "W", "alpha", "Alpha", "ALPHA", "transparency", "Transparency", "TRANSPARENCY", "transp", "Transp", "TRANSP", "trans", "Trans", "TRANS", "opacity", "Opacity", "OPACITY"]
                    ];
                    for (let i in ks) for (let k of ks[i]) if (o[k]) ret[i] = o[k];
                    o = ret;
                }
                o[0] ??= 0; o[1] ??= 0; o[2] ??= 0; o[3] ??= 255;
                o = o.map(parseInt);
                break;
        }
        return ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
    },"toHex":color => "#" + color.toString(16).padStart(8, "0"),"toArray":color => [(color & 0xFF000000) >>> 24, (color & 0x00FF0000) >>> 16, (color & 0x0000FF00) >>> 8, (color & 0x000000FF) >>> 0],"toVector":color => {return {x: (color & 0xFF000000) >>> 24, y: (color & 0x00FF0000) >>> 16, z: (color & 0x0000FF00) >>> 8, w: (color & 0x000000FF) >>> 0}},"fromHSV":(h, s, v, a=1) => {
        let r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            let temp = []
            if (Array.isArray(h)) temp = [...h];
            else {
                let ks = [
                    ["h", "H", "x", "X", "hue", "Hue", "HUE"],
                    ["s", "S", "y", "Y", "sat", "Sat", "SAT", "saturation", "Saturation", "SATURATION"],
                    ["v", "V", "z", "Z", "val", "Val", "VAL", "value", "Value", "VALUE"],
                    ["a", "A", "w", "W", "alpha", "Alpha", "ALPHA", "transparency", "Transparency", "TRANSPARENCY", "transp", "Transp", "TRANSP", "trans", "Trans", "TRANS", "opacity", "Opacity", "OPACITY"]
                ];
                for (let i in ks) for (let k of ks[i]) if (h[k]) temp[i] = h[k];
            }
            if (temp[0]) h = temp[0];
            if (temp[1]) s = temp[1];
            if (temp[2]) v = temp[2];
            if (temp[3]) a = temp[3];
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return Color.from(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), Math.round(a * 255));
    },"toHSV":color => {
        let [r, g, b, a] = Color.toArray(color);
        let max = Math.max(r, g, b), min = Math.min(r, g, b),
            d = max - min,
            h,
            s = (max === 0 ? 0 : d / max),
            v = max / 255;
    
        switch (max) {
            case min: h = 0; break;
            case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
            case g: h = (b - r) + d * 2; h /= 6 * d; break;
            case b: h = (r - g) + d * 4; h /= 6 * d; break;
        }
        return [h, s, v, a / 255];
    },"fromHSL":(h, s, l, a=1) => {
        if (arguments.length === 1) {
            let temp = []
            if (Array.isArray(h)) temp = [...h];
            else {
                let ks = [
                    ["h", "H", "x", "X", "hue", "Hue", "HUE"],
                    ["s", "S", "y", "Y", "sat", "Sat", "SAT", "saturation", "Saturation", "SATURATION"],
                    ["l", "L", "z", "Z", "lig", "Lig", "LIG", "light", "Light", "LIGHT", "lightness", "Lightness", "LIGHTNESS"],
                    ["a", "A", "w", "W", "alpha", "Alpha", "ALPHA", "transparency", "Transparency", "TRANSPARENCY", "transp", "Transp", "TRANSP", "trans", "Trans", "TRANS", "opacity", "Opacity", "OPACITY"]
                ];
                for (let i in ks) for (let k of ks[i]) if (h[k]) temp[i] = h[k];
            }
            if (temp[0]) h = temp[0];
            if (temp[1]) s = temp[1];
            if (temp[2]) v = temp[2];
            if (temp[3]) a = temp[3];
        }
        let _s, _v;
        l *= 2;
        s *= (l <= 1) ? l : 2 - l;
        _v = (l + s) / 2;
        _s = (2 * s) / (l + s);
        return Color.fromHSV(h, _s, _v, a);
    },"toHSL":color => {
        let [h, s, v, a] = Color.toHSV(color);
        let _s = s * v, l = (2 - s) * v;
        _s /= (l <= 1) ? l : 2 - l; l /= 2;
        return [h, _s, l, a];
    }};
var time = o => { // all TIME format will be bigints
    if (Number.isNaN(o)) return null;
    o = nullish(o);
    if (o === null) return BigInt(Date.now());
    switch (typeof o) {
        case "bigint": return o;
        case "number": return BigInt(o);
        case "boolean": return o ? BigInt(Date.now()) : 0n;
        case "string":
            o = o.replace("T", " ").replace("Z", " ").replace("t", " ").replace("z", " ");
            if (occurance(o, ":") === 3) o = `1970-01-` + o.replace(":", " ");
            for (const str of [o, `1970-01-01 ${o}`, `1970 ${o}`]) {
                const date = new Date(str + " GMT+00:00").getTime();
                if (!Number.isNaN(date)) return BigInt(date);
            }
            return 0n;
    }
    if (o instanceof Date) return !Number.isNaN(o.getTime()) ? BigInt(o.getTime()) : null;
    if (Array.isArray(o)) {
        switch (o.length) {
            case 1: o = [...o, 1, 1, 0, 0, 0, 0]; break;
            case 2: o = [1970, 1, 1, ...o, 0, 0]; break;
            case 3: o = [1970, 1, 1, ...o, 0]; break;
            case 4: o = [1970, ...o, 0, 0]; break;
            case 5: o = [1970, ...o, 0]; break;
            case 6: o = [...o, 0]; break;
            default: o = o.slice(0, 7);
        } o[1] -= 1;
        const date = new Date(...o).getTime();
        return !Number.isNaN(date) ? BigInt(date - (new Date().getTimezoneOffset() * 60000)) : null;
    }
    return null;
};
var formatTime = (...args) => {
    const SECOND = 1000n, MINUTE = SECOND * 60n, HOUR = MINUTE * 60n, DAY = HOUR * 24n, 
        YEAR = DAY * 365n, FOUR_YEAR = YEAR * 4n + DAY, CENTURY = FOUR_YEAR * 25n - DAY,
        FOUR_CENTURY = CENTURY * 4n + DAY, YEAR_0 = 946684800000n - (FOUR_CENTURY * 5n);
    let a = time(), b = time(), format = "DDDD:hh:mm:sss", cutFront = true;
    var _idx = lastFindIndex(args, x => typeof x === "boolean"); if (_idx !== -1) { cutFront = args[_idx]; args.splice(_idx, 1); }
    var _idx = lastFindIndex(args, x => typeof x === "string"); if (_idx !== -1) { format = args[_idx]; args.splice(_idx, 1); }
    if (args[0] !== undefined) a = time(args[0]); if (args[1] !== undefined) b = time(args[1]);
    let date = (args[1] === undefined) ? (BigMath.abs(a) > YEAR ? time() - a : a) : a - b;
    return formatDate(date, format, cutFront);
};
var formatDate = (...args) => {
    const SECOND = 1000n, MINUTE = SECOND * 60n, HOUR = MINUTE * 60n, DAY = HOUR * 24n, 
        YEAR = DAY * 365n, FOUR_YEAR = YEAR * 4n + DAY, CENTURY = FOUR_YEAR * 25n - DAY,
        FOUR_CENTURY = CENTURY * 4n + DAY, YEAR_0 = 946684800000n - (FOUR_CENTURY * 5n);
    let a = time(), b = 0n, format = "YYYY-MM-DDThh:mm:ss.ssssZZZZ", cutFront = false;
    var _idx = lastFindIndex(args, x => typeof x === "boolean"); if (_idx !== -1) { cutFront = args[_idx]; args.splice(_idx, 1); }
    var _idx = lastFindIndex(args, x => typeof x === "string"); if (_idx !== -1) { format = args[_idx]; args.splice(_idx, 1); }
    if (args[0] !== undefined) a = time(args[0]); if (args[1] !== undefined) b = time(args[1]); const date = a - b;
    const isDate = /(?:^|[^%])(?:%%)*YYYY/.test(format); 
    // #REGION fuck you gregory
    var _remaining = date - YEAR_0;
    const _FOUR_CENTURY = Number(BigMath.div(_remaining, FOUR_CENTURY)); _remaining = BigMath.posmod(_remaining, FOUR_CENTURY);
    let _CENTURY = 0; if (_remaining >= (CENTURY + DAY)) { _CENTURY += 1; _remaining -= CENTURY + DAY; }
    _CENTURY += Number(_remaining / CENTURY) + (4 * _FOUR_CENTURY); _remaining %= CENTURY;
    let _YEAR = 0; 
    if (_CENTURY % 4 !== 0 && _remaining >= (FOUR_YEAR - DAY)) { _YEAR += 4; _remaining -= FOUR_YEAR - DAY; }
    _YEAR += 4 * Number(_remaining / FOUR_YEAR); _remaining %= FOUR_YEAR;
    if (_YEAR !== 0 || _CENTURY % 4 === 0) { // check for leapyear
        if (_remaining >= (YEAR + DAY)) { 
            _YEAR++; _remaining -= YEAR + DAY; 
            _YEAR += Number(_remaining / YEAR); _remaining %= YEAR; 
        }
    } else { _YEAR += Number(_remaining / YEAR); _remaining %= YEAR; }
    _YEAR += 100 * _CENTURY;
    const isLeapYear = (_YEAR % 4 === 0) && (_YEAR % 100 !== 0 || _YEAR % 400 === 0);
    const year = isDate ? _YEAR : _YEAR - (_YEAR >= 1970 ? 1970 : 1969);
    const totalDays = isDate ? BigMath.div(date, DAY) : date / DAY;
    if (!isDate) _remaining = date % (isLeapYear ? (YEAR + DAY) : YEAR);
    // #ENDREGION
    const days = Number(_remaining / DAY); _remaining = (days < 0 ? -_remaining : _remaining) % DAY;
    var _days = days, _month = isDate ? 1 : 0;
    for (let m of [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]) {
        if (_days < m) break;
        _days -= m;
        _month++;
    }
    const day = _days + (isDate ? 1 : 0); const month = _month;
    const hours = Number(_remaining / HOUR); _remaining = (hours < 0 ? -_remaining : _remaining) % HOUR;
    const minutes = Number(_remaining / MINUTE); _remaining = (minutes < 0 ? -_remaining : _remaining) % MINUTE;
    const seconds = Number(_remaining / SECOND); _remaining = (seconds < 0 ? -_remaining : _remaining);
    const milliseconds = Number(_remaining % SECOND);
    const offset = new Date().getTimezoneOffset();
    var _hour = Math.abs(Math.div(offset, 60));
    var _minute = Math.abs(offset % 60);
    var _sign = offset <= 0 ? "+" : "-";
    var _colon = _minute !== 0 ? ":" : "";
    const weekDay = Number(BigMath.posmod(totalDays - 3n, 7n));
    // processing now
    const CONVERSIONS = new Map([
        ["YYYY", [year, year.toString()]],
        ["YYY", [(year - 1970), (year - 1970).toString()]],
        ["YY", [year, year.toString().slice(-2)]],
        ["MMMM", [month, (["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])[month]]],
        ["MMM", [month, (["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])[month]]],
        ["MM", [month, zeroPad(month, 2)]],
        ["M", [month, month.toString()]],
        ["WWWW", [null, (["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])[weekDay]]],
        ["WWW", [null, (["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])[weekDay]]],
        ["WW", [null, (["G", "M", "T", "W", "H", "F", "S"])[weekDay]]],
        ["W", [null, weekDay.toString()]],
        ["DDDD", [Number(totalDays), totalDays.toString()]],
        ["DDD", [days, days.toString()]],
        ["DD", [day, zeroPad(day, 2)]],
        ["D", [day, day.toString()]],
        ["hhh", [Number(totalDays) + hours, (Number(totalDays) * 24 + hours).toString()]],
        ["hh", [hours, zeroPad(hours, 2)]],
        ["h", [hours, hours.toString()]],
        ["HHH", [null, hours < 12 ? "AM" : "PM"]],
        ["HH", [hours, zeroPad((hours + 11) % 12 + 1, 2)]],
        ["H", [hours, ((hours + 11) % 12 + 1).toString()]],
        ["mm", [minutes, zeroPad(minutes, 2)]],
        ["m", [minutes, minutes.toString()]],
        ["ssss", [milliseconds, zeroPad(milliseconds, 3)]],
        ["sss", [Math.abs(seconds) + Math.abs(milliseconds), Math.prec(seconds + (milliseconds / 1000), 3).toString()]],
        ["ss", [seconds, zeroPad(seconds, 2)]],
        ["s", [seconds, seconds.toString()]],
        ["ZZZZ", [null, (offset === 0) ? "Z" : (_sign + zeroPad(_hour, 2) + ":" + zeroPad(_minute, 2))]],
        ["ZZZ", [null, ({ "-720": "BIT", "-660": "NUT", "-600": "CKT", "-570": "MIT", "-540": "GIT", "-480": "PST", "-420": "MST", "-360": "CST", "-300": "EST", "-240": "AST", "-210": "NST", "-180": "BRT", "-150": "NDT", "-120": "AZOT", "-60": "EGT", "0": "GMT", "60": "CET", "120": "EET", "180": "FET", "210": "IRST", "240": "GET", "270": "AFT", "300": "PKT", "330": "IST", "345": "NPT", "360": "KGT", "390": "CCT", "420": "ICT", "480": "PHT", "525": "CWST", "540": "JST", "570": "ACST", "600": "AEST", "630": "ACDT", "660": "AEDT", "720": "NZST", "765": "CHAST", "780": "TOT", "825": "CHADT", "840": "LINT"})[offset] ?? "UTC" + _sign + _hour + _colon + _minute]],
        ["ZZ", [null, (offset === 0) ? "Z" : (_sign + _hour + _colon + _minute)]],
        ["Z", [offset, (offset / 60).toString()]],
        ["!", [null, ""]],
        ["%", [null, "%"]],
    ]);
    const keys = Array.from(CONVERSIONS.keys());
    let ret = "", i = 0, trimZero = cutFront;
    while (i < format.length) {
        const key = keys.find(x => format.indexOf(x, i) === i);
        if (key === "%") {
            i++;
            const escape = keys.find(x => format.indexOf(x, i) === i);
            ret += escape;
            i += escape.length;
        } else if (key) {
            i += key.length;
            if (trimZero && CONVERSIONS.get(key)[0] === 0) continue;
            if (CONVERSIONS.get(key)[0] !== null) trimZero = false;
            ret += CONVERSIONS.get(key)[1];
        } else {
            i++;
            if (trimZero) continue;
            ret += format[i-1];
        }
    }
    if (cutFront) {
        ret = ret.trimStart();
        var _sign = ""; if (ret.startsWith("-")) { _sign = "-"; ret = ret.slice(1); }
        ret = _sign + ret.replace(/^0+/, "");
    }
    return ret;
};
var ascii = o => {
    if (typeof o === "string") return o.split("").map(x => x.charCodeAt(0)).map(x => x >= 0x100 ? [x >> 8, x & 0xFF] : x).flat();
    return o.map(x => {
        let g = 0x100; while (x < 0) { x = g - x; g << 8; }
        let ret = [];
        while (x > 0x100) { ret.push(x & 0xFF); x >> 8; } ret.push(x);
        return ret.reverse();
    }).flat().map(x => String.fromCodePoint(x)).join("");   
};
var unicode = o => {
    if (typeof o === "string") return o.split("").map(x => x.charCodeAt(0));
    return o.map(x => String.fromCodePoint(x)).join("");
};
var bits = (o, bits=null) => {
    bits = trueish(bits);
    switch (typeof o) {
        case "string": if (!bits) bits = 16; bits = Math.clamp(bits, 7, 16); if (bits <= 8) o = ascii(o).map(x => x >> (8 - bits)); else o = unicode(o).map(x => x >> (16 - bits)); break;
        case "boolean": o = [o ? 1 : 0]; if (!bits) bits = 1; break;
        case "number": case "bigint": o = [o]; break;
    }
    return o.map(x => {
        const one = typeof x === "bigint" ? 1n : 1;
        let ret = [];
        if (!bits) { while (x != 0) { ret.push(x & one); x >>= one; }}
        else { for (let i = 0; i < bits; i++) { ret.push(x & one); x >>= one; }}
        return ret;
    }).flat();
};
var unbits = (o, bits=16) => {
    return group(o, bits).map(x => Math.sum(...x.map((k, i) => k << i)));
};
var btow = str => btoa(str).replace(/\+/g, ".").replace(/\//g, "-").replace(/\=/g, "_");
var wtob = str => atob(str.replace(/\./g, "+").replace(/\-/g, "/").replace(/\_/g, "="));
var utoa = str => btoa(Array.from(new TextEncoder().encode(str), x => String.fromCodePoint(x)).join(""));
var atou = str => new TextDecoder().decode(Uint8Array.from(atob(str), x => x.codePointAt(0)));
var utow = str => btow(Array.from(new TextEncoder().encode(str), x => String.fromCodePoint(x)).join(""));
var wtou = str => new TextDecoder().decode(Uint8Array.from(wtob(str), x => x.codePointAt(0)));
var IDN_REGIONS = [[48,57],[65,90],[97,122],[12353,12438],[12593,12643],[8031,8061],[42624,42651],[3713,3714],[910,929],[2674,2676],[42192,42231],[10746,11012],[8144,8147],[11094,11123],[11016,11034],[9906,9916],[9987,9988],[2474,2480],[12704,12723],[12320,12329],[9771,9773],[9793,9793],[902,902],[9761,9761],[11776,11833],[7968,8005],[3754,3755],[2437,2444],[891,895],[9753,9756],[19904,19931],[9982,9985],[10018,10023],[2565,2570],[9998,9998],[8619,8971],[10037,10051],[9168,9191],[8592,8594],[8240,8241],[2613,2614],[7936,7957],[43824,43877],[8602,8616],[11126,11157],[10061,10061],[10005,10005],[2579,2600],[10014,10016],[8029,8029],[908,908],[2510,2510],[11360,11507],[10136,10144],[9941,9960],[9828,9828],[43646,43647],[886,887],[12549,12588],[11904,11929],[42560,42606],[9880,9880],[6320,6377],[1421,1423],[10053,10054],[3751,3751],[904,906],[8257,8264],[6608,6618],[10132,10132],[9979,9980],[9896,9897],[9990,9991],[43616,43642],[2654,2654],[8491,8504],[7960,7965],[3804,3807],[10025,10034],[8118,8124],[8182,8188],[8976,8985],[10007,10012],[8253,8254],[2308,2361],[9758,9759],[11931,12019],[2418,2432],[8448,8489],[10070,10070],[10056,10059],[9856,9873],[9795,9799],[9938,9938],[2602,2608],[12032,12245],[384,687],[9882,9882],[8008,8013],[9926,9927],[8134,8140],[6622,6655],[9787,9791],[12445,12543],[9750,9751],[9900,9903],[8150,8155],[9919,9923],[8308,8315],[931,1154],[2482,2482],[1162,1327],[6512,6516],[5792,5872],[9733,9741],[10550,10743],[9929,9933],[42999,43007],[12336,12348],[2524,2525],[10085,10101],[5024,5109],[5120,5759],[2610,2611],[3757,3759],[2451,2472],[43072,43127],[9472,9653],[9204,9207],[3716,3716],[42928,42935],[9776,9783],[185,191],[10241,10547],[4295,4295],[9140,9166],[174,179],[6480,6509],[43888,43967],[9885,9887],[9727,9727],[161,167],[3647,3654],[9936,9936],[4046,4052],[7357,7359],[9655,9663],[10176,10239],[12306,12307],[12784,12799],[3663,3675],[11089,11092],[3585,3632],[9974,9974],[4301,4301],[4256,4293],[10081,10082],[8304,8305],[10063,10066],[8506,8587],[10146,10159],[13055,13143],[8178,8180],[8249,8251],[2575,2576],[10000,10001],[9743,9744],[3792,3801],[11037,11087],[9833,9850],[2486,2489],[2404,2415],[42784,42926],[8025,8025],[880,883],[4304,4351],[11569,11623],[43488,43518],[9825,9826],[8266,8286],[2527,2529],[181,182],[2392,2401],[8988,9114],[169,172],[2534,2556],[7680,7935],[2447,2448],[2662,2671],[7293,7293],[6576,6601],[8224,8227],[9665,9722],[9812,9822],[7312,7354],[8064,8116],[9831,9831],[12645,12686],[8016,8023],[10003,10003],[10072,10074],[7248,7287],[8352,8383],[9963,9967],[9767,9769],[12292,12295],[1377,1415],[9764,9765],[2649,2652],[8027,8027],[7424,7615],[8160,8172],[192,382],[10161,10174],[9890,9894],[6528,6571],[9746,9747],[42240,42539],[3749,3749],[8130,8132],[2616,2617],[9852,9853],[4030,4044],[1329,1366],[11836,11844],[40960,42124],[42128,42182],[9216,9254],[9280,9290],[9312,9409],[9411,9471],[12800,12828],[12881,12923],[12926,13054],[13144,13311],[10102,10131],[44032,55203],[13312,19893],[19968,40911],[40913,40934]];
var idn = o => {
    let req = [];
    switch (typeof o) {
        case "number":
            while (o >= 0x10000) { req.push(o & 0xFFFF); o = Math.trunc(o / 0x10000); } // doing this to preserve big number
            req.push(o);
            req.reverse();
            break;
        case "bigint":
            while (o >= 0x10000) { req.push(Number(o & 0xFFFFn)); o >>= 16n; } // already big number :)
            req.push(Number(o));
            req.reverse();
            break;
        case "object":
            req = o.map(o => Number(o));
            if (req.some(x => Number.isNaN(x))) req = o.map(o => Number(o, 16));
            break;
        case "string":
            let ret = "";
            for (let i = 0; i < o.length; i += 2) { ret += idnChar((Number.isNaN(o.charCodeAt(i)) ? 0 : o.charCodeAt(i) << 8) + (Number.isNaN(o.charCodeAt(i + 1)) ? 0 : o.charCodeAt(i + 1))); }
            return ret;
    }
    return req.map(idnChar).join("");
};
var deidn = str => {
    let ret = "";
    for (let i = 0; i < str.length; i++) {
        const temp = deidnChar(str[i], str[i + 1]);
        if (temp[1]) i++;
        ret += String.fromCharCode(((temp[0] & 0xFF00) >>> 8), temp[0] & 0xFF);
    }
    return ret;
};
var idnChar = x => {
    for (const region of IDN_REGIONS) {
        if (x <= (region[1] - region[0])) return String.fromCodePoint(region[0] + x);
        else x -= (region[1] - region[0] + 1);
    }
    return String.fromCodePoint(0x20000 + x); // CJK Extension B+
};
var deidnChar = (x, next) => {
    let c = x.charCodeAt(0);
    const isSurrogate = (0xD800 <= c && c <= 0xDFFF);
    if (isSurrogate) c = 0x10000 + ((x.charCodeAt(0) - 0xD800) * 0x400) + (next.charCodeAt(0) - 0xDC00);
    let ret = 0
    for (const region of IDN_REGIONS) {
        if (region[0] <= c && c <= region[1]) return [ret + c - region[0], isSurrogate];
        else ret += region[1] - region[0] + 1;
    }
    return [ret + c - 0x20000, isSurrogate];
};
var md5 = inputString => { // epic stackoverflow copypaste GO
    let hc="0123456789abcdef";
    function rh(n) {let j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {let l=(x&0xFFFF)+(y&0xFFFF);let m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        let i;const nblk=((x.length+8)>>6)+1;let blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    const x = sb(inputString.toString());
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, olda, oldb, oldc, oldd;
    for (let i = 0; i < x.length; i += 16) { 
        olda = a; oldb = b; oldc = c; oldd = d;
        a = ff(a, b, c, d, x[i+ 0],  7,  -680876936); d = ff(d, a, b, c, x[i+ 1], 12,  -389564586); c = ff(c, d, a, b, x[i+ 2], 17,   606105819); b = ff(b, c, d, a, x[i+ 3], 22, -1044525330); a = ff(a, b, c, d, x[i+ 4],  7,  -176418897); d = ff(d, a, b, c, x[i+ 5], 12,  1200080426); c = ff(c, d, a, b, x[i+ 6], 17, -1473231341); b = ff(b, c, d, a, x[i+ 7], 22,   -45705983); a = ff(a, b, c, d, x[i+ 8],  7,  1770035416); d = ff(d, a, b, c, x[i+ 9], 12, -1958414417); c = ff(c, d, a, b, x[i+10], 17,      -42063); b = ff(b, c, d, a, x[i+11], 22, -1990404162); a = ff(a, b, c, d, x[i+12],  7,  1804603682); d = ff(d, a, b, c, x[i+13], 12,   -40341101); c = ff(c, d, a, b, x[i+14], 17, -1502002290); b = ff(b, c, d, a, x[i+15], 22,  1236535329); a = gg(a, b, c, d, x[i+ 1],  5,  -165796510); d = gg(d, a, b, c, x[i+ 6],  9, -1069501632); c = gg(c, d, a, b, x[i+11], 14,   643717713); b = gg(b, c, d, a, x[i+ 0], 20,  -373897302); a = gg(a, b, c, d, x[i+ 5],  5,  -701558691); d = gg(d, a, b, c, x[i+10],  9,    38016083); c = gg(c, d, a, b, x[i+15], 14,  -660478335); b = gg(b, c, d, a, x[i+ 4], 20,  -405537848); a = gg(a, b, c, d, x[i+ 9],  5,   568446438); d = gg(d, a, b, c, x[i+14],  9, -1019803690); c = gg(c, d, a, b, x[i+ 3], 14,  -187363961); b = gg(b, c, d, a, x[i+ 8], 20,  1163531501); a = gg(a, b, c, d, x[i+13],  5, -1444681467); d = gg(d, a, b, c, x[i+ 2],  9,   -51403784); c = gg(c, d, a, b, x[i+ 7], 14,  1735328473); b = gg(b, c, d, a, x[i+12], 20, -1926607734); a = hh(a, b, c, d, x[i+ 5],  4,     -378558); d = hh(d, a, b, c, x[i+ 8], 11, -2022574463); c = hh(c, d, a, b, x[i+11], 16,  1839030562); b = hh(b, c, d, a, x[i+14], 23,   -35309556); a = hh(a, b, c, d, x[i+ 1],  4, -1530992060); d = hh(d, a, b, c, x[i+ 4], 11,  1272893353); c = hh(c, d, a, b, x[i+ 7], 16,  -155497632); b = hh(b, c, d, a, x[i+10], 23, -1094730640); a = hh(a, b, c, d, x[i+13],  4,   681279174); d = hh(d, a, b, c, x[i+ 0], 11,  -358537222); c = hh(c, d, a, b, x[i+ 3], 16,  -722521979); b = hh(b, c, d, a, x[i+ 6], 23,    76029189); a = hh(a, b, c, d, x[i+ 9],  4,  -640364487); d = hh(d, a, b, c, x[i+12], 11,  -421815835); c = hh(c, d, a, b, x[i+15], 16,   530742520); b = hh(b, c, d, a, x[i+ 2], 23,  -995338651); a = ii(a, b, c, d, x[i+ 0],  6,  -198630844); d = ii(d, a, b, c, x[i+ 7], 10,  1126891415); c = ii(c, d, a, b, x[i+14], 15, -1416354905); b = ii(b, c, d, a, x[i+ 5], 21,   -57434055); a = ii(a, b, c, d, x[i+12],  6,  1700485571); d = ii(d, a, b, c, x[i+ 3], 10, -1894986606); c = ii(c, d, a, b, x[i+10], 15,    -1051523); b = ii(b, c, d, a, x[i+ 1], 21, -2054922799); a = ii(a, b, c, d, x[i+ 8],  6,  1873313359); d = ii(d, a, b, c, x[i+15], 10,   -30611744); c = ii(c, d, a, b, x[i+ 6], 15, -1560198380); b = ii(b, c, d, a, x[i+13], 21,  1309151649); a = ii(a, b, c, d, x[i+ 4],  6,  -145523070); d = ii(d, a, b, c, x[i+11], 10, -1120210379); c = ii(c, d, a, b, x[i+ 2], 15,   718787259); b = ii(b, c, d, a, x[i+ 9], 21,  -343485551);
        a = ad(a, olda); b = ad(b, oldb); c = ad(c, oldc); d = ad(d, oldd);
    }
    return rh(a) + rh(b) + rh(c) + rh(d);
};
var delay = (ms=100) => new Promise(resolve => setTimeout(resolve, ms));
Math.lerp = (a, b, t) => (b - a) * t + a;
Math.antilerp = (x, a, b) => a === b ? 0.5 : ((b - x) / (a - b));
Math.clamp = (x, a, b) => Math.min(Math.max(x, Math.min(a, b)), Math.max(a, b));
Math.between = (a, b, c, d) => {
        if (d === undefined) return Math.min(a, c) <= b && b <= Math.max(a, c);
        return Math.max(Math.min(a, b), Math.min(c, d)) <= Math.min(Math.max(a, b), Math.max(c, d));
    };
Math.div = (n, a) => Math.trunc(n / a);
Math.demod = (n, a) => n - (n % a);
Math.posmod = (n, a) => ((n % a) + a) % a;
Math.prec = (n, a=6) => Math.round(n * Math.pow(10, a)) / Math.pow(10, a);
Math.approxeq = (a, b, t=10) => Math.prec(a, t) === Math.prec(b, t);
Math.dot = (a, b) => { 
        if (!Array.isArray(a)) a = [a]; 
        if (!Array.isArray(b)) b = [b]; 
        let ret = 0; 
        for (let i = 0; i < Math.min(a.length, b.length); i++) ret += a[i] * b[i]; 
        return ret; 
    };
Math.cross = (a, b) => { 
        const dimension = Math.clamp(Math.max(a.length, b.length), 2, 3);
        a = Math.zeroPad(a, dimension).slice(0, dimension); b = Math.zeroPad(b, dimension).slice(0, dimension);
        if (dimension === 2) return a[0] * b[1] - a[1] * b[0];
        return [(a[1] * b[2] - a[2] * b[1]), (a[2] * b[0] - a[0] * b[2]), (a[0] * b[1] - a[1] * b[0])];
    };
Math.dist = (...a) => Math.sqrt(Math.hypot(...a));
Math.sum = (...a) => { if (Array.isArray(a[0])) a = a[0]; return a.reduce((x, y) => x + y, 0); };
Math.maxBy = (...x) => { let fn; if (typeof x.at(-1) === "function") { fn = x.at(-1); x = x.slice(0, -1); } else fn = (a, b) => a - b; return x.reduce((a, b) => fn(a, b) > 0 ? a : b, x[0]); };
Math.minBy = (...x) => { let fn; if (typeof x.at(-1) === "function") { fn = x.at(-1); x = x.slice(0, -1); } else fn = (a, b) => a - b; return x.reduce((a, b) => -fn(a, b) > 0 ? a : b, x[0]); };