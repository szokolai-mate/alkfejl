'use strict'

const Lucid = use('Lucid')

class Problemvote extends Lucid {
    problem(){
        return this.belongsTo('App/Model/Problem')
    }

}

module.exports = Problemvote
