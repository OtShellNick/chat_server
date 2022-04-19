/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.alterTable('rooms', tableBuilder => {
        tableBuilder.integer("owner").defaultTo(8).notNullable();
        tableBuilder.foreign('owner').references("users.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.alterTable('rooms', tableBuilder => {
        tableBuilder.dropColumn('owner');
    })
};
