'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: "localhost",
      user: "postgres",
      password: "gamePassword",
      database: "game",
      port: 800
    }
  },
};
