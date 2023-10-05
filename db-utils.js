const { MongoClient, ServerApiVersion } = require('mongodb');
const env = require('dotenv').config();

const user = process.env.USER;
const password = process.env.PASSWORD;

async function connectDatabase() {
    return await MongoClient.connect(
      `mongodb+srv://${user}:${password}@cluster0.qmg88hz.mongodb.net/?retryWrites=true&w=majority`
    );
}

async function insertUser(name, email) {
    const client = await connectDatabase();
    const users = client.db("newsletter").collection("users");
    await users.insertOne({ name: name, email: email });
}

async function getEmails() {
    const client = await connectDatabase();
    const emails = await client.db("newsletter").collection("emails").find().toArray();
    return emails;
}

async function getLatestEmail() {
    const client = await connectDatabase();
    const email = await client.db("newsletter").collection("emails").findOne({}, {sort: {date: -1 }}, function(err, result) {
        if (err) throw err;
        console.log(result);
        client.close();
    });
    return email;
}

async function insertEmail(email, date) {
    const client = await connectDatabase();
    const emails = client.db("newsletter").collection("emails");
    await emails.insertOne({ email: email, date: date });
}


module.exports = { insertUser, insertEmail, getEmails, getLatestEmail };
