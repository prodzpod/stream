// types!
const TYPE = {
    text: "text",
    mention: "mention",
    emote: "emote",
    tag: "tag",
    image: "image",
    link: "link"
}
module.exports.TYPE = TYPE;
class Token {
    constructor(type, value) { this.type = type; this.value = value; }
    is(type, value) { return this.type === type && this.value === value; }
    with(k, v) { this[k] = v; return this; }
    clone() { let ret = new Token(this.type, this.value); for (let k in this) ret[k] = this[k]; return ret; }
}
module.exports.Token = Token;
module.exports.Text = (t) => new Token(TYPE.text, t);
module.exports.Tag = (t) => new Token(TYPE.tag, t);
module.exports.shiftPointer = (ptr, i, num) => {
    if (num === 0) return ptr;
    const rightOnSame = Math.sign((ptr % 1) - (i % 1)) > 0;
    const isLeftOf = i < ptr || rightOnSame;
    i -= (i % 1); ptr -= (ptr % 1);
    if (num > 0 && isLeftOf) return ptr + num;
    if (num < 0 && isLeftOf) {
        let offset = ptr - i + (rightOnSame ? 1 : 0);
        if (-num >= offset) return ptr - offset;
        return ptr + num;
    } 
    return ptr;
}
module.exports.cleanup = (arr, ptr=0) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].is(TYPE.text, "")) {
            arr.splice(i, 1);
            ptr = module.exports.shiftPointer(ptr, i, -1);
            i--; continue;
        }
        if (i > 0 && arr[i - 1].type === TYPE.text && arr[i].type === TYPE.text) {
            let newText = arr[i - 1].value + arr[i].value;
            arr.splice(i - 1, 2, module.exports.Text(newText));
            ptr = module.exports.shiftPointer(ptr, i, -1);
            i--; continue;
        }
        for (let k of Object.keys(arr[i]).filter(x => x.startsWith("_"))) delete arr[i][k];
    }
    return [arr, ptr];
}