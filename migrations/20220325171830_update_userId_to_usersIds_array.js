/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.alterTable('rooms', tableBuilder => {
      tableBuilder.dropColumn('userId')
      tableBuilder.specificType('usersIds', 'integer[]').notNullable().defaultTo('{}');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.alterTable('rooms', tableBuilder => {
        tableBuilder.dropColumn('usersIds');
        tableBuilder.integer("userId").notNullable();
    })
};
