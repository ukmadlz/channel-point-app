// Update with your config settings.
const DotEnv = require('dotenv');

DotEnv.config({
    path: './.env.local'
});

const connection = {
  client: 'postgresql',
  connection: process.env.POSTGRES_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: connection,

  staging: connection,

  production: connection

};
