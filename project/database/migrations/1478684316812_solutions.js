'use strict'

const Schema = use('Schema')

class SolutionsTableSchema extends Schema {

  up () {
    this.create('solutions', (table) => {
      table.increments('id').unsigned().primary()
      table.integer('problemID').unsigned().references('id').inTable('problems')
      table.integer('ownerID').unsigned().references('id').inTable('users')
      table.text('description').notNullable()
      table.bool('active').notNullable()
      table.bool('accepted').notNullable()
      table.timestamps(false,true)
    })
  }

  down () {
    this.drop('solutions')
  }

}

module.exports = SolutionsTableSchema
