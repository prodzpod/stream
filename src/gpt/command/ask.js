const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-4o-mini';
module.exports.execute = async (...ask) => {
    let messages = [];
    for (let i = 0; i < ask.length - 1; i++)
        messages.push({"role": (i === 0 ? "system" : (i % 2 === 1 ? "user" : "assistant")), "content": ask[i]});
    messages.push({"role": "user", "content": ask.at(-1)});
    let res = await openai.chat.completions.create({ model: MODEL, messages: messages });
    if (!res?.choices[0]?.message?.content) return [-1, res];
    return [0, res.choices[0].message.content];
}