// Consts
const TABLE_NAME='votes';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable(TABLE_NAME, function (table) {
        table.increments('id').primary();
        table.string('clip_id')
            .notNullable()
            .references("id")
            .inTable("clips");
        table.integer('user_id').notNullable();
        table.enu('vote', ['up', 'down']).defaultTo('up', options={})
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
    return knex.schema
        .dropTable(TABLE_NAME);
  };
