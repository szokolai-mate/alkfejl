'use strict'

const Schema = use('Schema')

class SolutioncommentsTableSchema extends Schema {

  up () {
    this.create('solutioncomments', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('solutionID').unsigned().references('id').inTable('solution')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.text('content').notNullable()
      table.timestamps(false,true)
    })
  }

  down () {
    this.drop('solutioncomments')
  }

}

module.exports = SolutioncommentsTableSchema
