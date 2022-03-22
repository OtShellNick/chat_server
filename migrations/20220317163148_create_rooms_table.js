/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.createTable('rooms', table => {
      table.increments('id');
      table.integer("userId").notNullable();//TODO массив юзеров
      table.foreign("userId").references("users.id");
      table.string('name', 255).notNullable().unique();
      table.string('description', 255);
      table.specificType('tags', 'text[]');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('rooms');
};
