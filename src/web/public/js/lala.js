let fieldData = {
    "selectedBadge": "custom",
    "showAlerts": true,
    "showBadges": true,
    "showPronouns": true,
    "fontSizeUsername": 20,
    "fontSizeMessage": 20,
    "fontSizePronoun": 14,
    "fontSizeAlertUsername": 20,
    "fontSizeAlertMessage": 16,
    "messageLimit": 5
};  
/*
╗████████╗███████░╗██████░░╗██████╗██╗██░░░░░░░╗██░  ╗████████░╗█████░╗██░░╗██░╗█████░
╝══╔██══╚╝════╔██░╝════╔██╗██══╔██║██║██░░╗██░░║██░  ╝══╔██══╚╗██══╔██║██░░║██╗██══╔██
░░░║██░░░░░╗█████░╗██░░║██║██░░║██║██╝╔██╗████╗██╚░  ░░░║██░░░║███████║███████╝═╚░░║██
░░░║██░░░░░╝══╔██╗██╚░░║██║██░░║██║██░║████═╔████░░  ░░░║██░░░║██══╔██║██══╔██╗██░░║██
░░░║██░░░╗███████╝╔██████╚╝╔██████║██░╝╔██╚░╝╔██╚░░  ░░░║██░░░║██░░║██║██░░║██╝╔█████╚
░░░╝═╚░░░╝══════╚░╝═════╚░░╝═════╚╝═╚░░╝═╚░░░╝═╚░░░  ░░░╝═╚░░░╝═╚░░╝═╚╝═╚░░╝═╚░╝════╚░

*                                                                        ╗██░░░╗██░╗██████
* decomped & modified by prod for @lala_amanita                          ╝╔██░╗██╚╗██══╔██
* utilization of this file must                                          ░╝╔████╚░╝╦██████
* only be done with explicit permission of wasabi studio,                ░░╝╔██╚░░╗██══╔██
* the original creators of this snippet.                                 ░░░║██░░░╝╦██████
*                                                                        ░░░╝═╚░░░░╝═════╚

░╗█████░╗██░╗██████╗██░░░╗██╗████████╗██████░  ╗██░╗██████░╗█████░╗██████░░╗█████░╗██░░░░░░░╗██░
╗██══╔██║██╗██══╔██║██░░░║██╝══╔██══╚╝════╔██  ║██╗██══╔██╗██══╔██╝════╔██╗██══╔██║██░░╗██░░║██░
║██░░║██║██║██░░║██║██░░░║██░░░║██░░░░╗█████╚  ║██╝╦██████║███████░╗█████╚║███████╝╔██╗████╗██╚░
║██░░║██║██║██░░║██║██░░░║██░░░║██░░░╗██═══╚░  ║██╗██══╔██║██══╔██╗██═══╚░║██══╔██░║████═╔████░░
╝╔█████╚║██╝╔██████╝╔██████╚░░░║██░░░╝╔██████  ║██╝╦██████║██░░║██╝╔██████║██░░║██░╝╔██╚░╝╔██╚░░
░╝════╚░╝═╚░╝═════╚░╝═════╚░░░░╝═╚░░░░╝═════╚  ╝═╚░╝═════╚╝═╚░░╝═╚░╝═════╚╝═╚░░╝═╚░░╝═╚░░░╝═╚░░░
*/
let totalMessages = 0;
const badgesIcon = {
    broadcaster: () => `\n    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">\n      <path d="M2.28347 0.166382H7.76939C8.63504 0.166382 9.3368 0.868133 9.3368 1.73379V2.51749H10.1205V2.41297C10.1205 2.16599 11.6879 1.52002 11.6879 1.805V4.0849V6.36479C11.6879 6.64978 10.1205 6.00381 10.1205 5.75682V5.6523H9.3368V6.43601C9.3368 7.30166 8.63504 8.00341 7.76939 8.00341H2.28347C1.41782 8.00341 0.716064 7.30166 0.716064 6.43601V1.73379C0.716064 0.868133 1.41782 0.166382 2.28347 0.166382Z" fill="#80824A"/>\n    </svg>\n  `,
    mod: () => `\n    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">\n      <path d="M5.67487 0.466827C5.09662 0.834787 2.57352 5.61826 2.57352 5.61826C2.57352 5.61826 1.46964 4.88234 0.943929 4.6125C0.418218 4.34267 0.943929 5.5692 0.943929 5.5692L1.57478 6.84479C1.57478 6.84479 -0.00219727 8.58646 -0.00219727 8.75818C-0.00219727 8.92989 1.04913 10.0338 1.25939 10.0338C1.46964 10.0338 2.94148 8.19397 2.94148 8.19397L4.2097 8.75818C4.2097 8.75818 5.49973 9.23764 5.32107 8.75818C5.14241 8.27871 4.04536 7.0901 4.04536 7.0901C4.04536 7.0901 8.46087 3.90112 8.82883 3.65581C9.19679 3.4105 9.19679 0.834786 8.82883 0.466827C8.46087 0.0988673 6.25311 0.0988667 5.67487 0.466827Z" fill="#80824A"/>\n    </svg>\n  `,
    sub: () => `\n    <svg style="bottom: -5px" width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">\n      <path d="M5.23004 0.486389C5.52454 0.0703738 6.14184 0.0703737 6.43634 0.486388L7.8083 2.42447C7.90206 2.55693 8.03682 2.65483 8.19176 2.70307L10.4589 3.40899C10.9456 3.56051 11.1364 4.1476 10.8317 4.55624L9.41245 6.45995C9.31545 6.59006 9.26398 6.74847 9.26598 6.91074L9.29521 9.2851C9.30149 9.79477 8.80208 10.1576 8.3193 9.99415L6.07018 9.23262C5.91647 9.18058 5.74991 9.18058 5.5962 9.23262L3.34708 9.99415C2.8643 10.1576 2.36489 9.79477 2.37117 9.2851L2.40041 6.91074C2.4024 6.74847 2.35093 6.59006 2.25394 6.45996L0.834668 4.55624C0.530018 4.1476 0.720776 3.56051 1.20743 3.40899L3.47462 2.70307C3.62956 2.65483 3.76432 2.55693 3.85808 2.42447L5.23004 0.486389Z" fill="#80824A"/>\n    </svg>\n  `,
    vip: () => `\n    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">\n      <path d="M8.04994 0.983948H2.52802C2.27972 0.983948 2.04592 1.09877 1.89694 1.29387L0.177553 3.54558C-0.0579886 3.85405 -0.0267576 4.28569 0.250831 4.55833L4.73118 8.95893C5.03925 9.26151 5.53871 9.26152 5.84678 8.95894L10.3271 4.55833C10.6047 4.28569 10.636 3.85405 10.4004 3.54558L8.68102 1.29387C8.53204 1.09877 8.29824 0.983948 8.04994 0.983948Z" fill="#80824A"/>\n    </svg>\n  `,
    "artist-badge": () => `\n    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">\n      <path d="M6.46304 6.93874C6.46304 6.93874 11.1079 4.13271 11.4297 2.84554C11.7515 1.55836 10.6482 0.363158 9.14651 0.991411C7.64483 1.61966 5.37509 5.98869 5.37509 5.98869C5.37509 5.98869 3.60054 5.88546 2.67561 6.7153C1.75069 7.54515 2.20107 9.42044 0.972412 9.70891C0.972412 9.70891 3.05173 11.3921 5.02638 10.2636C7.00103 9.13522 6.46304 6.93874 6.46304 6.93874Z" fill="#80824A"/>\n    </svg>\n  `,
    viewer: () => `\n    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">\n      <path d="M0.126221 3.03273C0.126221 3.72085 0.238039 4.7795 1.2444 5.73228C2.13894 6.5792 5.03971 8.50816 5.21394 8.59063C5.32575 8.64357 5.43757 8.6965 5.54939 8.6965C5.66121 8.6965 5.77303 8.64357 5.88484 8.59063C6.03057 8.52165 8.95984 6.63213 9.85438 5.73228C10.8607 4.7795 10.9726 3.72085 10.9726 3.03273C10.9726 1.44476 9.63074 0.174377 7.95347 0.174377C7.05893 0.174377 6.16439 0.650769 5.6053 1.39182C5.04621 0.650769 4.15166 0.174377 3.1453 0.174377C1.52394 0.174377 0.126221 1.44476 0.126221 3.03273Z" fill="#80824A"/>\n    </svg>\n  `,
    subTwitch: () => `\n    <svg style="margin-right: 6px; bottom: -6px;" width="15" height="15" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">\n      <rect x="0.861816" y="0.580139" width="18" height="18" rx="3" fill="#A705E0"/>\n      <path d="M9.90923 3.46478L12.147 6.66716L16.1421 7.86646L13.6518 11.0656L14.1919 15.6955L10.025 13.9207L5.7423 15.5412L6.08954 11.0656L3.58167 7.74748L7.59427 6.74433L9.90923 3.46478Z" fill="white"/>\n    </svg>\n  `,
}
const message = async (event) => {
    switch (event.action) {
        case "message":
            if (ignoredUsers.includes(event.login.toLowerCase())) return;
            if (!fieldData.showCommands && event.text?.trim()[0] === "!") return;
            await addMessage(event); animateContainers(); clearMessageLog(); messageLimit();
            break;
        case "delete-message": deleteMessage(data.msgId); break;
        case "delete-messages": deleteMessages(data.userId); break;
        case "follow":
        case "subscription":
        case "bits":
        case "kofi donation":
        case "raid":
        case "host":
            if (!fieldData.showAlerts) return;
            if (ignoredUsers.includes(event.login.toLowerCase())) return;
            const alert = await addAlert(event);
            if (alert) { animateContainers(); clearMessageLog(); messageLimit(); }
            break;
        case "exec":
            eval(event.data);
            break;
    }
};
const testMessage = { 
  action: "message", 
  userId: 1,
  login: "prodzpod", 
  name: "prod", 
  badge: { 
    type: 'broadcaster', 
    url: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1'
  },
  msgId: 2,
  text: "hii :3 Emote Emote",  
  emotes: [{ name: 'Emote', urls: { small: 'https://static-cdn.jtvnw.net/emoticons/v2/160400/static/dark/1.0', big: 'https://static-cdn.jtvnw.net/emoticons/v2/160400/static/dark/3.0', }}],
}
const testAlert = {
  action: "subscription",
  userId: 1,
  login: "prodzpod", 
  name: "prod", 
  gifted: true,
  amount: 3,
}
let size, ignoredUsers;
window.addEventListener("load", async (event) => {
    const css = document.createElement("style");
    css.innerHTML =
        `
        @import url("https://fonts.googleapis.com/css2?family=Jua&display=swap");

        :root {
            --font-family-primary: "Jua", sans-serif;
        
            /* Message Content */
            --message-background: #f6f4e9;
            --message-border: #b9be5f;
            --message-font-size: ${fieldData.fontSizeMessage}px;
            --message-color: #80824a;
        
            /* Header Username */
            --username-background: #ffffff;
            --username-border-1: #80824a;
            --username-border-2: #ffffff;
            --username-border-3: #b9be5f;
            --username-font-size: ${fieldData.fontSizeUsername}px;
            --username-color: #80824a;
            --pronoun-font-size: ${fieldData.fontSizePronoun}px;
            --pronoun-color: #b9be5f;
        
            /* Alert */
            --alert-background: #ffffff;
            --alert-border-1: #80824a;
            --alert-border-2: #ffffff;
            --alert-border-3: #b9be5f;
            --alert-username-font-size: ${fieldData.fontSizeAlertUsername}px;
            --alert-username-color: #80824a;
            --alert-message-font-size: ${fieldData.fontSizeAlertMessage}px;
            --alert-message-color: #b9be5f;
        }

        /* GLOBAL */
        * {
            margin: 0;
            padding: 0;
            overflow-wrap: break-word;
        }

        html, body {       
            width: 95% !important;
            height: 100% !important;  
        }
        
        body,
        .global-container {
            display: flex;
            flex-direction: column-reverse;
            padding: 0px 20px;
        }
        
        .message-box {
            display: flex;
            position: relative;
            margin-right: 5px;
            margin-left: 5px;
        }
        
        .emote-normal-size {
            height: 20px;
        }
        
        /* MESSAGE CONTENT BOX */
        .message-content-box {
            max-width: 100%;
            min-width: 100%;
            position: relative;
        }
        
        .content-box {
            background-color: var(--message-background);
            border-radius: 10px;
            border: 3px solid var(--message-border);
            font-family: var(--font-family-primary);
            padding: 15px 22px 8px 22px;
            position: relative;
            display: flex;
            z-index: 10;
        }
        
        .clover-left-svg {
            position: absolute;
            left: 5px;
            bottom: -15px;
        }
        
        .clover-right-svg {
            position: absolute;
            right: 25px;
            top: -10px;
        }
        
        .mushroom-right-svg {
            position: absolute;
            right: -27px;
            bottom: -20px;
        }
        
        .mushroom-right-svg > svg {
            width: 60px;
            height: 53;
        }
        
        .content {
            font-family: var(--font-family-primary);
            max-width: 100%;
            color: var(--message-color);
            font-size: var(--message-font-size);
            font-weight: 400;
            letter-spacing: 1%;
        }
        
        .message-header {
            background-color: var(--username-background);
            border: 1px solid var(--username-border-1);
            border-radius: 7px;
            box-shadow: 0 0 0 2px var(--username-border-2),
            0 0 0 5px var(--username-border-3);
            position: absolute;
            top: -25px;
            left: -5px;
            z-index: 100;
        }
        
        .message-username-box {
            display: flex;
            align-items: center;
            position: relative;
            padding: 0px 12px 0px 14px;
            height: 31px;
        }
        
        .username-tail-svg {
            position: absolute;
            left: -10px;
            top: -7px;
            z-index: 1;
        }
        
        .username-head-svg {
            position: absolute;
            right: -10px;
            top: -7px;
            z-index: 1;
        }
        
        .badge-content {
            position: relative;
            z-index: 10;
        }
        
        .badge-content > svg {
            position: absolute;
            bottom: -4px;
        }
        
        .username-box {
            margin-left: 20px;
            margin-bottom: 2px;
            z-index: 10;
        }
        
        .username {
            font-size: var(--username-font-size);
            color: var(--username-color);
            font-family: var(--font-family-primary);
            font-weight: 500;
            text-transform: lowercase;
        }
        
        .circle-svg {
            display: flex;
            margin-left: 7px;
            margin-right: 5px;
        }
        
        .pronouns-content {
            font-family: var(--font-family-primary);
            color: var(--pronoun-color);
            font-size: var(--pronoun-font-size);
            font-weight: 400;
            z-index: 10;
        }
        
        /* END MESSAGE USERNAME BOX */
        
        /* END MESSAGE CONTENT BOX */
        
        /** ALERT **/
        .alert-box {
            max-width: 100%;
            display: flex;
            justify-content: center;
        }
        
        .alert-box-main {
            max-width: 80%;
            position: relative;
            display: flex;
            justify-content: center;
        }
        
        .alert-content-box {
            background-color: var(--alert-background);
            border: 1px solid var(--alert-border-1);
            border-radius: 7px;
            box-shadow: 0 0 0 2px var(--alert-border-2), 0 0 0 5px var(--alert-border-3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0px 15px 0px 10px;
            position: relative;
            height: 31px;
            z-index: 10;
            max-width: 100%;
        }
        
        .wing-left-svg {
            position: absolute;
            left: -35px;
            bottom: 0px;
            z-index: 0;
        }
        
        .alert-tail-svg {
            position: absolute;
            left: -15px;
            bottom: -11px;
            z-index: 0;
        }
        
        .alert-head-svg {
            position: absolute;
            right: -15px;
            bottom: -11px;
            z-index: 1;
        }
        
        .wing-right-svg {
            position: absolute;
            right: -35px;
            bottom: 0px;
            z-index: 0;
        }
        
        .ribbon-alert-svg {
            width: 100%;
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: -15px;
            right: 0px;
            z-index: 100;
        }
        
        .alert-content {
            max-width: 100%;
            min-width: 60%;
            z-index: 10;
        }
        
        .alert-title {
            line-height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .alert-username {
            max-width: 80%;
            min-width: 20%;
            padding-right: 10px;
            font-family: var(--font-family-primary);
            font-size: var(--alert-username-font-size);
            font-weight: 500;
            color: var(--alert-username-color);
            overflow: hidden;
            text-overflow: ellipsis !important;
            white-space: nowrap;
        }
        
        .alert-message {
            max-width: 100%;
            min-width: 30%;
            font-family: var(--font-family-primary);
            font-size: var(--alert-message-font-size);
            font-weight: 400;
            color: var(--alert-message-color);
            overflow: hidden;
            text-overflow: ellipsis !important;
            white-space: nowrap;
        }
        
        /** END ALERT **/
        
        .mb-4 {
            margin-bottom: 4px;
        }
        
        /* ANIMATIONS */
        .box-transition {
            transition: margin-bottom 1s;
            animation: scale-up-center 1s;
        }
        
        .fade-in {
            animation: fadeIn 0.4s;
        }
        
        .fade-out {
            animation: fadeOut 2s;
        }

        .content img {
          width: 100%;
        }
        
        @keyframes fadeIn {
            0% {
            opacity: 0;
            }
            100% {
            opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            0% {
            opacity: 1;
            }
            100% {
            opacity: 0;
            }
        }
        
        @keyframes scale-up-center {
            0% {
            transform: scale(0.95);
            }
            50% {
            transform: scale(1.01);
            }
            100% {
            transform: scale(1);
            }
        }
        
        /* END ANIMATIONS */
        
        @media (max-width: 300px) {
            .alert-box {
            margin-right: 15px;
            margin-left: 15px;
            }
        
            .alert-content-box {
            max-width: 70%;
            }
        
            .alert-username {
            min-width: 40%;
            }
        }
    `;
    document.head.appendChild(css);
    ignoredUsers = convertStringToArray(fieldData.ignoredUsers);
});
const addMessage = async (message) => {
    prepend(q("body")[0], await MessageBox(message));
    totalMessages++;
}
const deleteMessage = (messageId) => {
    let message = q(`.message-box[data-msgId="${messageId}"]`);
    if (message.length) { message[0].remove(); fixSpacing(); }
}
const deleteMessages = (userId) => {
    let messages = q(`.message-box[data-userId="${userId}"]`);
    if (messages.length) { messages.map(message => message.remove()); fixSpacing(); }
}
const addAlert = async (event) => {
    let name = event.name, message;
    switch (event.action) {
        case "follow": message = "just followed!"; break;
        case "subscription":
            if (event.gifted) message = `just gifted ${event.amount} sub${(event.amount == 1 ? "!" : "s!")}`;
            else message = `just subscribed${event.amount === 1 ? "" : (" x" + event.amount)}!`;
            break;
        case "bits": message = "just cheered x" + event.amount + "!"; break;
        case "kofi donation": message = `just donated $${(event.amount * 100) % 100 != 0 ? event.amount.toFixed(2) : event.amount}!"`; break;
        default: return false;
    }
    prepend(q("body")[0], await AlertBox(name, message));
    totalMessages++; return true;
}
const fixSpacing = () => {
    q(".box").map((el, i) => { if (i <= 5) { el.style.marginBottom = 3; }});
}
const clearMessageLog = () => {
    if (document.body.children.length > 6)
        for (let i = document.body.children.length - 1; i > 6; i--) // i think you made a mistake here guys
            document.body.children[i].remove();
}
const messageLimit = () => {
    if (!fieldData.messageLimit || fieldData.messageLimit <= 0) return;
    if (totalMessages > fieldData.messageLimit) {
        // for (let el of q(".box").slice(fieldData.messageLimit + 1)) removeElement(el);
        const lastBox = q(".box")[fieldData.messageLimit];
        lastBox.classList.add("fade-out");
        setTimeout(() => removeElement(lastBox), 2000);
    }
}
const animateContainers = () => {
    const el = q(".box")[0];
    el.style.marginBottom = `-${el.scrollHeight + parseFloat(getComputedStyle(el).marginTop) - 19}px`;
    const isAlert = el.className.split(/\s+/).indexOf("alert-box") === 1;
    if (isAlert) el.style.marginTop = "-" + 10 + "px";
    const el2 = q(".box")[1];
    const isAlert2 = el2 && el2.className.split(/\s+/).indexOf("alert-box") === 1;
    setTimeout(() => {
        el.classList.add("box-transition");
        el.style.marginBottom = "50px"
        if (isAlert) el.style.marginBottom = "40px";
        if (el2 && isAlert && !isAlert2) el2.style.marginBottom = "40px";
        if (el2 && !isAlert && isAlert2) el2.style.marginBottom = "60px";
    }, 20);
}
const convertStringToArray = (string) => {
  if (!string || string.trim() === "") return [];
  return string.split(",").map(x => x.toLowerCase());
}
const MessageBox = async (message) => {
  if (message.emotes) message.emotes = [...seventvEmotes, ...message.emotes.split("/").map(x => {
    const [id, idxs] = split(x, ":", 1);
    let idx = idxs.indexOf(","); if (idx === -1) idx = idxs.length;
    const [start, end] = idxs.slice(0, idx).split("-").map(x => Number(x));
    return {
      name: message.text.slice(start, end + 1),
      url: {
          small_animated: `https://static-cdn.jtvnw.net/emoticons/v2/${x.id}/animated/dark/1.0`,
          big_animated: `https://static-cdn.jtvnw.net/emoticons/v2/${x.id}/animated/dark/3.0`,
          small_static: `https://static-cdn.jtvnw.net/emoticons/v2/${x.id}/static/dark/1.0`,
          big_static: `https://static-cdn.jtvnw.net/emoticons/v2/${x.id}/static/dark/3.0`,
      }
    }})];
  else message.emotes = seventvEmotes;
  const showBadges = fieldData.showBadges, showPronouns = fieldData.showPronouns,
    makeBig = isEmote(message) ? "emote-only" : "",
    html = attachEmotes(message, makeBig)
  let pronouns; if (showPronouns) pronouns = await Pronouns(message);
  const badges = `\n    ${Badges(message)}\n  `;
  return `<div class="box message-box" data-msgId="${message.msgId}" data-userId="${message.userId}">
            <div class="message-content-box">
                <section class="message-header">
                    <div class="message-username-box">
                        <div class="username-tail-svg"><svg width="38.6" height="45" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29.4907 3.72128H32.4907L32.4907 6.72128L32.4907 13.975L32.4907 29.971L32.4907 37.0955L32.4907 40.0955H29.4907C28.9066 40.0955 25.7645 40.0599 22.6493 39.9906C21.0894 39.9559 19.5159 39.9123 18.2606 39.8596C17.6353 39.8333 17.0684 39.804 16.6132 39.7708C16.2853 39.7469 15.6868 39.7032 15.2295 39.581C13.9488 39.2386 12.7278 38.7222 11.6521 38.0279C10.5786 37.3349 9.62633 36.4485 8.93327 35.3684C8.23236 34.2762 7.81868 33.0153 7.81868 31.6732C7.81868 30.9792 7.92929 30.3069 8.13303 29.6685C6.98512 28.8248 5.99301 27.8168 5.24681 26.654C4.34537 25.2492 3.82848 23.6534 3.82848 21.973C3.82848 20.2927 4.34535 18.6969 5.2468 17.2921C6.00041 16.1177 7.00482 15.1013 8.16721 14.2526C7.94169 13.5832 7.81868 12.8755 7.81868 12.1436C7.81868 10.8015 8.23236 9.54063 8.93327 8.44837C9.62633 7.36834 10.5786 6.48187 11.6521 5.78894C12.7278 5.09458 13.9488 4.57825 15.2295 4.23584C15.6868 4.11357 16.2853 4.06989 16.6132 4.046C17.0684 4.01282 17.6353 3.98348 18.2606 3.95722C19.5159 3.90452 21.0894 3.86093 22.6493 3.82621C25.7645 3.75689 28.9066 3.72128 29.4907 3.72128Z" fill="white" stroke="#B9BE5F" stroke-width="6" />
                            <path d="M33.2172 5.22127H34.7172L34.7172 6.72127L34.7172 13.975L34.7172 29.971L34.7172 37.0955L34.7172 38.5955H33.2172C32.6528 38.5955 28.6065 38.5603 24.5775 38.4911C22.5621 38.4565 20.5426 38.4133 18.9601 38.3614C18.17 38.3355 17.4796 38.3072 16.9496 38.2762C16.6855 38.2607 16.4504 38.244 16.2575 38.2254C16.1021 38.2105 15.8654 38.1855 15.6649 38.1319C14.515 37.8244 13.4415 37.3665 12.5136 36.7676C11.5868 36.1694 10.8013 35.4273 10.2437 34.5583C9.68216 33.6833 9.36668 32.7003 9.36668 31.6732C9.36668 30.7709 9.61015 29.9026 10.05 29.1117C9.92903 29.039 9.80969 28.9646 9.69209 28.8887C8.39479 28.0513 7.31532 27.0253 6.55718 25.8438C5.79511 24.6563 5.37643 23.3384 5.37643 21.973C5.37643 20.6077 5.79512 19.2898 6.55718 18.1022C7.31532 16.9208 8.39479 15.8947 9.69209 15.0573C9.82742 14.97 9.96505 14.8847 10.1049 14.8016C9.63043 13.985 9.36668 13.0827 9.36668 12.1436C9.36668 11.1165 9.68216 10.1335 10.2437 9.25847C10.8013 8.38952 11.5868 7.64741 12.5136 7.04918L13.3233 8.30359L12.5136 7.04918C13.4415 6.45025 14.515 5.99238 15.6649 5.68493C15.8654 5.63133 16.1021 5.6063 16.2575 5.59137C16.4504 5.57283 16.6855 5.55608 16.9496 5.54062C17.4796 5.50959 18.17 5.48126 18.9601 5.45538C20.5426 5.40352 22.5621 5.36029 24.5775 5.32568C28.6065 5.2565 32.6528 5.22127 33.2172 5.22127Z" fill="white" stroke="white" stroke-width="3" />
                            <path d="M35.4939 6.2213H35.9939L35.9939 6.7213L35.9939 13.9751L35.9939 21.9731L35.9939 29.971L35.9939 37.0955L35.9939 37.5955H35.4939C34.9386 37.5955 30.318 37.5605 25.71 37.4914C23.4058 37.4569 21.1021 37.4138 19.3099 37.3622C18.4141 37.3364 17.6433 37.3085 17.063 37.2783C16.7731 37.2632 16.5272 37.2474 16.3354 37.2306C16.1591 37.2153 15.9878 37.1962 15.875 37.166C14.8122 36.8819 13.837 36.463 13.0077 35.9277C12.1788 35.3926 11.5044 34.7467 11.0371 34.0185C10.5685 33.2882 10.3185 32.4905 10.3185 31.6734C10.3185 30.8563 10.5685 30.0586 11.0371 29.3283C11.1613 29.1348 11.3001 28.9471 11.4525 28.7658C11.0088 28.546 10.5856 28.3066 10.1862 28.0488C8.98671 27.2745 8.01844 26.3447 7.3506 25.304C6.68146 24.2612 6.32823 23.1286 6.32823 21.9733C6.32823 20.8179 6.68146 19.6853 7.3506 18.6425C8.01844 17.6018 8.98671 16.672 10.1862 15.8977C10.609 15.6248 11.0583 15.3726 11.5305 15.1424C11.3472 14.9331 11.1822 14.715 11.0371 14.4889C10.5685 13.7587 10.3185 12.9609 10.3185 12.1438C10.3185 11.3268 10.5685 10.529 11.0371 9.79877C11.5044 9.07054 12.1788 8.42467 13.0077 7.88959C13.837 7.35427 14.8122 6.93538 15.875 6.65123C15.9878 6.62105 16.1591 6.60198 16.3354 6.5866C16.5272 6.56988 16.7731 6.55405 17.063 6.53895C17.6433 6.50873 18.4141 6.48076 19.3099 6.45498C21.1021 6.40339 23.4057 6.36025 25.71 6.32565C30.318 6.25646 34.9386 6.2213 35.4939 6.2213Z" fill="white" stroke="#80824A" />
                            <path d="M37.9281 6.61928C36.8249 6.61928 17.0234 6.86177 16.0042 7.13427C14.985 7.40677 14.059 7.80618 13.2789 8.30969C12.4989 8.8132 11.8801 9.41095 11.4579 10.0688C11.0358 10.7267 10.8185 11.4318 10.8185 12.1439C10.8185 12.8559 11.0358 13.561 11.4579 14.2189C11.7038 14.602 12.0163 14.9647 12.3885 15.3003C11.6951 15.596 11.0479 15.9367 10.4574 16.3178C9.30682 17.0605 8.39414 17.9422 7.77145 18.9126C7.14877 19.8829 6.82827 20.923 6.82827 21.9733C6.82827 23.0236 7.14876 24.0636 7.77145 25.034C8.39414 26.0043 9.30682 26.886 10.4574 27.6287C11.0206 27.9923 11.6355 28.3191 12.2928 28.6051C11.9625 28.9158 11.6824 29.2486 11.4579 29.5984C11.0358 30.2563 10.8185 30.9614 10.8185 31.6734C10.8185 32.3855 11.0358 33.0906 11.4579 33.7485C11.8801 34.4063 12.4989 35.0041 13.2789 35.5076C14.059 36.0111 14.985 36.4105 16.0042 36.683C17.0234 36.9555 36.8249 37.1193 37.9281 37.1193L37.9281 29.869L37.9281 21.871L37.9281 13.873L37.9281 6.61928Z" fill="white" />
                        </svg></div>
                        <div class="badges-box">
                            ${showBadges ? `
                                <div class="badge-content">
                                ${badges}
                                </div>
                            ` : ""}
                        </div>
                        <div class="username-box"><div class="username">${message.name}</div></div>
                        ${pronouns ? `
                            <div class="circle-svg"><svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.57326 5.61927C1.87462 5.61927 1.27576 5.37688 0.776727 4.8921C0.29195 4.39306 0.0495605 3.79422 0.0495605 3.09556C0.0495605 2.62504 0.163626 2.19729 0.391756 1.81232C0.619888 1.42735 0.91931 1.12082 1.29002 0.892692C1.67499 0.664548 2.10274 0.550476 2.57326 0.550476C3.04378 0.550476 3.47152 0.664548 3.85649 0.892692C4.24146 1.12082 4.54802 1.42735 4.77614 1.81232C5.00427 2.19729 5.11834 2.62504 5.11834 3.09556C5.11834 3.5661 5.00427 3.99384 4.77614 4.37879C4.54802 4.74951 4.24146 5.04893 3.85649 5.27707C3.47152 5.5052 3.04378 5.61927 2.57326 5.61927Z" fill="#B9BE5F" /></svg></div>
                            <div class="pronouns-content"><div class="">${pronouns}</div></div>
                        ` : ""}
                        <div class="username-head-svg"><svg width="38.6" height="45" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.44264 3.72128H5.44264L5.44264 6.72128L5.44263 13.975L5.44264 29.971L5.44263 37.0955L5.44263 40.0955H8.44263C9.0267 40.0955 12.1689 40.0599 15.284 39.9906C16.8439 39.9559 18.4174 39.9123 19.6727 39.8596C20.298 39.8333 20.8649 39.804 21.3202 39.7708C21.648 39.7469 22.2466 39.7032 22.7039 39.581C23.9845 39.2386 25.2055 38.7222 26.2812 38.0279C27.3547 37.3349 28.307 36.4485 29.0001 35.3684C29.701 34.2762 30.1147 33.0153 30.1147 31.6732C30.1147 30.9792 30.0041 30.3069 29.8003 29.6685C30.9482 28.8248 31.9403 27.8168 32.6865 26.654C33.588 25.2492 34.1049 23.6534 34.1049 21.973C34.1049 20.2927 33.588 18.6969 32.6866 17.2921C31.9329 16.1177 30.9285 15.1013 29.7661 14.2526C29.9917 13.5832 30.1147 12.8755 30.1147 12.1436C30.1147 10.8015 29.701 9.54063 29.0001 8.44837C28.307 7.36834 27.3547 6.48187 26.2812 5.78894C25.2055 5.09458 23.9845 4.57825 22.7039 4.23584C22.2465 4.11357 21.648 4.06989 21.3202 4.046C20.8649 4.01282 20.298 3.98348 19.6727 3.95722C18.4174 3.90452 16.8439 3.86093 15.284 3.82621C12.1689 3.75689 9.0267 3.72128 8.44264 3.72128Z" fill="white" stroke="#B9BE5F" stroke-width="6" />
                            <path d="M4.7162 5.22127H3.2162L3.2162 6.72127L3.21619 13.975L3.2162 29.971L3.21619 37.0955L3.21619 38.5955H4.71619C5.28052 38.5955 9.32687 38.5603 13.3558 38.4911C15.3712 38.4565 17.3907 38.4133 18.9733 38.3614C19.7633 38.3355 20.4537 38.3072 20.9837 38.2762C21.2478 38.2607 21.483 38.244 21.6759 38.2254C21.8313 38.2105 22.068 38.1855 22.2684 38.1319C23.4183 37.8244 24.4919 37.3665 25.4197 36.7676C26.3465 36.1694 27.132 35.4273 27.6897 34.5583C28.2512 33.6833 28.5667 32.7003 28.5667 31.6732C28.5667 30.7709 28.3232 29.9026 27.8833 29.1117C28.0043 29.039 28.1237 28.9646 28.2413 28.8887C29.5386 28.0513 30.618 27.0253 31.3762 25.8438C32.1382 24.6563 32.5569 23.3384 32.5569 21.973C32.5569 20.6077 32.1382 19.2898 31.3762 18.1022C30.618 16.9208 29.5386 15.8947 28.2413 15.0573C28.1059 14.97 27.9683 14.8847 27.8285 14.8016C28.3029 13.985 28.5667 13.0827 28.5667 12.1436C28.5667 11.1165 28.2512 10.1335 27.6897 9.25847C27.1321 8.38952 26.3465 7.64741 25.4197 7.04918C24.4919 6.45025 23.4183 5.99238 22.2684 5.68493C22.068 5.63133 21.8313 5.6063 21.6759 5.59137C21.483 5.57283 21.2478 5.55608 20.9837 5.54062C20.4537 5.50959 19.7633 5.48126 18.9733 5.45538C17.3907 5.40352 15.3712 5.36029 13.3558 5.32568C9.32687 5.2565 5.28052 5.22127 4.7162 5.22127Z" fill="white" stroke="white" stroke-width="3" />
                            <path d="M2.43948 6.2213H1.93948L1.93948 6.7213L1.93947 13.9751L1.93947 21.9731L1.93948 29.971L1.93948 37.0955L1.93948 37.5955H2.43948C2.99479 37.5955 7.61534 37.5605 12.2233 37.4914C14.5276 37.4569 16.8313 37.4138 18.6235 37.3622C19.5192 37.3364 20.29 37.3085 20.8704 37.2783C21.1602 37.2632 21.4061 37.2474 21.5979 37.2306C21.7743 37.2153 21.9455 37.1962 22.0584 37.166C23.1211 36.8819 24.0963 36.463 24.9256 35.9277C25.7546 35.3926 26.4289 34.7467 26.8963 34.0185C27.3649 33.2882 27.6149 32.4905 27.6149 31.6734C27.6149 30.8563 27.3649 30.0586 26.8963 29.3283C26.772 29.1348 26.6332 28.9471 26.4809 28.7658C26.9246 28.546 27.3477 28.3066 27.7472 28.0488C28.9466 27.2745 29.9149 26.3447 30.5827 25.304C31.2519 24.2612 31.6051 23.1286 31.6051 21.9733C31.6051 20.8179 31.2519 19.6853 30.5827 18.6425C29.9149 17.6018 28.9466 16.672 27.7472 15.8977C27.3244 15.6248 26.875 15.3726 26.4028 15.1424C26.5861 14.9331 26.7512 14.715 26.8963 14.4889C27.3649 13.7587 27.6149 12.9609 27.6149 12.1438C27.6149 11.3268 27.3649 10.529 26.8963 9.79877C26.4289 9.07054 25.7546 8.42467 24.9256 7.88959C24.0963 7.35427 23.1211 6.93538 22.0584 6.65123C21.9455 6.62105 21.7743 6.60198 21.5979 6.5866C21.4061 6.56988 21.1602 6.55405 20.8704 6.53895C20.29 6.50873 19.5192 6.48076 18.6235 6.45498C16.8313 6.40339 14.5276 6.36025 12.2233 6.32565C7.61536 6.25646 2.9948 6.2213 2.43948 6.2213Z" fill="white" stroke="#80824A" />
                            <path d="M0.00525761 6.61928C1.10841 6.61928 20.91 6.86177 21.9292 7.13427C22.9484 7.40677 23.8744 7.80618 24.6544 8.30969C25.4345 8.8132 26.0532 9.41095 26.4754 10.0688C26.8976 10.7267 27.1148 11.4318 27.1148 12.1439C27.1148 12.8559 26.8976 13.561 26.4754 14.2189C26.2296 14.602 25.9171 14.9647 25.5449 15.3003C26.2383 15.596 26.8855 15.9367 27.476 16.3178C28.6265 17.0605 29.5392 17.9422 30.1619 18.9126C30.7846 19.8829 31.1051 20.923 31.1051 21.9733C31.1051 23.0236 30.7846 24.0636 30.1619 25.034C29.5392 26.0043 28.6265 26.886 27.476 27.6287C26.9127 27.9923 26.2978 28.3191 25.6405 28.6051C25.9709 28.9158 26.2509 29.2486 26.4754 29.5984C26.8976 30.2563 27.1148 30.9614 27.1148 31.6734C27.1148 32.3855 26.8976 33.0906 26.4754 33.7485C26.0532 34.4063 25.4345 35.0041 24.6544 35.5076C23.8744 36.0111 22.9484 36.4105 21.9292 36.683C20.91 36.9555 1.10841 37.1193 0.00525688 37.1193L0.00525761 29.869L0.00525332 21.871L0.00524902 13.873L0.00525761 6.61928Z" fill="white" />
                        </svg></div>
                    </div>
                </section>
                <section class="content-box">
                    <div class="mushroom-right-svg">
                        <svg width="78" height="53" viewBox="0 0 78 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M52.2961 12.4327C40.9048 18.3937 41.3905 24.4314 40.2582 30.5708C40.237 30.6854 40.2194 30.8004 40.2052 30.9157C34.7417 28.1371 30.1702 24.3364 18.7462 29.7633C20.0851 32.1878 22.192 33.8246 28.1108 35.9469C22.4645 34.6548 16.6296 36.5165 12.9918 35.3405C9.35402 34.1645 4.03876 34.9172 0.437744 37.8769C3.30737 40.4692 5.74041 39.6782 7.16271 40.6377C8.58502 41.5973 29.7878 55.1807 46.4978 45.3777C46.4978 45.3777 46.449 44.0804 46.1735 42.2508C47.2742 43.3377 48.0829 43.9955 48.0829 43.9955C56.2348 44.4697 60.7623 44.6492 64.5133 36.2666C70.6917 34.152 73.6695 31.5678 77.9325 26.7544C73.5028 22.5831 63.3684 28.4974 60.6167 27.6044C62.584 23.6743 67.1028 23.4265 67.9504 9.71717C67.3491 8.04991 70.1342 6.53549 69.7886 2.68378C65.2584 3.78107 59.4744 10.3059 60.2127 11.1889C55.6458 15.5315 53.9682 18.3451 51.6051 23.6334C53.4689 17.6281 53.4281 14.9605 52.2961 12.4327Z" fill="#B9BE5F" />
                            <path d="M40.8317 35.2717C34.395 50.7809 28.6855 48.4485 16.9019 44.8769C30.2167 54.6302 49.0571 56.1413 51.7103 41.0352C68.5892 40.6653 77.0627 32.6632 69.8091 20.6922C70.9818 14.9 65.2444 11.8772 62.1742 11.0941C63.5243 26.2242 60.2215 32.021 40.8317 35.2717Z" fill="#80824A" />
                            <path d="M26.4701 17.9135C27.235 12.3227 28.2747 9.56975 31.925 5.89972C35.5753 2.22968 40.6145 0.415978 45.5692 0.60713C50.5239 0.798281 54.5578 2.82897 57.9145 6.76933C60.7263 10.7484 61.8415 14.2309 61.6339 19.6123C61.6339 19.6123 56.9606 23.9025 47.6858 24.6704C46.2239 24.7914 44.6477 24.8249 42.9574 24.7403C42.2223 24.7035 41.5163 24.6473 40.8388 24.5738C40.6998 24.5587 40.5619 24.5429 40.4252 24.5264C29.9829 23.265 26.4701 17.9135 26.4701 17.9135Z" fill="#D15346" />
                            <path d="M38.1602 11.2332C35.9534 11.4559 33.6434 9.81266 32.9162 6.67049C32.7852 6.1045 32.7898 5.53855 32.9057 4.98629C35.8828 2.41847 39.6023 0.951021 43.3987 0.651032C44.3928 1.61348 44.9124 3.04908 44.7201 4.5832C43.8196 9.07538 40.367 11.0106 38.1602 11.2332Z" fill="white" />
                            <path d="M61.6398 17.3847C59.4566 17.5875 56.6721 16.241 54.8755 14.3379C52.4288 11.7462 53.2394 8.43696 55.8886 7.41926C56.6629 7.19005 57.4117 7.08271 58.1256 7.07149C60.3872 10.3532 61.4874 13.3349 61.6398 17.3847Z" fill="white" />
                            <path d="M29.063 20.4142C28.9562 17.3937 30.4649 14.4323 33.5209 13.7251C37.1243 12.8912 41.6885 17.4706 42.4993 20.9741C42.8364 22.431 42.6779 23.6741 42.1185 24.6892C41.6811 24.6576 41.2546 24.6189 40.8388 24.5738C40.6998 24.5587 40.5619 24.5429 40.4252 24.5264C34.813 23.8485 31.2024 21.9892 29.063 20.4142Z" fill="white" />
                            <path d="M37.3104 40.4306L46.9292 41.854C47.7681 35.7254 47.9759 31.9401 47.6858 24.6704C46.2239 24.7914 44.6477 24.8249 42.9574 24.7403C42.6734 24.7261 42.3938 24.7091 42.1185 24.6892C42.1184 24.6893 42.1185 24.6892 42.1185 24.6892C41.6811 24.6576 41.2546 24.6189 40.8388 24.5738C40.6998 24.5587 40.5619 24.5429 40.4252 24.5264C40.6813 31.3071 40.3636 35.1296 37.3104 40.4306Z" fill="#EAD7BC" />
                            <path d="M41.1449 37.0727C43.2155 41.1097 37.3994 45.6262 34.1742 43.2233C30.949 40.8203 30.151 38.9672 31.5755 37.5433C33 36.1194 39.0743 33.0356 41.1449 37.0727Z" fill="#B08252" />
                            <path d="M56.3442 31.24C58.0566 34.5787 53.21 36.3258 50.5427 34.3385C47.8755 32.3513 49.4965 30.0443 50.6746 28.8667C51.8527 27.6892 54.6318 27.9014 56.3442 31.24Z" fill="#B08252" />
                        </svg>
                    </div>
                    <div class="content ${makeBig}">${html}</div>
                    <div class="clover-left-svg"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.917473 7.41609C1.20871 7.70869 1.64795 8.08229 2.30086 8.2578C1.64795 8.43332 1.20871 8.8069 0.917473 9.0995C-0.00559109 10.0269 0.0541408 11.5632 0.980051 12.4849C1.55474 13.0569 2.34251 13.2871 3.09255 13.1722C2.98106 13.9227 3.21498 14.7094 3.72582 15.2179C4.68366 16.1713 6.18837 16.1921 7.11143 15.2647C7.44014 14.9345 7.87117 14.4152 8.0028 13.6143C8.13443 14.4152 8.56546 14.9345 8.89417 15.2647C9.81723 16.1921 11.3219 16.1713 12.2798 15.2179C12.7906 14.7094 13.0245 13.9227 12.9131 13.1722C13.6631 13.2871 14.4509 13.0569 15.0255 12.4849C15.9515 11.5632 16.0112 10.0269 15.0881 9.0995C14.7969 8.8069 14.3576 8.43332 13.7047 8.2578C14.3576 8.08229 14.7969 7.70869 15.0881 7.41609C16.0112 6.48872 15.9515 4.95234 15.0255 4.03074C14.4509 3.4587 13.6631 3.22845 12.9131 3.34343C13.0245 2.59286 12.7906 1.80617 12.2798 1.29771C11.3219 0.344329 9.81723 0.323512 8.89417 1.25089C8.56546 1.58111 8.13443 2.10039 8.0028 2.90125C7.87117 2.10039 7.44014 1.58111 7.11143 1.25089C6.18837 0.323512 4.68366 0.344329 3.72582 1.29771C3.21498 1.80617 2.98106 2.59286 3.09255 3.34343C2.34251 3.22845 1.55474 3.4587 0.980051 4.03074C0.0541408 4.95234 -0.00559109 6.48872 0.917473 7.41609Z" fill="#80824A" /></svg></div>
                    <div class="clover-right-svg"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.917473 7.41609C1.20871 7.70869 1.64795 8.08229 2.30086 8.2578C1.64795 8.43332 1.20871 8.8069 0.917473 9.0995C-0.00559109 10.0269 0.0541408 11.5632 0.980051 12.4849C1.55474 13.0569 2.34251 13.2871 3.09255 13.1722C2.98106 13.9227 3.21498 14.7094 3.72582 15.2179C4.68366 16.1713 6.18837 16.1921 7.11143 15.2647C7.44014 14.9345 7.87117 14.4152 8.0028 13.6143C8.13443 14.4152 8.56546 14.9345 8.89417 15.2647C9.81723 16.1921 11.3219 16.1713 12.2798 15.2179C12.7906 14.7094 13.0245 13.9227 12.9131 13.1722C13.6631 13.2871 14.4509 13.0569 15.0255 12.4849C15.9515 11.5632 16.0112 10.0269 15.0881 9.0995C14.7969 8.8069 14.3576 8.43332 13.7047 8.2578C14.3576 8.08229 14.7969 7.70869 15.0881 7.41609C16.0112 6.48872 15.9515 4.95234 15.0255 4.03074C14.4509 3.4587 13.6631 3.22845 12.9131 3.34343C13.0245 2.59286 12.7906 1.80617 12.2798 1.29771C11.3219 0.344329 9.81723 0.323512 8.89417 1.25089C8.56546 1.58111 8.13443 2.10039 8.0028 2.90125C7.87117 2.10039 7.44014 1.58111 7.11143 1.25089C6.18837 0.323512 4.68366 0.344329 3.72582 1.29771C3.21498 1.80617 2.98106 2.59286 3.09255 3.34343C2.34251 3.22845 1.55474 3.4587 0.980051 4.03074C0.0541408 4.95234 -0.00559109 6.48872 0.917473 7.41609Z" fill="#80824A" /></svg></div>
                </section>
            </div>
        </div>`;
}
const AlertBox = async (name, message) => {
  return `<div class="box alert-box">
            <div class="alert-box-main">
                <div class="alert-content-box">
                    <div class="wing-left-svg"><svg width="31" height="38" viewBox="0 0 31 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.81402 23.7166C-5.0858 11.3967 3.80614 0.183945 3.6318 1.03043C3.45747 1.87692 11.6798 15.4637 20.7666 16.7225C25.0215 18.6275 27.5448 22.3052 27.8743 22.5249C28.2038 22.7445 26.2111 24.2822 26.0844 28.9236C25.9576 33.5651 30.1179 37.7442 30.1179 37.7442C30.1179 37.7442 27.2772 37.4869 26.178 37.354C9.94123 38.2792 7.72759 34.0471 7.81402 23.7166Z" fill="#80824A" /></svg></div>
                    <div class="alert-tail-svg"><svg width="38.6" height="45" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.4907 3.72128H32.4907L32.4907 6.72128L32.4907 13.975L32.4907 29.971L32.4907 37.0955L32.4907 40.0955H29.4907C28.9066 40.0955 25.7645 40.0599 22.6493 39.9906C21.0894 39.9559 19.5159 39.9123 18.2606 39.8596C17.6353 39.8333 17.0684 39.804 16.6132 39.7708C16.2853 39.7469 15.6868 39.7032 15.2295 39.581C13.9488 39.2386 12.7278 38.7222 11.6521 38.0279C10.5786 37.3349 9.62633 36.4485 8.93327 35.3684C8.23236 34.2762 7.81868 33.0153 7.81868 31.6732C7.81868 30.9792 7.92929 30.3069 8.13303 29.6685C6.98512 28.8248 5.99301 27.8168 5.24681 26.654C4.34537 25.2492 3.82848 23.6534 3.82848 21.973C3.82848 20.2927 4.34535 18.6969 5.2468 17.2921C6.00041 16.1177 7.00482 15.1013 8.16721 14.2526C7.94169 13.5832 7.81868 12.8755 7.81868 12.1436C7.81868 10.8015 8.23236 9.54063 8.93327 8.44837C9.62633 7.36834 10.5786 6.48187 11.6521 5.78894C12.7278 5.09458 13.9488 4.57825 15.2295 4.23584C15.6868 4.11357 16.2853 4.06989 16.6132 4.046C17.0684 4.01282 17.6353 3.98348 18.2606 3.95722C19.5159 3.90452 21.0894 3.86093 22.6493 3.82621C25.7645 3.75689 28.9066 3.72128 29.4907 3.72128Z" fill="white" stroke="#B9BE5F" stroke-width="6" />
                        <path d="M33.2172 5.22127H34.7172L34.7172 6.72127L34.7172 13.975L34.7172 29.971L34.7172 37.0955L34.7172 38.5955H33.2172C32.6528 38.5955 28.6065 38.5603 24.5775 38.4911C22.5621 38.4565 20.5426 38.4133 18.9601 38.3614C18.17 38.3355 17.4796 38.3072 16.9496 38.2762C16.6855 38.2607 16.4504 38.244 16.2575 38.2254C16.1021 38.2105 15.8654 38.1855 15.6649 38.1319C14.515 37.8244 13.4415 37.3665 12.5136 36.7676C11.5868 36.1694 10.8013 35.4273 10.2437 34.5583C9.68216 33.6833 9.36668 32.7003 9.36668 31.6732C9.36668 30.7709 9.61015 29.9026 10.05 29.1117C9.92903 29.039 9.80969 28.9646 9.69209 28.8887C8.39479 28.0513 7.31532 27.0253 6.55718 25.8438C5.79511 24.6563 5.37643 23.3384 5.37643 21.973C5.37643 20.6077 5.79512 19.2898 6.55718 18.1022C7.31532 16.9208 8.39479 15.8947 9.69209 15.0573C9.82742 14.97 9.96505 14.8847 10.1049 14.8016C9.63043 13.985 9.36668 13.0827 9.36668 12.1436C9.36668 11.1165 9.68216 10.1335 10.2437 9.25847C10.8013 8.38952 11.5868 7.64741 12.5136 7.04918L13.3233 8.30359L12.5136 7.04918C13.4415 6.45025 14.515 5.99238 15.6649 5.68493C15.8654 5.63133 16.1021 5.6063 16.2575 5.59137C16.4504 5.57283 16.6855 5.55608 16.9496 5.54062C17.4796 5.50959 18.17 5.48126 18.9601 5.45538C20.5426 5.40352 22.5621 5.36029 24.5775 5.32568C28.6065 5.2565 32.6528 5.22127 33.2172 5.22127Z" fill="white" stroke="white" stroke-width="3" />
                        <path d="M35.4939 6.2213H35.9939L35.9939 6.7213L35.9939 13.9751L35.9939 21.9731L35.9939 29.971L35.9939 37.0955L35.9939 37.5955H35.4939C34.9386 37.5955 30.318 37.5605 25.71 37.4914C23.4058 37.4569 21.1021 37.4138 19.3099 37.3622C18.4141 37.3364 17.6433 37.3085 17.063 37.2783C16.7731 37.2632 16.5272 37.2474 16.3354 37.2306C16.1591 37.2153 15.9878 37.1962 15.875 37.166C14.8122 36.8819 13.837 36.463 13.0077 35.9277C12.1788 35.3926 11.5044 34.7467 11.0371 34.0185C10.5685 33.2882 10.3185 32.4905 10.3185 31.6734C10.3185 30.8563 10.5685 30.0586 11.0371 29.3283C11.1613 29.1348 11.3001 28.9471 11.4525 28.7658C11.0088 28.546 10.5856 28.3066 10.1862 28.0488C8.98671 27.2745 8.01844 26.3447 7.3506 25.304C6.68146 24.2612 6.32823 23.1286 6.32823 21.9733C6.32823 20.8179 6.68146 19.6853 7.3506 18.6425C8.01844 17.6018 8.98671 16.672 10.1862 15.8977C10.609 15.6248 11.0583 15.3726 11.5305 15.1424C11.3472 14.9331 11.1822 14.715 11.0371 14.4889C10.5685 13.7587 10.3185 12.9609 10.3185 12.1438C10.3185 11.3268 10.5685 10.529 11.0371 9.79877C11.5044 9.07054 12.1788 8.42467 13.0077 7.88959C13.837 7.35427 14.8122 6.93538 15.875 6.65123C15.9878 6.62105 16.1591 6.60198 16.3354 6.5866C16.5272 6.56988 16.7731 6.55405 17.063 6.53895C17.6433 6.50873 18.4141 6.48076 19.3099 6.45498C21.1021 6.40339 23.4057 6.36025 25.71 6.32565C30.318 6.25646 34.9386 6.2213 35.4939 6.2213Z" fill="white" stroke="#80824A" />
                        <path d="M37.9281 6.61928C36.8249 6.61928 17.0234 6.86177 16.0042 7.13427C14.985 7.40677 14.059 7.80618 13.2789 8.30969C12.4989 8.8132 11.8801 9.41095 11.4579 10.0688C11.0358 10.7267 10.8185 11.4318 10.8185 12.1439C10.8185 12.8559 11.0358 13.561 11.4579 14.2189C11.7038 14.602 12.0163 14.9647 12.3885 15.3003C11.6951 15.596 11.0479 15.9367 10.4574 16.3178C9.30682 17.0605 8.39414 17.9422 7.77145 18.9126C7.14877 19.8829 6.82827 20.923 6.82827 21.9733C6.82827 23.0236 7.14876 24.0636 7.77145 25.034C8.39414 26.0043 9.30682 26.886 10.4574 27.6287C11.0206 27.9923 11.6355 28.3191 12.2928 28.6051C11.9625 28.9158 11.6824 29.2486 11.4579 29.5984C11.0358 30.2563 10.8185 30.9614 10.8185 31.6734C10.8185 32.3855 11.0358 33.0906 11.4579 33.7485C11.8801 34.4063 12.4989 35.0041 13.2789 35.5076C14.059 36.0111 14.985 36.4105 16.0042 36.683C17.0234 36.9555 36.8249 37.1193 37.9281 37.1193L37.9281 29.869L37.9281 21.871L37.9281 13.873L37.9281 6.61928Z" fill="white" />
                    </svg></div>
                    <div class="alert-content">
                        <div class="alert-title">
                        <div class="alert-username">${name}</div>
                        <div class="alert-message">${message}</div>
                    </div>
                </div>
                <div class="alert-head-svg"><svg width="38.6" height="45" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.44264 3.72128H5.44264L5.44264 6.72128L5.44263 13.975L5.44264 29.971L5.44263 37.0955L5.44263 40.0955H8.44263C9.0267 40.0955 12.1689 40.0599 15.284 39.9906C16.8439 39.9559 18.4174 39.9123 19.6727 39.8596C20.298 39.8333 20.8649 39.804 21.3202 39.7708C21.648 39.7469 22.2466 39.7032 22.7039 39.581C23.9845 39.2386 25.2055 38.7222 26.2812 38.0279C27.3547 37.3349 28.307 36.4485 29.0001 35.3684C29.701 34.2762 30.1147 33.0153 30.1147 31.6732C30.1147 30.9792 30.0041 30.3069 29.8003 29.6685C30.9482 28.8248 31.9403 27.8168 32.6865 26.654C33.588 25.2492 34.1049 23.6534 34.1049 21.973C34.1049 20.2927 33.588 18.6969 32.6866 17.2921C31.9329 16.1177 30.9285 15.1013 29.7661 14.2526C29.9917 13.5832 30.1147 12.8755 30.1147 12.1436C30.1147 10.8015 29.701 9.54063 29.0001 8.44837C28.307 7.36834 27.3547 6.48187 26.2812 5.78894C25.2055 5.09458 23.9845 4.57825 22.7039 4.23584C22.2465 4.11357 21.648 4.06989 21.3202 4.046C20.8649 4.01282 20.298 3.98348 19.6727 3.95722C18.4174 3.90452 16.8439 3.86093 15.284 3.82621C12.1689 3.75689 9.0267 3.72128 8.44264 3.72128Z" fill="white" stroke="#B9BE5F" stroke-width="6" />
                    <path d="M4.7162 5.22127H3.2162L3.2162 6.72127L3.21619 13.975L3.2162 29.971L3.21619 37.0955L3.21619 38.5955H4.71619C5.28052 38.5955 9.32687 38.5603 13.3558 38.4911C15.3712 38.4565 17.3907 38.4133 18.9733 38.3614C19.7633 38.3355 20.4537 38.3072 20.9837 38.2762C21.2478 38.2607 21.483 38.244 21.6759 38.2254C21.8313 38.2105 22.068 38.1855 22.2684 38.1319C23.4183 37.8244 24.4919 37.3665 25.4197 36.7676C26.3465 36.1694 27.132 35.4273 27.6897 34.5583C28.2512 33.6833 28.5667 32.7003 28.5667 31.6732C28.5667 30.7709 28.3232 29.9026 27.8833 29.1117C28.0043 29.039 28.1237 28.9646 28.2413 28.8887C29.5386 28.0513 30.618 27.0253 31.3762 25.8438C32.1382 24.6563 32.5569 23.3384 32.5569 21.973C32.5569 20.6077 32.1382 19.2898 31.3762 18.1022C30.618 16.9208 29.5386 15.8947 28.2413 15.0573C28.1059 14.97 27.9683 14.8847 27.8285 14.8016C28.3029 13.985 28.5667 13.0827 28.5667 12.1436C28.5667 11.1165 28.2512 10.1335 27.6897 9.25847C27.1321 8.38952 26.3465 7.64741 25.4197 7.04918C24.4919 6.45025 23.4183 5.99238 22.2684 5.68493C22.068 5.63133 21.8313 5.6063 21.6759 5.59137C21.483 5.57283 21.2478 5.55608 20.9837 5.54062C20.4537 5.50959 19.7633 5.48126 18.9733 5.45538C17.3907 5.40352 15.3712 5.36029 13.3558 5.32568C9.32687 5.2565 5.28052 5.22127 4.7162 5.22127Z" fill="white" stroke="white" stroke-width="3" />
                    <path d="M2.43948 6.2213H1.93948L1.93948 6.7213L1.93947 13.9751L1.93947 21.9731L1.93948 29.971L1.93948 37.0955L1.93948 37.5955H2.43948C2.99479 37.5955 7.61534 37.5605 12.2233 37.4914C14.5276 37.4569 16.8313 37.4138 18.6235 37.3622C19.5192 37.3364 20.29 37.3085 20.8704 37.2783C21.1602 37.2632 21.4061 37.2474 21.5979 37.2306C21.7743 37.2153 21.9455 37.1962 22.0584 37.166C23.1211 36.8819 24.0963 36.463 24.9256 35.9277C25.7546 35.3926 26.4289 34.7467 26.8963 34.0185C27.3649 33.2882 27.6149 32.4905 27.6149 31.6734C27.6149 30.8563 27.3649 30.0586 26.8963 29.3283C26.772 29.1348 26.6332 28.9471 26.4809 28.7658C26.9246 28.546 27.3477 28.3066 27.7472 28.0488C28.9466 27.2745 29.9149 26.3447 30.5827 25.304C31.2519 24.2612 31.6051 23.1286 31.6051 21.9733C31.6051 20.8179 31.2519 19.6853 30.5827 18.6425C29.9149 17.6018 28.9466 16.672 27.7472 15.8977C27.3244 15.6248 26.875 15.3726 26.4028 15.1424C26.5861 14.9331 26.7512 14.715 26.8963 14.4889C27.3649 13.7587 27.6149 12.9609 27.6149 12.1438C27.6149 11.3268 27.3649 10.529 26.8963 9.79877C26.4289 9.07054 25.7546 8.42467 24.9256 7.88959C24.0963 7.35427 23.1211 6.93538 22.0584 6.65123C21.9455 6.62105 21.7743 6.60198 21.5979 6.5866C21.4061 6.56988 21.1602 6.55405 20.8704 6.53895C20.29 6.50873 19.5192 6.48076 18.6235 6.45498C16.8313 6.40339 14.5276 6.36025 12.2233 6.32565C7.61536 6.25646 2.9948 6.2213 2.43948 6.2213Z" fill="white" stroke="#80824A" />
                    <path d="M0.00525761 6.61928C1.10841 6.61928 20.91 6.86177 21.9292 7.13427C22.9484 7.40677 23.8744 7.80618 24.6544 8.30969C25.4345 8.8132 26.0532 9.41095 26.4754 10.0688C26.8976 10.7267 27.1148 11.4318 27.1148 12.1439C27.1148 12.8559 26.8976 13.561 26.4754 14.2189C26.2296 14.602 25.9171 14.9647 25.5449 15.3003C26.2383 15.596 26.8855 15.9367 27.476 16.3178C28.6265 17.0605 29.5392 17.9422 30.1619 18.9126C30.7846 19.8829 31.1051 20.923 31.1051 21.9733C31.1051 23.0236 30.7846 24.0636 30.1619 25.034C29.5392 26.0043 28.6265 26.886 27.476 27.6287C26.9127 27.9923 26.2978 28.3191 25.6405 28.6051C25.9709 28.9158 26.2509 29.2486 26.4754 29.5984C26.8976 30.2563 27.1148 30.9614 27.1148 31.6734C27.1148 32.3855 26.8976 33.0906 26.4754 33.7485C26.0532 34.4063 25.4345 35.0041 24.6544 35.5076C23.8744 36.0111 22.9484 36.4105 21.9292 36.683C20.91 36.9555 1.10841 37.1193 0.00525688 37.1193L0.00525761 29.869L0.00525332 21.871L0.00524902 13.873L0.00525761 6.61928Z" fill="white" />
                </svg></div>
                <div class="wing-right-svg"><svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.4428 23.7166C35.3426 11.3967 26.4507 0.183945 26.625 1.03043C26.7994 1.87692 18.5771 15.4637 9.49025 16.7225C5.23537 18.6275 2.71205 22.3052 2.38256 22.5249C2.05307 22.7445 4.0457 24.2822 4.17245 28.9236C4.2992 33.5651 0.138888 37.7442 0.138888 37.7442C0.138888 37.7442 2.97963 37.4869 4.07885 37.354C20.3156 38.2792 22.5292 34.0471 22.4428 23.7166Z" fill="#80824A" /></svg></div>
            </div>
                <div class="ribbon-alert-svg"><svg width="74" height="26" viewBox="0 0 84 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M37.7048 10.5819C37.6754 8.23069 36.0118 6.21768 33.7082 5.746L6.37429 0.149057C3.76889 -0.384431 1.16809 1.21172 0.715536 3.8324C-0.352439 10.0169 -0.0652865 15.3354 1.11052 21.7361C1.59226 24.3586 4.13312 26.0444 6.76078 25.5917L33.6214 20.965C36.0433 20.5479 37.803 18.4325 37.7723 15.9751L37.7603 15.0179L20.2357 15.5227C18.7578 15.5653 17.5241 14.404 17.4771 12.9262C17.427 11.347 18.7457 10.0667 20.3227 10.1635L37.7129 11.2301L37.7048 10.5819Z" fill="#D15346" />
                    <path d="M37.7129 11.2301L20.3227 10.1635C18.7457 10.0667 17.427 11.347 17.4771 12.9262C17.5241 14.404 18.7578 15.5653 20.2357 15.5227L37.7603 15.0179L37.7129 11.2301Z" fill="#EAD7BC" />
                    <path d="M45.4229 10.5818C45.4523 8.23066 47.116 6.21765 49.4195 5.74597L76.7535 0.149025C79.3589 -0.384462 81.9597 1.21169 82.4122 3.83236C83.4802 10.0168 83.193 15.3353 82.0172 21.7361C81.5355 24.3586 78.9946 26.0443 76.367 25.5917L49.5064 20.965C47.0844 20.5478 45.3248 18.4325 45.3555 15.9751L45.3675 15.0179L62.892 15.5227C64.3699 15.5653 65.6037 14.404 65.6506 12.9262C65.7007 11.347 64.3821 10.0667 62.805 10.1634L45.4148 11.2301L45.4229 10.5818Z" fill="#D15346" />
                    <path d="M45.4148 11.2301L62.805 10.1634C64.3821 10.0667 65.7007 11.347 65.6506 12.9262C65.6037 14.404 64.3699 15.5653 62.892 15.5227L45.3675 15.0179L45.4148 11.2301Z" fill="#EAD7BC" />
                    <path d="M31.1453 11.6243C31.5516 12.0325 32.1644 12.5537 33.0752 12.7986C32.1644 13.0435 31.5516 13.5646 31.1453 13.9728C29.8575 15.2666 29.9409 17.41 31.2326 18.6957C32.0343 19.4937 33.1333 19.8149 34.1797 19.6545C34.0242 20.7017 34.3505 21.7992 35.0632 22.5085C36.3994 23.8385 38.4986 23.8676 39.7864 22.5738C40.245 22.1131 40.8463 21.3887 41.0299 20.2714C41.2136 21.3887 41.8149 22.1131 42.2735 22.5738C43.5612 23.8676 45.6604 23.8385 46.9967 22.5085C47.7093 21.7992 48.0357 20.7017 47.8801 19.6545C48.9265 19.8149 50.0255 19.4937 50.8273 18.6957C52.119 17.41 52.2023 15.2666 50.9146 13.9728C50.5083 13.5646 49.8955 13.0435 48.9846 12.7986C49.8955 12.5537 50.5083 12.0325 50.9146 11.6243C52.2023 10.3306 52.119 8.1872 50.8273 6.90149C50.0255 6.10345 48.9265 5.78224 47.8801 5.94264C48.0357 4.89553 47.7093 3.79803 46.9967 3.08869C45.6604 1.75864 43.5612 1.7296 42.2735 3.02336C41.8149 3.48406 41.2136 4.2085 41.0299 5.32576C40.8463 4.2085 40.245 3.48406 39.7864 3.02336C38.4986 1.7296 36.3994 1.75864 35.0632 3.08869C34.3505 3.79803 34.0242 4.89553 34.1797 5.94264C33.1333 5.78224 32.0343 6.10345 31.2326 6.90149C29.9409 8.1872 29.8575 10.3306 31.1453 11.6243Z" fill="#B08252" />
                </svg></div>
            </div>
        </div>`;
}
let pronounsCache = {};
const Pronouns = async (user) => {
  if (pronounsCache[user.login]) return pronounsCache[user.login];
  let res = ({
    "aeaer": "ae/aer",
    "eem": "e/em",
    "faefaer": "fae/faer",
    "hehim": "he/him",
    "heshe": "he/she",
    "hethem": "he/they",
    "itits": "it/its",
    "perper": "per/per",
    "sheher": "she/her",
    "shethem": "she/they",
    "theythem": "they/them",
    "vever": "ve/ver",
    "xexem": "xe/xem",
    "ziehir": "zie/hir",
  })[(await (await fetch(`https://pronouns.alejo.io/api/users/${user.login}`)).json())[0]?.pronoun_id] ?? "";
  pronounsCache[user.login] = res; return res;
}
const Badges = (event) => {
  if (fieldData.selectedBadge === "twitch") {
    if (!event.badge) return "";
    event.badge = event.badge.slice(0, event.badge.indexOf("/"));
    if (event.badge === "subscriber") return badgesIcon.subTwitch();
    return `<img style="margin-top: 2px; height: 15px; width: 15px; margin-right: -13px" src="${event.badge}" />`;
  }
  return (badgesIcon[(event.badge ?? "viewer").toLowerCase()] ?? badgesIcon.viewer)();
}
function attachEmotes(message, makeBig) {
  let html = message.unescape ? message.text : html_encode(message.text);
  return html.replace(/([^\s]*)/gi, x => {
    const emotes = message.emotes.filter((emote) => html_encode(emote.name) === x);
    if (typeof emotes[0] !== "undefined") return `<img class="${(makeBig ? "emote-normal-size" : "emote-normal-size")}" src="${makeBig ? emotes[0].url.big_animated : emotes[0].url.small_animated}" onerror="this.src='${makeBig ? emotes[0].url.big_static : emotes[0].url.small_static}'"/>`;
    else return fieldData.allCaps ? x.toUpperCase() : x;
  });
}
function isEmote(message) {
    let text = message.text.replace(/\s\s+/g, " ");
    const names = message.emotes.map(x => x.name);
    return !text.split(" ").some(word => !names.includes(word));
}
function html_encode(string) { return string.replace(/[<>"^]/g, c => `&#${c.charCodeAt(0)};`); }
function prepend(from, html) {
  let dummy = insertElement("span", from, "dummy");
  setFirstSibling(dummy);
  dummy.outerHTML = html;
}
/*
! TEST MESSAGES
let streamerMessageCont = 0
const streamerMessage = () => {
    window.dispatchEvent(
      new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message',
          event: {
            data: {
              time: 1705283410317,
              tags: {
                'badge-info': '',
                badges: '',
                'client-nonce': '5798ffbb21ef2878e3f22d2c83e853fe',
                color: '#8A2BE2',
                'display-name': 'WasabiStudio_',
                emotes: '160400:33-38',
                'first-msg': '0',
                flags: '',
                id: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
                mod: '0',
                'returning-chatter': '0',
                'room-id': '1010591897',
                subscriber: '0',
                'tmi-sent-ts': '1705283410367',
                turbo: '0',
                'user-id': '654745478',
                'user-type': '',
              },
              nick: 'wasabistudio_',
              userId: '654745478',
              displayName: 'wasabistudio_',
              displayColor: '#8A2BE2',
              badges: [
                {
                  type: 'broadcaster',
                  version: '1',
                  url: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1',
                  description: 'Broadcaster',
                },
              ],
              channel: 'wasabistudio_',
              text: ['Hellooo! This a streamer message KonCha', 'TehePelo'][
                streamerMessageCont
              ],
              isAction: false,
              emotes: [
                [
                  {
                    type: 'twitch',
                    name: 'KonCha',
                    id: '160400',
                    gif: false,
                    animated: false,
                    urls: {
                      1: 'https://static-cdn.jtvnw.net/emoticons/v2/160400/static/dark/1.0',
                      2: 'https://static-cdn.jtvnw.net/emoticons/v2/160400/static/dark/2.0',
                      4: 'https://static-cdn.jtvnw.net/emoticons/v2/160400/static/dark/3.0',
                    },
                    start: 33,
                    end: 39,
                  },
                ],
                [
                  {
                    type: 'twitch',
                    name: 'TehePelo',
                    id: '160404',
                    gif: false,
                    animated: false,
                    urls: {
                      1: 'https://static-cdn.jtvnw.net/emoticons/v2/160404/static/dark/1.0',
                      2: 'https://static-cdn.jtvnw.net/emoticons/v2/160404/static/dark/2.0',
                      4: 'https://static-cdn.jtvnw.net/emoticons/v2/160404/static/dark/3.0',
                    },
                    start: 0,
                    end: 8,
                  },
                ],
              ][streamerMessageCont],
              msgId: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
            },
          },
        },
      })
    )
    streamerMessageCont++
    if (streamerMessageCont == 2) {
      streamerMessageCont = 0
    }
  },
  subMessage = () => {
    window.dispatchEvent(
      new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message',
          event: {
            data: {
              time: 1705283410317,
              tags: {
                'badge-info': '',
                badges: '',
                'client-nonce': '5798ffbb21ef2878e3f22d2c83e853fe',
                color: '#8A2BE2',
                'display-name': 'WasabiStudio_',
                emotes: '160400:33-38',
                'first-msg': '0',
                flags: '',
                id: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
                mod: '0',
                'returning-chatter': '0',
                'room-id': '1010591897',
                subscriber: '0',
                'tmi-sent-ts': '1705283410367',
                turbo: '0',
                'user-id': '654745478',
                'user-type': '',
              },
              nick: 'wasabistudio_',
              userId: '654745478',
              displayName: 'MagicDeveloper_',
              displayColor: '#8A2BE2',
              badges: [
                {
                  type: 'subscriber',
                  version: '1',
                  url: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1',
                  description: 'sub',
                },
              ],
              channel: 'wasabistudio_',
              text: 'This is a sub message!',
              isAction: false,
              emotes: [],
              msgId: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
            },
          },
        },
      })
    )
  },
  modMessage = () => {
    window.dispatchEvent(
      new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message',
          event: {
            data: {
              time: 1705283410317,
              tags: {
                'badge-info': '',
                badges: '',
                'client-nonce': '5798ffbb21ef2878e3f22d2c83e853fe',
                color: '#8A2BE2',
                'display-name': 'WasabiStudio_',
                emotes: '160400:33-38',
                'first-msg': '0',
                flags: '',
                id: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
                mod: '0',
                'returning-chatter': '0',
                'room-id': '1010591897',
                subscriber: '0',
                'tmi-sent-ts': '1705283410367',
                turbo: '0',
                'user-id': '654745478',
                'user-type': '',
              },
              nick: 'wasabistudio_',
              userId: '654745478',
              displayName: 'FreakyDesigner_',
              displayColor: '#8A2BE2',
              badges: [
                {
                  type: 'moderator',
                  version: '1',
                  url: 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1',
                  description: 'mod',
                },
              ],
              channel: 'wasabistudio_',
              text: 'This is a mod message!',
              isAction: false,
              emotes: [],
              msgId: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
            },
          },
        },
      })
    )
  }
let normalMessageCont = 0
const normalMessage = () => {
    window.dispatchEvent(
      new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message',
          event: {
            data: {
              time: 1705284188196,
              tags: {
                'badge-info': '',
                badges: '',
                'client-nonce': '7e09e73e9ea7d7eb222ba99e6ac7b069',
                color: '#8A2BE2',
                emotes: '',
                'first-msg': '0',
                flags: '',
                id: '40fb15af-350c-4854-b0a2-fbff8bc45d90',
                mod: '0',
                'returning-chatter': '0',
                'room-id': '1010591897',
                subscriber: '0',
                'tmi-sent-ts': '1705284188277',
                turbo: '0',
                'user-id': '654745478',
                'user-type': '',
              },
              userId: '654745478',
              displayName: 'Cool__User',
              displayColor: '#8A2BE2',
              badges: [
                {
                  type: 'viewer',
                  version: '1',
                  url: 'https://assets.help.twitch.tv/article/img/659115-05.png',
                  description: 'viewer',
                },
              ],
              channel: 'wasabistudio_',
              text: 'Hi, this is a viewer message! peepoGiggles',
              isAction: false,
              emotes: [
                {
                  type: 'bttv',
                  name: 'peepoGiggles',
                  id: '5e0bcf69031ec77bab473476',
                  gif: true,
                  animated: true,
                  urls: {
                    1: 'https://cdn.betterttv.net/emote/5e0bcf69031ec77bab473476/1x',
                    2: 'https://cdn.betterttv.net/emote/5e0bcf69031ec77bab473476/2x',
                    4: 'https://cdn.betterttv.net/emote/5e0bcf69031ec77bab473476/3x',
                  },
                  start: 30,
                  end: 42,
                },
              ],
              msgId: '40fb15af-350c-4854-b0a2-fbff8bc45d90',
            },
          },
        },
      })
    )
    normalMessageCont++
    if (normalMessageCont == 2) {
      normalMessageCont = 0
    }
  },
  vipMessage = () => {
    window.dispatchEvent(
      new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message',
          event: {
            data: {
              time: 1705283410317,
              tags: {
                'badge-info': '',
                badges: '',
                'client-nonce': '5798ffbb21ef2878e3f22d2c83e853fe',
                color: '#8A2BE2',
                'display-name': 'WasabiStudio_',
                emotes: '160400:33-38',
                'first-msg': '0',
                flags: '',
                id: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
                mod: '0',
                'returning-chatter': '0',
                'room-id': '1010591897',
                subscriber: '0',
                'tmi-sent-ts': '1705283410367',
                turbo: '0',
                'user-id': '654745478',
                'user-type': '',
              },
              nick: 'wasabistudio_',
              userId: '654745478',
              displayName: 'SpicyUser',
              displayColor: '#8A2BE2',
              badges: [
                {
                  type: 'vip',
                  version: '1',
                  url: 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3',
                  description: 'she/her',
                },
              ],
              channel: 'wasabistudio_',
              text: 'This is a long long long long long long long long long long long long long long long long long long long message!',
              isAction: false,
              emotes: [],
              msgId: 'a771f5c9-e78c-4cc6-9708-bffe64fc8c0b',
            },
          },
        },
      })
    )
  },
  artistMessage = () => {
    window.dispatchEvent(
      new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message',
          event: {
            data: {
              time: 1705283017980,
              tags: {
                'badge-info': '',
                badges: '',
                'client-nonce': 'cfaa4351a1de971616586b2bff648738',
                color: '#8A2BE2',
                emotes: '',
                'first-msg': '0',
                flags: '',
                id: 'd60e1ce7-2880-4622-b854-b5790a2a3119',
                mod: '0',
                'returning-chatter': '0',
                'room-id': '1010591897',
                subscriber: '0',
                'tmi-sent-ts': '1705283018039',
                turbo: '0',
                'user-id': '654745478',
                'user-type': '',
              },
              nick: 'sleepysophie_',
              userId: '654745478',
              displayName: 'CreativeArtist_',
              displayColor: '#8A2BE2',
              badges: [
                {
                  type: 'artist-badge',
                  version: '1',
                  url: 'https://assets.help.twitch.tv/article/img/000002399-05.png',
                  description: 'artist',
                },
              ],
              channel: 'wasabistudio_',
              text: 'This is an artist message!',
              isAction: false,
              emotes: [],
              msgId: 'd60e1ce7-2880-4622-b854-b5790a2a3119',
            },
          },
        },
      })
    )
  },
  testMessage = () => {
    window.dispatchEvent(
      new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message',
          event: {
            data: {
              time: 1705283017980,
              tags: {
                'badge-info': '',
                badges: '',
                'client-nonce': 'cfaa4351a1de971616586b2bff648738',
                color: '#8A2BE2',
                emotes: '',
                'first-msg': '0',
                flags: '',
                id: 'd60e1ce7-2880-4622-b854-b5790a2a3119',
                mod: '0',
                'returning-chatter': '0',
                'room-id': '1010591897',
                subscriber: '0',
                'tmi-sent-ts': '1705283018039',
                turbo: '0',
                'user-id': '654745478',
                'user-type': '',
              },
              nick: 'sleepysophie_',
              userId: '654745478',
              displayName: [
                'WasabiStudio_',
                'FreakyDesigner_',
                'MagicDeveloper_',
                'Cool__User',
                'SpicyUser_',
                'ReallyLongLongUsername_',
              ][Math.floor(Math.random() * 6 + 0)],
              displayColor: '#8A2BE2',
              badges: [
                {
                  type: [
                    'broadcaster',
                    'artist-badge',
                    'vip',
                    'moderator',
                    'subscriber',
                    'follow',
                  ][Math.floor(Math.random() * 6 + 0)],
                  version: '1',
                  url: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1',
                  description: 'artist',
                },
              ],
              channel: 'wasabistudio_',
              text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi debitis magnam quibusdam! Quod odio exercitationem labore unde possimus culpa in molestiae saepe cupiditate, debitis eveniet nam, consectetur iusto perspiciatis quas.'
                .split(' ')
                .slice(0, Math.floor(Math.random() * 18 + 1))
                .join(' '),
              isAction: false,
              emotes: [],
              msgId: 'd60e1ce7-2880-4622-b854-b5790a2a3119',
            },
          },
        },
      })
    )
  }
*/