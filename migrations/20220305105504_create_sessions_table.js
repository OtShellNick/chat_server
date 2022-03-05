/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function (knex) {
    return knex.schema.createTable("sessions", (table) => {
        table.increments("id");
        table.integer("userId").notNullable();
        table.foreign("userId").references("users.id");
        table.string("sessionId", 255).notNullable().unique();
        table.timestamp('expireAt').notNullable()
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function (knex) {
    return knex.schema.dropTable("sessions");
};
