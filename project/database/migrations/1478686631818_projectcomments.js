'use strict'

const Schema = use('Schema')

class ProjectcommentsTableSchema extends Schema {

  up () {
    this.create('projectcomments', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('projectID').unsigned().references('id').inTable('projects')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.text('content').notNullable()
      table.timestamps(false,true)
    })
  }

  down () {
    this.drop('projectcomments')
  }

}

module.exports = ProjectcommentsTableSchema
