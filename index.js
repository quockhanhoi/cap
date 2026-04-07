const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => {
res.send("facebook view api");
});

app.get("/screenshot/:uid/:cookies", async (req, res) => {

const uid = req.params.uid;
const cookies = decodeURIComponent(req.params.cookies);

try {

const response = await axios.get(`https://www.facebook.com/${uid}`, {
headers: {

"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",

"Accept":
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

"Accept-Language": "en-US,en;q=0.9",

"Cookie": cookies

}
});

res.send(response.data);

} catch (err) {

res.status(500).json({
error: true,
message: err.message
});

}

});

app.listen(process.env.PORT || 3000, () =>
console.log("server running")
);
