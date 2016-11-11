'use strict'

const Lucid = use('Lucid')

class Solutioncomment extends Lucid {
    solutioncommentvotes(){
        return this.hasMany('App/Model/Solutioncommentvote')
    }

    solution(){
        return this.belongsTo('App/Model/Solution')
    }

}

module.exports = Solutioncomment
