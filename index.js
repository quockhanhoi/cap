import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

const USER_AGENT =
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

app.post("/screenshot", async (req, res) => {
    let browser;

    try {
        const { uid, cookie } = req.body;

        if (!uid || !cookie) {
            return res.status(400).json({ error: "missing uid or cookie" });
        }

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--single-process",
                "--no-zygote"
            ]
        });

        const page = await browser.newPage();

        await page.setUserAgent(USER_AGENT);

        // set cookie safe
        const cookies = cookie.split(";")
            .map(c => c.trim())
            .filter(Boolean)
            .map(c => {
                const parts = c.split("=");
                return {
                    name: parts[0],
                    value: parts.slice(1).join("="),
                    domain: ".facebook.com",
                    path: "/"
                };
            });

        await page.setCookie(...cookies);

        const url = `https://m.facebook.com/${uid}`;

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 60000
        });

        await page.waitForTimeout(3000);

        const img = await page.screenshot({
            fullPage: true
        });

        await browser.close();

        res.setHeader("Content-Type", "image/png");
        return res.send(img);

    } catch (err) {
        console.error("[CAP ERROR]", err.message);

        if (browser) await browser.close();

        return res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("CAP SERVER RUNNING ON", PORT);
});
