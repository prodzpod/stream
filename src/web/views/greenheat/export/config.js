let channel, ws, config;
window.Twitch.ext.onAuthorized(async auth => {
    e("submit").addEventListener("pointerup", submit);
    channel = auth.channelId;
    e("channel").value = channel;
    config = await (await fetch("https://heat.prod.kr/" + channel + "/config")).json()
    for (const type of config.detections) e(type).checked = true;
    e("shover").value = config.sensitivity[0]; e("sdrag").value = config.sensitivity[1];
    e("color").value = config.color ?? "red";
});

async function submit() {
    config = {
        detections: q("input[type='checkbox']").filter(x => x.checked).map(x => x.id),
        sensitivity: [e("shover").value, e("sdrag").value],
        color: e("color").value
    };
    await fetch("https://heat.prod.kr/" + channel + "/config?config=" + utow(JSON.stringify(config)), { method: "POST" });
    e("status").innerText = "Config Updated!"
}