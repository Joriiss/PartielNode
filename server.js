const express = require("express");
const fs = require("fs");
const fileUpload = require("express-fileupload");

const page = fs.readFileSync("index.html");
const app = express();
const port = 3000;
app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );



app.get("/upload", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(page, "binary");
});
app.post("/upload", async (req, res) => {
    const titre = req.body.titre;
    const description = req.body.description;

    req.files.photo.mv(`./pictures/${req.files.photo.name}`, (err) => {
      if (err) return res.status(500).send(err);
      res.send("File uploaded");
    });
  
  });

  

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});