/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.alterTable('rooms', tableBuilder => {
        tableBuilder.enum('status', ['open', 'closed']).notNullable().defaultTo('open');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.alterTable('rooms', tableBuilder => {
      tableBuilder.dropColumn('status');
  })
};
