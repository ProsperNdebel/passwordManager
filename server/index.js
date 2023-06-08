const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());
const PORT = 3009;

const db = mysql.createConnection(
  {
    user: "root",
    host: "localhost",
    password: "prosper123",
    database: "PasswordManager",
  },
  (err) => {
    console.log(err);
  }
);

app.post("/addpassword", (req, res) => {
  const { password, title } = req.body;
  const hashedPassword = encrypt(password);
  console.log(hashedPassword);

  db.query(
    "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)",
    [hashedPassword.password, title, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("success");
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/showpasswords", (req, res) => {
  db.query("SELECT * FROM passwords", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptpassword", (req, res) => {
  console.log(req.body);
  res.send(decrypt(req.body));
});

app.listen(PORT, () => {
  console.log("server is running");
});
