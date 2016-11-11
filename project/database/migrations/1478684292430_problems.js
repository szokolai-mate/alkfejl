'use strict'

const Schema = use('Schema')

class ProblemsTableSchema extends Schema {

  up () {
    this.create('problems', (table) => {
      table.increments('id').primary().unsigned()
      table.integer('projectID').unsigned().references('id').inTable('projects')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.text('description').notNullable()
      table.string('title').notNullable()
      table.bool('active').notNullable()
      table.timestamps(false,true)
    })
  }

  down () {
    this.drop('problems')
  }

}

module.exports = ProblemsTableSchema
