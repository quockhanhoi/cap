const express = require('express');
const axios = require('axios');
const { cookie } = require('./cookie');

const app = express();

// test server
app.get('/', (req, res) => {
    res.json({ status: "OK", service: "CAP API" });
});

// screenshot / cap fb
app.get('/screenshot/:uid', (req, res) => {
    const { uid } = req.params;

    const options = {
        method: 'GET',
        url: `https://facebook.com/${uid}/`,
        headers: {
            'authority': 'facebook.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'accept': 'text/html,application/xhtml+xml',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'Cookie': cookie
        }
    };

    axios(options)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.status(500).send({
                error: true,
                message: error.message
            });
        });
});

// chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
