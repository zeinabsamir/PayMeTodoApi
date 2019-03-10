const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://zeinabsamir:123@localhost:5432/payme_todo",
  ssl: true
});

router.get("/", (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    [username, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (!results.rows[0]) {
        res.status(401).send("Invalid username or password");
      } else {
        let id = results.rows[0].id;
        let payload = { accountId: results.rows[0].id };
        let token = jwt.sign(payload, "secret");
        res.status(200).json({ token, id });
      }
    }
  );
});

module.exports = router;
