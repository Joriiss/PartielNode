const express = require("express");
const fs = require("fs");

const page = fs.readFileSync("index.html");
const app = express();
const port = 3000;

app.get("/upload", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(page, "binary");

  });


  
app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});