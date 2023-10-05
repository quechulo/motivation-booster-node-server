const db = require("./db-utils.js");
const { createEmail } = require("./generateEmails.js");
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require('cors');
const cronGenerator = require('node-cron');
const cronSender = require("node-cron");
const { transporter } = require("./mailWorker.js");
const PORT = 8080;

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get("/", (req, res) => {
    res.status(200).send({
        data: "Welcome to motivation booster API!"
    })
});

app.post("/addUser", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    await db.insertUser(name, email);
    res.status(200).send({
        data: "User added!"
    })
});

app.post("/addEmail", async (req, res) => {
    const date = Date.now();
    const email = req.body.email;
    await db.insertEmail(email, date);
    res.status(200).send({
        data: "Email added!"
    })
});

app.get("/getEmails", async (req, res) => {
    const emails = await db.getEmails();
    res.status(200).send({
        data: emails
    })
});

app.get("/generateEmail", async (req, res) => {
    const email = await createEmail("Michał");
    res.status(200).send({
        data: email
    })
});

cronSender.schedule("*/5 * * * *", async () => {
    console.log("This function will send an email every 1 minute");
  const email = await db.getLatestEmail();
  console.log(email.email);

  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: "nacako7550@gronasu.com",
    subject: "Sending Email using Node.js",
    text: email.email.content,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

cronGenerator.schedule('*/3 * * * *', async () => {
    console.log('This function will generate an email every 1 minute');

    const email = await createEmail("Michał");

});
