import express from "express"
import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

puppeteer.use(StealthPlugin())

const app = express()
const PORT = process.env.PORT || 3000

const FB_COOKIE = `datr=Gg7OaeZwd0EH-qtxfiBOaa7D;sb=Gw7Oaal7gX7UKZjpIWhZKGMk;dpr=3.2983407974243164;wd=891x1760;c_user=61575447401693;xs=11%3A6VLl5InHUtZi0Q%3A2%3A1775479486%3A-1%3A-1%3A%3AAcwPtuiFlOPzVKZZD0j7Sm9zh8vN8eOjZ74a2Sesww;fr=1X1BbjApzdn09rOm8.AWdbkFd9KZbFQ6Z6ZxY9Rf6OSs6rmrbLMEjBe1hHqGXdCBMqHUw.Bp06q_..AAA.0.0.Bp06rG.AWfnlBmynN6EpE0HerMh__sRKSA;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1775479507021%2C%22v%22%3A1%7D;`

const USER_AGENT =
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

app.get("/screenshot/:id", async (req, res) => {

const id = req.params.id

try {

const browser = await puppeteer.launch({
args: ["--no-sandbox","--disable-setuid-sandbox"]
})

const page = await browser.newPage()

await page.setUserAgent(USER_AGENT)

await page.setViewport({
width: 1519,
height: 754,
deviceScaleFactor: 1,
isMobile: false
})

await page.setExtraHTTPHeaders({
cookie: FB_COOKIE
})

await page.goto(`https://www.facebook.com/${id}`,{
waitUntil:"networkidle2",
timeout:60000
})

await new Promise(r => setTimeout(r,4000))

const image = await page.screenshot({
type:"png"
})

await browser.close()

res.set("Content-Type","image/png")
res.send(image)

} catch(e){

res.json({
error:true,
message:e.message
})

}

})

app.listen(PORT,()=>{
console.log("Server running "+PORT)
})
