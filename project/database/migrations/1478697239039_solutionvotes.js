'use strict'

const Schema = use('Schema')

class SolutionvotesTableSchema extends Schema {

  up () {
    this.create('solutionvotes', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('solutionID').unsigned().references('id').inTable('solutions')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.timestamps(false,true)
      table.integer('value').notNullable()
      table.unique(['ownerID','solutionID'])
    })
  }

  down () {
    this.drop('solutionvotes')
  }

}

module.exports = SolutionvotesTableSchema
