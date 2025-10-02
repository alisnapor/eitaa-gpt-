import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

// توکن ایتا
const TOKEN = "bot412387:24689265-315a-4878-84eb-25a08ab06481";
// کلید OpenAI
const OPENAI_KEY = "sk-اینجا_کلیدت_رو_بزار";

const app = express();
app.use(bodyParser.json());

app.post(`/webhook/${TOKEN}`, async (req, res) => {
    const message = req.body.message?.text;
    const chatId = req.body.message?.chat.id;

    if (!message) return res.sendStatus(200);

    const reply = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        })
    }).then(r => r.json());

    const answer = reply.choices?.[0]?.message?.content || "خطا در پاسخ";

    await fetch(`https://eitaayar.ir/${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: answer })
    });

    res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot is running..."));