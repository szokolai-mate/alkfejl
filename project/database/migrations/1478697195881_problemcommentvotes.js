'use strict'

const Schema = use('Schema')

class ProblemcommentvotesTableSchema extends Schema {

  up () {
    this.create('problemcommentvotes', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('commentID').unsigned().references('id').inTable('problemcomments')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.timestamps(false,true)
      table.integer('value').notNullable()
      table.unique(['ownerID','commentID'])
    })
  }

  down () {
    this.drop('problemcommentvotes')
  }

}

module.exports = ProblemcommentvotesTableSchema
