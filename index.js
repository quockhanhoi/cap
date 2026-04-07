import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 3000;

const UA =
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36";

function parseCookie(str = "") {
    return str
        .split(";")
        .map(v => v.trim())
        .filter(Boolean)
        .map(pair => {
            const [name, ...val] = pair.split("=");
            return {
                name,
                value: val.join("="),
                domain: ".facebook.com",
                path: "/"
            };
        });
}

app.get("/", (req, res) => {
    res.json({
        status: "OK",
        service: "CAP API",
        route: "/screenshot"
    });
});

app.post("/screenshot", async (req, res) => {
    let browser;

    try {
        const { uid, cookie } = req.body;

        if (!uid || !cookie) {
            return res.status(400).json({
                error: "missing uid or cookie"
            });
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

        await page.setUserAgent(UA);

        // set cookie Facebook
        const cookies = parseCookie(cookie);
        if (cookies.length) {
            await page.setCookie(...cookies);
        }

        const url = `https://m.facebook.com/${uid}`;

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        // wait load UI
        await page.waitForTimeout(4000);

        // scroll load thêm content
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await page.waitForTimeout(1500);

        const img = await page.screenshot({
            fullPage: true
        });

        await browser.close();

        res.setHeader("Content-Type", "image/png");
        return res.send(img);

    } catch (err) {
        console.error("CAP ERROR:", err);

        if (browser) await browser.close();

        return res.status(500).json({
            error: err.message
        });
    }
});

// safety close
process.on("unhandledRejection", err => {
    console.error("Unhandled:", err);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
});
