const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const User = require("../models/user");

 router.get('/', async function (req, res, next) {
  
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    const userId = req.user.id;
    const user = await User.findById(userId);
    var taiou = {};
    knex("users")
      .distinct('id')
      .select("*")
      .then(async function (results){
        
        for(let r of results)
        {
         
          taiou[r.id] = r.name;
          
        }
      })

    knex("tasks")
      .select("*")
      //.where({user_id: userId})
      .then(async function (results) {
        res.render('index', {
          title: 'ToDo App',
          todos: results,
          isAuth: isAuth,
          n: req.user.name, 
          taiou: taiou,
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          title: 'ToDo App',
          isAuth: isAuth,
          errorMessage: [err.sqlMessage],
        });
      });
  } else {
    res.render('index', {
      title: 'ToDo App',
      isAuth: isAuth,
    });
  }
});

router.post('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const todo = req.body.add;
  knex("tasks")
    .insert({user_id: userId, content: todo})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;