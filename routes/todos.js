const express = require("express");
const router = express.Router();

const verfiyToken = require("./verfiy").verfiyToken;
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://zeinabsamir:123@localhost:5432/payme_todo",
  ssl: true
});

router.get("/", verfiyToken, (req, res) => {
  const userId = req.accountId;
  pool.query(
    "SELECT * FROM todos WHERE user_id = $1 ",
    [userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      //console.log(results);
      res.status(200).send(results.rows);
    }
  );
});

router.post("/", verfiyToken, (req, res) => {
  const { content } = req.body;
  const userId = req.accountId;
  pool.query(
    "INSERT INTO todos (content, user_id) VALUES ($1, $2) RETURNING *",
    [content, userId],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results.rows);
      res.status(200).json(results.rows[0]);
    }
  );
});

router.get("/delete/:id", verfiyToken, (req, res) => {
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
