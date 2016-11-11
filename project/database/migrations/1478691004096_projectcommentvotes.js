'use strict'

const Schema = use('Schema')

class ProjectcommentvotesTableSchema extends Schema {

  up () {
    this.create('projectcommentvotes', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('commentID').unsigned().references('id').inTable('projectcomments')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.timestamps(false,true)
      table.integer('value').notNullable()
      table.unique(['ownerID','commentID'])
    })
  }

  down () {
    this.drop('projectcommentvotes')
  }

}

module.exports = ProjectcommentvotesTableSchema
