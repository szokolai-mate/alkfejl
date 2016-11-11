'use strict'

const Lucid = use('Lucid')

class Projectcomment extends Lucid {
    projectcommentvotes(){
        return this.hasMany('App/Model/Projectcommentvote')
    }

    project(){
        return this.belongsTo('App/Model/Project')
    }
}

module.exports = Projectcomment
