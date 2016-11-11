'use strict'

const Lucid = use('Lucid')

class Problemcommentvote extends Lucid {
    problemcomment(){
        return this.belongsTo('App/Model/Problemcomment')
    }
}

module.exports = Problemcommentvote
