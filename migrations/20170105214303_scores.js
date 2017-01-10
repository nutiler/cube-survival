'use strict';

/* eslint-disable max-len */

// username
// shots
// kills

exports.up = function(knex) {
  return knex.schema.createTable('scores', (table) => {
    table.increments();
    table.text('username').notNullable();
    table.integer('shots').notNullable().defaultTo(0);
    table.integer('damage').notNullable().defaultTo(0);
    table.integer('pixels').notNullable().defaultTo(0);
    table.integer('kills').notNullable().defaultTo(0);
//    table.integer('user_id').unsigned().references('users.id').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = knex => knex.schema.dropTable('scores');

/*
   Column   |           Type           |                      Modifiers                      
------------+--------------------------+-----------------------------------------------------
 id         | integer                  | not null default nextval('scores_id_seq'::regclass)
 username   | text                     | not null
 shots      | integer                  | not null default 0
 kills      | integer                  | not null default 0
 created_at | timestamp with time zone | not null default now()
 updated_at | timestamp with time zone | not null default now()
*/