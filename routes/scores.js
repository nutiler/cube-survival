 'use strict';

 /* eslint-disable max-len */
 /* eslint-disable camelcase */
 /* eslint-disable-next-line new-cap */

 const express = require('express');
const knex = require('../db/knex');
 const router = express.Router();
 
 function authorizedAdmin(req, res, next) {
  //
  let userID = req.session.user;
  knex('users').where('id', userID.id).first().then(function (admin) {
    if(admin.admin){
      next();
    } else {
      res.render('admin')
    }
  })
}


 function respondAndRender(id, res, viewName) {
  if (validId(id)) {
   knex('scores')
    .select()
    .where('id', id)
    .first()
    .then(scores => {
     res.render(viewName, scores);
    });
  }
  else {
   res.status(500);
   res.render('error', {
    message: 'Invalid id'
   });
  }
 }

 function validId(id) {
  return !isNaN(id);
 }

 function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
 }

 function validAdd(score) {
  return typeof score.username == 'string' &&
   score.username.trim() != '' &&
   isNumeric(score.kills) &&
   isNumeric(score.shots);
 }

 function validatescoresRenderError(req, res, callback) {
  if (validAdd(req.body)) {
   const player = {
    username: req.body.username,
    shots: req.body.shots,
    kills: req.body.kills
   };

   callback(player);
  }
  else {
   res.status(500);
   res.render('error', {
    message: 'Invalid Player.'
   });
  }
 };

 // Get Post 

 router.get('/', (req, res) => {
  knex('scores')
   .select()
   .then(scores => {
    res.render('all', {
     scores: scores
    });
   });
 });

 router.get('/add', authorizedAdmin, (req, res) => {
  res.render('add');
 });


 router.get('/:id', (req, res) => {
  const id = req.params.id;
  respondAndRender(id, res, 'single');
 });
 router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  respondAndRender(id, res, 'edit');
 });

 router.post('/', (req, res) => {
  console.log('Requesting to add Player.');
  if (validAdd(req.body)) {
   const player = {
    username: req.body.username,
    kills: req.body.kills,
    shots: req.body.shots,
    damage: req.body.damage,
    pixels: req.body.pixels
   };
   knex('scores')
    .insert(player, 'id')
    .then(ids => {
     const id = ids[0];
     res.redirect(`/scores/${id}`);
    });
   console.log('Added Player: ' + req.body.username);
  }
  else {
   console.log('Failed to add Player.');
   res.status(500);
   res.render('error', new Error());
  }
 });

 router.put('/:id', authorizedAdmin, (req, res) => {
  validatescoresRenderError(req, res, (scores) => {
   const id = req.params.id;
   knex('scores')
    .where('id', id)
    .update(scores, 'id')
    .then(() => {
     res.redirect(`/scores/${id}`);
    });
  });
 });

 router.delete('/:id', authorizedAdmin,(req, res) => {
  const id = req.params.id;
  if (validId(id)) {
   knex('scores')
    .where('id', id)
    .del()
    .then(() => {
     res.redirect('/scores');
    });
  }
  else {
   res.status(500);
   res.render('error', {
    message: 'Invalid id'
   });
  }
 });

 module.exports = router;
 