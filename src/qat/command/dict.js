let dict = 0;
module.exports.execute = (_dict) => {
    dict = _dict;
    return [0, dict];
}
module.exports.dict = () => dict;