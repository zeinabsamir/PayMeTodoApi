const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://zeinabsamir:123@localhost:5432/payme_todo",
  ssl: true
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getUsers
};
