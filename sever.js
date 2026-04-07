const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
    res.send("Facebook API Running");
});

app.get("/screenshot/:uid/*", async (req, res) => {

    const uid = req.params.uid;
    const cookies = decodeURIComponent(req.params[0]);

    try {

        const response = await axios({
            method: "GET",
            url: `https://www.facebook.com/${uid}`,
            headers: {

                "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",

                "Accept":
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

                "Accept-Language": "en-US,en;q=0.9",

                "Cookie": cookies

            }
        });

        res.send(response.data);

    } catch (err) {

        res.json({
            error: true,
            message: err.message
        });

    }

});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
