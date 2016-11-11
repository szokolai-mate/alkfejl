'use strict'

const Schema = use('Schema')

class SolutioncommentvotesTableSchema extends Schema {

  up () {
    this.create('solutioncommentvotes', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('commentID').unsigned().references('id').inTable('solutioncomments')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.timestamps(false,true)
      table.integer('value').notNullable()
      table.unique(['ownerID','commentID'])
    })
  }

  down () {
    this.drop('solutioncommentvotes')
  }

}

module.exports = SolutioncommentvotesTableSchema
