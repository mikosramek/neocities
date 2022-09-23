const express = require('express');
const cors = require('cors');
const publish = require('../site-publisher')
const { exec } = require("child_process");

const app = express();
app.use(cors());


app.post('/publish', async (req, res) => {
    console.log('publish webhook hit')
    try {
        // await publish()
        exec('make publish', (err, stdout, stderr) => {
            if (err) {
                console.err(err);
                res.send(err);
            } else {
                console.log(stdout, stderr);
                res.sendStatus(201);
            }
        })
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