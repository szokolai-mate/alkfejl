'use strict'

const Lucid = use('Lucid')

class Solution extends Lucid {
    solutioncomments(){
        return this.hasMany('App/Model/Solutioncomment')
    }
    solutionvotes(){
        return this.hasMany('App/Model/Solutionvote')
    }

    problem(){
        return this.belongsTo('App/Model/Problem')
    }

}

module.exports = Solution
