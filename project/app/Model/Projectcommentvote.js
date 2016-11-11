'use strict'

const Lucid = use('Lucid')

class Projectcommentvote extends Lucid {
    projectcomment(){
        return this.belongsTo('App/Model/Projectcomment')
    }

}

module.exports = Projectcommentvote
