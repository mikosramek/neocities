const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require("child_process");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb',
}));


app.post('/publish', async (req, res) => {
    console.log('publish webhook hit')
    try {
        const { secret } = req.body;
        if (secret === process.env.PRISMIC_WEBHOOK_SECRET) {
            res.sendStatus(201);
            exec('make publish', (err, stdout, stderr) => {
                if (err) {
                    console.err(err);
                    // res.send(err);
                } else if (stderr) {
                    console.log(stderr);
                    // res.sendStatus(500);
                } else {
                    console.log(stdout);
                    // res.sendStatus(201);
                }
            })
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        res.send(e)
    }
})

app.use('/', (req, res) => {
    res.send('base!')
})

app.listen(3000, () => {
    console.log('listening on 3000')
})