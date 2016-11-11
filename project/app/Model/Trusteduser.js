'use strict'

const Lucid = use('Lucid')

class Trusteduser extends Lucid {
    project(){
        return this.belongsTo('App/Model/Project')
    }

}

module.exports = Trusteduser
