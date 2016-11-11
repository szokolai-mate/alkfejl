'use strict'

const Schema = use('Schema')

class ProblemcommentsTableSchema extends Schema {

  up () {
    this.create('problemcomments', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('problemID').unsigned().references('id').inTable('problems')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.text('content').notNullable()
      table.timestamps(false,true)
    })
  }

  down () {
    this.drop('problemcomments')
  }

}

module.exports = ProblemcommentsTableSchema
