'use strict'

const Schema = use('Schema')

class ProjectsTableSchema extends Schema {

  up () {
    this.create('projects', (table) => {
      table.increments('id').unsigned().primary()
      table.timestamps(false,true)
      table.integer('ownerID').unsigned().references('id').inTable('users').notNullable()
      table.boolean('active').notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
    })
  }

  down () {
    this.drop('projects')
  }

}

module.exports = ProjectsTableSchema
