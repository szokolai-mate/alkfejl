'use strict'

const Schema = use('Schema')

class ProblemvotesTableSchema extends Schema {

  up () {
    this.create('problemvotes', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('problemID').unsigned().references('id').inTable('problems')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.timestamps(false,true)
      table.integer('value').notNullable()
      table.unique(['ownerID','problemID'])
    })
  }

  down () {
    this.drop('problemvotes')
  }

}

module.exports = ProblemvotesTableSchema
