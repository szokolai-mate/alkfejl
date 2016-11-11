'use strict'

const Lucid = use('Lucid')

class Solutioncommentvote extends Lucid {
    solutioncomment(){
        return this.belongsTo('App/Model/Solutioncomment')
    }
}

module.exports = Solutioncommentvote
