exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('scores').del()
    .then(function() {
      // Inserts seed entries
      // Username
      // Shots
      // Kills
      const players = [{
        username: 'chucknorris',
        shots: 69,
        kills: 9001
      }, {
        username: 'nutiler',
        shots: 1,
        kills: 1
      }, {
        username: 'ayylmao',
        shots: 47777,
        kills: 1340
      }];
      return knex('scores').insert(players);
    });
};
