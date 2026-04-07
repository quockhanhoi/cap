const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', (req, res) => {
    res.send('API Facebook View');
});

app.get('/screenshot/:uid/:cookies', async (req, res) => {

    const { uid, cookies } = req.params;

    try {

        const response = await axios({
            method: 'GET',
            url: `https://www.facebook.com/${uid}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-CH-UA': '"Google Chrome";v="120", "Chromium";v="120"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Windows"',
                'Upgrade-Insecure-Requests': '1',
                'Viewport-Width': '1920',
                'Cookie': cookies
            }
        });

        res.send(response.data);

    } catch (err) {

        res.send({
            error: true,
            message: err.message
        });

    }

});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
