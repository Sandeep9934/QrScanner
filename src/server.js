// File: server.js
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "your_mysql_username",
  password: "your_mysql_password",
  database: "your_database_name"
});

// Create table to store scanned QR codes
connection.query(
  `CREATE TABLE IF NOT EXISTS qrcodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255),
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thumbnail VARCHAR(255)
  );`,
  (error) => {
    if (error) {
      throw error;
    }
    console.log("QR codes table created");
  }
);

// Save scanned QR code to the database
app.post("/qrcodes", (req, res) => {
  const { content } = req.body;
  const thumbnail = ""; // You can set this to an appropriate value

  connection.query(
    "INSERT INTO qrcodes (content, thumbnail) VALUES (?, ?)",
    [content, thumbnail],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save QR code" });
      } else {
        res.status(201).json({ id: results.insertId });
      }
    }
  );
});

// Retrieve scanned QR code history
app.get("/qrcodes", (req, res) => {
  connection.query("SELECT * FROM qrcodes", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve QR code history" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Delete a specific QR code entry
app.delete("/qrcodes/:id", (req, res) => {
  const id = req.params.id;

  connection.query("DELETE FROM qrcodes WHERE id = ?", [id], (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete QR code" });
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
