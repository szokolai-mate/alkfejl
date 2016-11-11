'use strict'

const Lucid = use('Lucid')

class Project extends Lucid {
    trustedusers(){
        return this.hasMany('App/Model/Trusteduser')
    }
    problems(){
        return this.hasMany('App/Model/Problem')
    }
    projectcomments(){
        return this.hasMany('App/Model/Projectcomment')
    }

}

module.exports = Project
