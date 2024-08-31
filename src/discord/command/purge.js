const { generalChannel } = require("../app");

module.exports.execute = async (n) => {
    try {    
        await generalChannel().bulkDelete(n);
        return [0, n];
    } catch (e) {
        return [-1, e];
    }
}