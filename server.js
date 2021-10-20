const express = require("express")
const fs = require("fs")
const { createConnection } = require("typeorm")
const {getConnection} = require("typeorm")
const fileUpload = require("express-fileupload")
const mustacheExpress = require("mustache-express");
const path = require("path")
const { send } = require('express/lib/response');
const serve   = require('express-static');


const page = fs.readFileSync("views/index.mustache")
const app = express();
const port = 3000;
app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
);
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname)));


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
  const connectionInsert = getConnection("dbconnection1");
  connectionInsert.query(
    `SELECT * from souvenir`,
    function (error, results, fields) {
      if (error) throw error;
      listeSouvenirs = []
      for (let i = 0; i < results.length; i++) {
        listeSouvenirs.push({titre : results[i]["titre"], description : results[i]["description"], nomPhoto : results[i]["nomPhoto"]})
      }
      return res.render("index", {
        souvenirs: listeSouvenirs
      });
    }
  );
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
    const connectionInsert = getConnection("dbconnection1");
    connectionInsert.query(
      `SELECT * from souvenir`,
      function (error, results, fields) {
        if (error) throw error;
        listeSouvenirs = []
        for (let i = 0; i < results.length; i++) {
          listeSouvenirs.push({titre : results[i]["titre"], description : results[i]["description"], nomPhoto : results[i]["nomPhoto"]})
        }
        return res.render("index", {
          souvenirs: listeSouvenirs
        });
      }
    );
});

  

app.listen(port, () => {
    console.log(`Exemple app listening at http://localhost:${port}`);
});