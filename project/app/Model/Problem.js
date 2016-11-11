'use strict'

const Lucid = use('Lucid')

class Problem extends Lucid {
    solutions (){
        return this.hasMany('App/Model/Solution')
    }
    problemcomments(){
        return this.hasMany('App/Model/Problemcomment')
    }
    problemvotes(){
        return this.hasMany('App/Model/Problemvote')
    }

    project(){
        return this.belongsTo('App/Model/Project')
    }

}

module.exports = Problem
