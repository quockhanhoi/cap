const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req,res)=>{
res.send("CAP FB API");
});

app.get("/screenshot/:uid/:cookie", async (req,res)=>{

const {uid,cookie} = req.params;

try{

const fb = await axios.get(`https://facebook.com/${uid}`,{
headers:{
"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/97 Safari/537.36",
"cookie":cookie
}
});

const html = encodeURIComponent(fb.data);

const link = `https://api.screenshotmachine.com/?key=644a81&url=data:text/html,${html}&dimension=1920x3000&device=desktop`;

res.redirect(link);

}catch(e){
res.json({
error:true,
message:e.message
});
}

});

app.listen(process.env.PORT || 3000);
