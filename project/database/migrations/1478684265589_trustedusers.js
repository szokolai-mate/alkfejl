'use strict'

const Schema = use('Schema')

class TrustedusersTableSchema extends Schema {

  up () {
    this.create('trustedusers', (table) => {
      table.increments()
      table.integer('projectID').unsigned().references('id').inTable('projects')
      table.integer('userID').unsigned().references('id').inTable('users')
      table.unique(['projectID','userID'])
      table.timestamps(false,true)
    })
  }

  down () {
    this.drop('trustedusers')
  }

}

module.exports = TrustedusersTableSchema
