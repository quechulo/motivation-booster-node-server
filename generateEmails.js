const { OpenAI } = require('openai');
const db = require("./db-utils.js");


// Setup OpenAI API key
const configuration = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI(configuration);

const generatePersonalisedEmail = async (name) => {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'user',
                content: `Generate a motivation email for ${name}`,
            },
        ],
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message;
};

const createEmail = async (name) => {
    const email = await generatePersonalisedEmail(name);
    try {
        if (email.content.length < 10) {
            throw new Error("Email is too short!");
        } else {
            await db.insertEmail(email, new Date());
        }
    } catch (error) {
        console.log(error);
    }
    return email.content;
};


module.exports = { createEmail }
