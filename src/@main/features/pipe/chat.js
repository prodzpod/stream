const { log, warn, error, getSocketsServer, incrementData, writeData, data, streamInfo } = require("../../include");
const { WASD, String } = require("../../util_client");
const TODO_TESTSTREAM_ICONS = ["WINNT/explorer.exe_14_107", "WINNT/explorer.exe_14_111-0", "WINNT/explorer.exe_14_205-2", "WINNT/explorer.exe_14_205-0", "WINNT/explorer.exe_14_110-0", "WINNT/regedit.exe_14_101-0", "WINNT/winhlp32.exe_14_4001-0", "WINNT/winrep.exe_14_110-0", "WINNT/inf/unregmp2.exe_14_400", "WINNT/msagent/agentsvr.exe_14_113-1", "WINNT/system32/access.cpl_14_110-3", "WINNT/system32/access.cpl_14_218-0", "WINNT/system32/access.cpl_14_219-0", "WINNT/system32/access.cpl_14_224-0", "WINNT/system32/access.cpl_14_229-0", "WINNT/system32/access.cpl_14_227-0", "WINNT/system32/access.cpl_14_228-0", "WINNT/system32/access.cpl_14_230-0", "WINNT/system32/acctres.dll_14_102", "WINNT/system32/acctres.dll_14_100-0", "WINNT/system32/accwiz.exe_14_246", "WINNT/system32/appmgr.dll_14_218-1", "WINNT/system32/admparse.dll_14_USER-0", "WINNT/system32/appwiz.cpl_14_1500-0", "WINNT/system32/appwiz.cpl_14_1504-3", "WINNT/system32/capesnpn.dll_14_204-0", "WINNT/system32/cdfview.dll_14_8192-4", "WINNT/system32/cdfview.dll_14_8197-1", "WINNT/system32/cdplayer.exe_14_117", "WINNT/system32/certmgr.dll_14_218-0", "WINNT/system32/certmgr.dll_14_277-0", "WINNT/system32/charmap.exe_14_111-0", "WINNT/system32/ciadmin.dll_14_403-1", "WINNT/system32/comctl32.dll_14_20481-0", "WINNT/system32/commdlg.dll_14_528-1", "WINNT/system32/compstui.dll_14_64008-0", "WINNT/system32/compstui.dll_14_64010-0", "WINNT/system32/compstui.dll_14_64009-0", "WINNT/system32/compstui.dll_14_64013-0", "WINNT/system32/compstui.dll_14_64014-0", "WINNT/system32/compstui.dll_14_64016-0", "WINNT/system32/compstui.dll_14_64040-0", "WINNT/system32/compstui.dll_14_64066-0", "WINNT/system32/compstui.dll_14_64065", "WINNT/system32/compstui.dll_14_64067", "WINNT/system32/comuid.dll_14_332-3", "WINNT/system32/cryptui.dll_14_3425-1", "WINNT/system32/cscdll.dll_14_133-0", "WINNT/system32/cscdll.dll_14_131", "WINNT/system32/cscui.dll_14_1347-0", "WINNT/system32/deskadp.dll_14_100", "WINNT/system32/desk.cpl_14_40-3", "WINNT/system32/dfrgres.dll_14_106", "WINNT/system32/dmdskres.dll_14_369-1", "WINNT/system32/dsuiext.dll_14_4116-1", "WINNT/system32/eudcedit.exe_14_2-0", "WINNT/system32/filemgmt.dll_14_237-3", "WINNT/system32/fontext.dll_14_4-0", "WINNT/system32/fontext.dll_14_7-0", "WINNT/system32/freecell.exe_14_601-1", "WINNT/system32/hdwwiz.cpl_14_100-0", "WINNT/system32/grpconv.exe_14_100-1", "WINNT/system32/grpconv.exe_14_101", "WINNT/system32/hticons.dll_14_116", "WINNT/system32/hticons.dll_14_114", "WINNT/system32/hticons.dll_14_112", "WINNT/system32/hticons.dll_14_111", "WINNT/system32/hticons.dll_14_107", "WINNT/system32/hticons.dll_14_106", "WINNT/system32/ieakui.dll_14_801-0", "WINNT/system32/inetcpl.cpl_14_1313-0", "WINNT/system32/main.cpl_14_400-3", "WINNT/system32/mmsys.cpl_14_4379", "WINNT/system32/mmsys.cpl_14_4380-0", "WINNT/system32/mnmsrvc.exe_14_100-2", "WINNT/system32/mobsync.exe_14_132-0", "WINNT/system32/moricons.dll_14_21-0", "WINNT/system32/moricons.dll_14_65-1", "WINNT/system32/msdtcprx.dll_14_150-3", "WINNT/system32/mshtml.dll_14_2661-1", "WINNT/system32/mspaint.exe_14_116", "WINNT/system32/msports.dll_14_2-1", "WINNT/system32/msrating.dll_14_105", "WINNT/system32/netshell.dll_14_171", "WINNT/system32/notepad.exe_14_2-0", "WINNT/system32/pifmgr.dll_14_20", "WINNT/system32/progman.exe_14_117-1", "WINNT/system32/sp3res.dll_14_1505-4", "WINNT/system32/sticpl.cpl_14_110-3"];
const messages = [];
module.exports.condition = 'chat'
module.exports.execute = async args => {
    let [_, user, message, color, ids] = args;
    if (user === '[SYSTEM]') return 0;
    messages.push(ids);
    let firstMessage = "";
    if (!user.startsWith("#")) {
        incrementData(`user.${user}.point`, message.length / 10);
        if ((data().user[user].last_chatted ?? 0) < streamInfo().start) firstMessage = "first";
        writeData(`user.${user}.last_chatted`, new Date().getTime());
    }
    getSocketsServer('model')?.send(WASD.pack('twitch', '0', 'chat', 
        `lib/icons_win2k_sp4_en/${TODO_TESTSTREAM_ICONS[Math.abs(String.hashCode(user) % TODO_TESTSTREAM_ICONS.length)]}`,
        color.slice(1), user, message, firstMessage));
    if (message.includes("Joel")) incrementData('global.joel', message.match(/Joel/g).length);
    if (message.includes("+2")) incrementData('global.plus2', message.match(/\+2/g).length);
    if (message.includes("-2")) incrementData('global.minus2', message.match(/\-2/g).length);
    if (message.includes("ICANT")) incrementData('global.ICANT', message.match(/ICANT/g).length);
    return 0;
}
module.exports.fetch = (key, value) => messages.find(x => x[key] == value);