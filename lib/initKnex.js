import knexConfig from '../knexfile';

export const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);