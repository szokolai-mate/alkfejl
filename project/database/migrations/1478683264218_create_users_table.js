'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', table => {
      table.increments('id').primary().unsigned()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('displayName',80).notNullable()
      table.timestamps(false,true)

    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
