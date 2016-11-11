'use strict'

const Lucid = use('Lucid')

class Problemcomment extends Lucid {
    problem(){
        return this.belongsTo('App/Model/Problem')
    }

    problemcommentvotes(){
        return this.hasMany('App/Model/Problemcommentvote')
    }

}

module.exports = Problemcomment
