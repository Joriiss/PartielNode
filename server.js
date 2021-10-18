const express = require("express")
const fs = require("fs")
const { createConnection } = require("typeorm")
const {getConnection} = require("typeorm")
const fileUpload = require("express-fileupload")

const page = fs.readFileSync("index.html")
const app = express();
const port = 3000;
app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );
const connect = async () => {
    try {
      const connection = await createConnection({
        name: "dbconnection1",
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "nodepartiel",
        entities: [__dirname + "/entity/*{.js,.ts}"],
        synchronize: true
      });
    } catch (e) {
      console.log(e);
    }
};
connect()


app.get("/upload", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(page, "binary");
});
app.post("/upload", async (req, res) => {
    const titre = req.body.titre;
    const description = req.body.description;

    req.files.photo.mv(`./pictures/${req.files.photo.name}`, (err) => {
      if (err) return res.status(500).send(err);
    });
  
    const connectionUpload = getConnection("dbconnection1");
    connectionUpload.query(
      `INSERT INTO souvenir (id, titre, description, nomPhoto) VALUES (NULL, "${titre}", "${description}", "${req.files.photo.name}");`,
      function (error, results, fields) {
        if (error) throw error;
      }
    );
});

  

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});