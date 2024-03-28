// element
function e(id) { if (typeof id === 'string') id = document.getElementById(id); return id; }
function q(id) { if (typeof id === 'string') id = document.querySelectorAll(id); return Array.from(id); }
function insertElement(type, parent, classList, html) {
    let el = document.createElement(type);
    if (![undefined, null, false].includes(html)) el.innerHTML = html;
    if (classList) {
        if (typeof(classList) == 'string') classList = classList.split(/\s+/g);
        if (classList.length) el.classList.add(...classList);
    } 
    if (parent) {
        if (typeof(parent) == 'string') parent = e(parent);
        if (parent) parent.appendChild(el);
    }
    return el;
}
function removeElement(el) { if (typeof el === 'string') el = e(el); let parent = el?.parentElement; parent?.removeChild(el); return parent; }
function removeAllChildren(el) { if (typeof el === 'string') el = e(el); while (el?.hasChildNodes()) el.removeChild(el.firstChild); return el; }
function setFirstSibling(el) { if (typeof el === 'string') el = e(el); el.parentElement.insertBefore(el, el.parentElement.firstChild); }
function setLastSibling(el) { if (typeof el === 'string') el = e(el); el.parentElement.appendChild(el); }
function setNextSibling(el, source) { if (typeof el === 'string') el = e(el); if (source.parentElement.lastChild == source) source.parentElement.appendChild(el); else source.parentElement.insertBefore(el, source.nextSibling); }
function foreachElement(cl, fn) { if (typeof cl === 'string') cl = Array.from(document.getElementsByClassName(cl)); for (let e of cl) fn(e); }
function getTextNodesIterator(el) { // Returns an iterable TreeWalker
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    walker[Symbol.iterator] = () => ({
        next() {
            const value = walker.nextNode();
            return {value, done: !value};
        }
    });
    return walker;
}
Element.prototype.with = function(attribute, value) {
    this.setAttribute(attribute, value);
    return this;
}
function refreshSVG(svg) {
    if (typeof(svg) == 'string') svg = e(svg);
    svg.parentElement.innerHTML += " ";
}
function getCSS(v) {
    return getComputedStyle(document.querySelector(':root')).getPropertyValue(`--${v}`);
}
function setCSS(v, value) {
    document.querySelector(':root').style.setProperty(`--${v}`, value);
    return value;
}
// url
var query = Object.fromEntries(new URLSearchParams(window.location.search));
async function send(method, url, query, body) {
    if (typeof body === 'object') body = JSON.stringify(body);
    else if (typeof body !== 'string') {
        if (body) body = body.toString();
        else body = {};
    }
    if (!isNullish(query)) query = '?' + encodeQuery(query);
    else query = '';
    let options = {};
    options.method = method.toUpperCase();
    if (!['GET', 'HEAD'].includes(options.method)) options.body = body;
    try {
        return await (await fetch(url + query, options)).json();
    } catch { return null; }
}
// event
function addEvent(type, cb, subj = window) {
    if (typeof(subj) == 'string') subj = e(subj);
    const p = subj[type];
    if (typeof(p) === 'function') subj[type] = (e) => { if (p) p(e); cb(e); }
    else subj[type] = cb;
}
function onEnter(el, cb) {
    if (typeof(el) == 'string') el = e(el);
    addEvent('onkeyup', (e) => { if (e.key === "Enter") cb(e, el) }, el);
}
function openKeyboard() { 
    if ("virtualKeyboard" in navigator) { 
        navigator.virtualKeyboard.overlaysContent = true; 
        navigator.virtualKeyboard.show(); 
    }
}
function copy(str) { navigator.clipboard.writeText(str); }