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

function verfiyToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).send("Unauthorized Request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
      return res.status(401).send("Unauthorized Request");
    }
    jwt.verify(token, "secret", function(err, decoded) {
      if (err) return res.status(401).send("Unauthorized Request");
  
      req.accountId = decoded.accountId;
      next();
    });
  }

router.get("/", (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

router.post("/login", (req, res) => {
  // console.log(req.body);
  const { username, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    [username, password],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results.rows)
      if (!results.rows[0]) {
        res.status(401).send("Invalid username or password");
      } else {
        // console.log(results.rows[0].id);
        let id = results.rows[0].id;
        let payload = { accountId: results.rows[0].id };
        let token = jwt.sign(payload, "secret");
        res.status(200).json({ token, id});
      }
    }
  );
});

router.get("/listTodos", verfiyToken, (req, res) => {

  const userId = req.accountId;
  pool.query(
    "SELECT * FROM todos WHERE user_id = $1 ",
    [userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
      res.status(200).send(results.rows)
    }
  );
});

router.post("/addTodo", verfiyToken, (req, res) => {
  const { content } = req.body;
  const userId = req.accountId;
  pool.query(
    "INSERT INTO todos (content, user_id) VALUES ($1, $2)",
    [content, userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
      // response.status(201).send(`Todo added with ID: ${result.insertId}`)
    }
  );
});
router.get("/deleteTodo/:id", verfiyToken, (req, res) => {
  const todoId = req.params.id;
  const userId = req.accountId;
  pool.query(
    "DELETE FROM todos WHERE  id = $1 AND user_id = $2",
    [todoId, userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
      // response.status(201).send(`Todo deleted with ID: ${result.insertId}`)
    }
  );
});
module.exports = router;
