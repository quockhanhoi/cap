const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const app = express();

const BROWSER_ARGS = ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--disable-software-rasterizer','--disable-extensions','--no-first-run','--no-zygote'];

function parseCookies(cookieStr) {
    return cookieStr.split(';').map(s => s.trim()).filter(Boolean).map(part => {
        const idx = part.indexOf('=');
        if (idx === -1) return null;
        return { name: part.slice(0,idx).trim(), value: part.slice(idx+1).trim(), domain: '.facebook.com', path: '/', httpOnly: false, secure: true };
    }).filter(Boolean);
}

app.get('/', (req, res) => res.send('Cap service OK'));

app.get('/screenshot/:uid/:cookies', (req, res) => {
    const { uid, cookies } = req.params;
    axios({ method: 'GET', url: `https://facebook.com/${uid}/`, headers: { 'user-agent': 'Mozilla/5.0', 'Cookie': cookies } })
        .then(r => res.send(r.data)).catch(e => res.send(String(e)));
});

app.get('/capture/:uid/:cookies', async (req, res) => {
    const { uid, cookies } = req.params;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, args: BROWSER_ARGS });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.setCookie(...parseCookies(decodeURIComponent(cookies)));
        await page.goto(`https://www.facebook.com/profile.php?id=${uid}`, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        try {
            await page.evaluate(() => {
                for (const sel of ['[aria-label="Đóng"]','[aria-label="Close"]','div[role="dialog"] button']) {
                    const el = document.querySelector(sel); if (el) { el.click(); break; }
                }
                document.querySelectorAll('div[role="banner"] button').forEach(b => {
                    if (b.textContent.trim()==='Đóng'||b.textContent.trim()==='Close') b.click();
                });
            });
            await new Promise(r => setTimeout(r, 800));
        } catch {}
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 500));
        const screenshot = await page.screenshot({ type: 'png', fullPage: false });
        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (err) {
        res.status(500).send('ERROR: ' + err.message);
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Cap service running'));