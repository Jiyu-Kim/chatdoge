const apiKey = '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';
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const serverless = require('serverless-http');
const express = require('express')
const cors = require('cors')


const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

//Read a prompt.txt file
function readFileContent(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const lines = data.split('\n');
        return lines
    } catch (error) {
        return null;
    }
}

//Create a server using the Express.js
const app = express()

//Solve a CORS issue
let corsOptions = {
    origin: 'https://chatdodge.pages.dev/',
    Credentials: true
}
app.use(cors(corsOptions))
app.use(cors());

//Parse a body
app.use(express.json()); //for parsing application
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// GET method route
app.post('/fortuneTell', async function (req, res) {
    //Perform an API call to OpenAI's GPT-3

    let { date, time, userMessages, assistantMessages } = req.body;
    //console.log(date);
    //console.log(time);
    //console.log(userMessages);
    //console.log(assistantMessages);
    let todayDateTime = new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'});
    console.log(todayDateTime);

    lines = readFileContent('./prompt.txt');
    let messages = [
        { role: "system", content: lines[0] },
        { role: "user", content: lines[1] },
        { role: "assistant", content: lines[2] },
        { role: "user", content: `저의 생년월일은 ${date}이고, 저의 태어난 시각은 ${time}입니다. 그리고 오늘은 ${todayDateTime}입니다. ` },
        { role: "assistant", content: `당신의 생년월일은 ${date}이고, 저의 태어난 시각은 ${time}인 것을 확인하였습니다. 그리고 오늘은 ${todayDateTime}인 것을 확인했습니다. 저는 사주팔자를 기반으로 정확하게 당신의 운세를 알 수 있습니다. 어떤 것이든 물어보세요.` }
    ];
    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "' + String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
    }
    //console.log(messages);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        //max_tokens: 256,
        frequency_penalty: 1.5,
        messages: messages,
    });
    let fortune = completion.data.choices[0].message['content']
    //console.log(fortune);
    res.json({ 'assistant': fortune });
});

//app.listen(3000);
module.exports.handler = serverless(app);




