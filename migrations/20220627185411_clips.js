/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
      .createTable('clips', function (table) {
          table.string('id', 255).primary();
          table.integer('broadcaster_id').notNullable();
          table.string('broadcaster_name', 255).notNullable();
          table.integer('creator_id').notNullable();
          table.string('creator_name', 255).notNullable();
          table.string('title', 255).notNullable();
          table.integer('view_count').notNullable();
          table.date('twitch_created_at').notNullable();
          table.string('thumbnail_url', 255).notNullable();
          table.float('duration').notNullable();
          table.timestamps(true, true);
      });
  };
  
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = function(knex) {
    return knex.schema
        .dropTable("clips");
  };
