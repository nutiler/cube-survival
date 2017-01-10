'use strict';

/* eslint-disable max-len */


exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('users' ,function (table) {
      table.increments();
      table.boolean('admin').defaultTo(false);
      table.string('username').unique();
      table.string('email').unique();
      table.string('hashed_password');
      table.timestamps(true, true);
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
/*
┌──────────────────────────────────────────────────────────────────┐
│                              users                               │
├────────────────┬─────────────────────────┬───────────────────────┤
│id              │serial                   │primary key            │
│username        │varchar(255)             │not null default ''    │
|hashed_password |char(60)                 │not null               │
│created_at      │timestamp with time zone │not null default now() │
│updated_at      │timestamp with time zone │not null default now() │
└────────────────┴─────────────────────────┴───────────────────────┘
*/