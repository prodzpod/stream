let dark = true, colorful = true, flashy = true, em;
let randomScroll;
addEvent('onload', () => {
    dark = unstringify(localStorage.getItem('dark')) ?? true;
    e('footer-dark').innerText = dark ? 'dark' : 'light';
    colorful = unstringify(localStorage.getItem('colorful')) ?? true;
    e('footer-colorful').innerText = dark ? 'colorful' : 'colorless';
    flashy = unstringify(localStorage.getItem('flashy')) ?? true;
    e('footer-flashy').innerText = flashy ? 'flashy' : 'static';
    for (let k of q('header a')) if (window.location.pathname == new URL(k.getAttribute('href')).pathname) k.classList.add('active');
    e('theme-' + (dark ? 'light' : 'dark')).disabled = true;
    em = getCSS('em');
    doColorful();
    if (flashy) doFlashy();
    else if (window.location.pathname[1]) e('title-random').innerText = window.location.pathname[1];
    setCSS('transition', '0.25s');
});

function doFlashy() {
    randomScroll = setInterval(() => { foreachElement('random', x => x.innerText = rand('0123456789abcdefghijklmnopqrstuvwxyzæðñøþåħłŋœſƨƣǝȼɂɀȴɛɞɩɐɬɵɷɱɻʒʬͷͻͼͽαβγδεζηθικλμνξοπρςστυφχψωϐϑϙϛϝϟϡϣϥϧϩϫϭϯϰϱϵ϶ϻϼабвгдежзийклмнопрстуфхцчшщъыьэюяѣѥѧѫѯѳѻҁґぺラㄢㅱ㌀㎰㏌㏊㎝㏚ﬆ⚲⚠♪♭♯♮♩♡♝♖♁!#$%^&*(){}[]¡¿¯¬÷¢£¤¥¦§¨©®ª«»º¹²³°±´µ¶·¸¼½¾-=_+;\':",.<>/‽⁝⁂※‼†‡《》「」『』。、〃〄?\\|`~☿♀♁♂♃♄♅♆♇⚳⚴⚵⚶⚷⛒⛤⚛☯♲')); }, 1000 / 24);
    setTimeout(() => {
        if (window.location.pathname[1]) { e('title-random').classList.remove('random'); e('title-random').innerText = window.location.pathname[1]; }
    }, 500);
    for (let el of q('.body *')) el.style.animation = `flicker ${Math.random() / 4 + 0.25}s forwards`;
}

function doColorful() {
    if (colorful) {
        if (document.getElementsByClassName('o').length === 0)
            for (let el of q('.body, header, footer')) {
                let txt = el.innerHTML, record = true;
                for (let i = 0; i < txt.length; i++) {
                    if (txt[i] === '<') record = false;
                    if (txt[i] === '>') record = true;
                    if (record && (txt[i] === 'o' || txt[i] === 'O')) {
                        let span = `<span class="o">${txt[i]}</span>`;
                        txt = txt.slice(0, i) + span + txt.slice(i + 1);
                        i += span.length - 1;
                    }
                }
                el.innerHTML = txt;
            }
        setCSS('o', 'var(--em)');
    }
    else setCSS('o', 'var(--text)');
}

function toggleDark(self) { 
    e('theme-' + (dark ? 'light' : 'dark')).disabled = false;
    dark = !dark; 
    localStorage.setItem('dark', dark);
    e('theme-' + (dark ? 'light' : 'dark')).disabled = true;
    em = getCSS('em');
    doColorful();
    self.innerText = dark ? 'dark' : 'light';
    if (flashy) for (let el of q('.body *')) el.getAnimations().forEach((anim) => {
        anim.cancel();
        anim.play();
    });
}

function toggleColorful(self) { 
    colorful = !colorful; 
    localStorage.setItem('colorful', colorful);
    self.innerHTML = colorful ? self.innerHTML.replace('less', 'ful') : self.innerHTML.replace('ful', 'less');
    doColorful();
}

function toggleFlashy(self) { 
    flashy = !flashy; 
    localStorage.setItem('flashy', flashy);
    if (flashy) doFlashy();
    else {
        if (randomScroll) clearTimeout(randomScroll);
        for (let el of q('.body *')) el.style.animation = ``;
    }
    self.innerText = flashy ? 'flashy' : 'static';
}