let channel, ws, config;
window.Twitch.ext.onAuthorized(async auth => {
    channel = auth.channelId;
    config = await (await fetch("https://heat.prod.kr/" + channel + "/config")).json()
    for (const type of config.detections) e(type).checked = true;
    e("sensitivity").value = config.sensitivity;
});

async function submit() {
    config = {
        detections: q("input[type='checkbox']").filter(x => x.checked).map(x => x.id),
        sensitivity: e("sensitivity").value
    };
    await fetch("https://heat.prod.kr/" + channel + "/config?config=" + JSON.stringify(config), {
        method: "POST"
    });
}