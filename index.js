const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const app = express();

const USER_AGENT =
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

app.get("/", (req, res) => {
res.send("Facebook Screenshot API");
});

app.get("/screenshot/:uid", async (req, res) => {

const uid = req.params.uid;
const cookie = req.query.cookie;

if (!cookie) {
return res.json({
error: true,
message: "Missing cookie"
});
}

try {

const browser = await puppeteer.launch({
args: [
"--no-sandbox",
"--disable-setuid-sandbox"
]
});

const page = await browser.newPage();

await page.setUserAgent(USER_AGENT);

await page.setViewport({
width: 1519,
height: 900,
deviceScaleFactor: 1,
isMobile: false
});

await page.setExtraHTTPHeaders({
cookie: cookie
});

await page.goto(`https://www.facebook.com/${uid}`, {
waitUntil: "networkidle2",
timeout: 60000
});

await new Promise(r => setTimeout(r, 4000));

const image = await page.screenshot({
type: "png"
});

await browser.close();

res.set("Content-Type", "image/png");
res.send(image);

} catch (e) {

res.json({
error: true,
message: e.message
});

}

});

app.listen(process.env.PORT || 3000, () =>
console.log("server running")
);
