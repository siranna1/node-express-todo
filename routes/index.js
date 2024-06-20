const express = require('express');
const router = express.Router();
const pg = require('pg');

const connection = new pg.Pool({
  host: 'localhost',
  user: 'root',
  password: 'postgres',
  database: 'todo_app',
  port: 5432,
  });

router.get('/', function (req, res, next) {
  connection.query(
    `select * from tasks;`,
    (error, results) => {
      console.log(error);
      console.log(results);
      res.render('index', {
        title: 'ToDo App',
        todos: results,
      });
    }
  );
});

router.post('/', function (req, res, next) {
  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return
    }
    console.log('success');
  });

  const todo = req.body.add;
  onnection.query(
    `insert into tasks (user_id, content) values (1, '${todo}');`,
    (error, results) => {
      console.log(error);
      res.redirect('/');
    }
  );
  
  
});

module.exports = router;