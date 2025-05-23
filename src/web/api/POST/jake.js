const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    if (!body.data.amount) return [200, {res: "no"}];
    send("tiltify", body.data.donor_name, body.data.amount.value, body.data.amount.currency, body.data.donor_comment);
    return [200, {res: 'hello tiltify'}];
}