const express = require("express");
const axios = require("axios");

const app = express();

// COOKIE FACEBOOK ĐỂ SẴN
const FB_COOKIE = "datr=Gg7OaeZwd0EH-qtxfiBOaa7D;sb=Gw7Oaal7gX7UKZjpIWhZKGMk;dpr=3.2983407974243164;wd=891x1760;c_user=61575447401693;xs=11%3A6VLl5InHUtZi0Q%3A2%3A1775479486%3A-1%3A-1%3A%3AAcwPtuiFlOPzVKZZD0j7Sm9zh8vN8eOjZ74a2Sesww;fr=1X1BbjApzdn09rOm8.AWdbkFd9KZbFQ6Z6ZxY9Rf6OSs6rmrbLMEjBe1hHqGXdCBMqHUw.Bp06q_..AAA.0.0.Bp06rG.AWfnlBmynN6EpE0HerMh__sRKSA;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1775479507021%2C%22v%22%3A1%7D;";

app.get("/", (req, res) => {
  res.send("CAP FB API RUNNING");
});

app.get("/screenshot/:uid", async (req, res) => {

  const { uid } = req.params;

  try {

    const fb = await axios.get(`https://facebook.com/${uid}`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/97 Safari/537.36",
        "cookie": FB_COOKIE
      }
    });

    const html = encodeURIComponent(fb.data);

    const link = `https://api.screenshotmachine.com/?key=644a81&url=data:text/html,${html}&dimension=1920x3000&device=desktop&format=png`;

    res.redirect(link);

  } catch (e) {
    res.json({
      error: true,
      message: e.message
    });
  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
