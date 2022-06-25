const express = require("express");
const app = express();
// This is your test secret API key.
app.use(express.static("public"));
app.use(express.json());


app.post("/", async (req, res) => {
  res.sendFile(__dirname+'/public/index.html')
});

app.listen(4242, () => console.log("Node server listening on  http://localhost:4242/ "));
