'use strict'

const Lucid = use('Lucid')

class Solutionvote extends Lucid {
    solution(){
        return this.belongsTo('App/Model/Solution')
    }

}

module.exports = Solutionvote
