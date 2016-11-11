'use strict'

const Database = use('Database')

const Problem = use('App/Model/Problem')
const Problemcomment = use('App/Model/Problemcomment')
const Problemcommentvote = use('App/Model/Problemcommentvote')
const Problemvote = use('App/Model/Problemvote')
const Project = use('App/Model/Project')
const Projectcomment = use('App/Model/Projectcomment')
const Projectcommentvote = use('App/Model/Projectcommentvote')
const Solution = use('App/Model/Solution')
const Solutioncomment = use('App/Model/Solutioncomment')
const Solutioncommentvote = use('App/Model/Solutioncommentvote')
const Solutionvote = use('App/Model/Solutionvote')
const Trusteduser = use('App/Model/Trusteduser')

class PostController {
    * index (request,response) {

        const projects = yield Project.all()

        yield response.sendView('main',
        {
            name : request.name,
            projects : projects.toJSON()
        }
        );
    }

    * register (request,response){
        yield response.sendView('register',
            {

            }
        )
    }

    * doRegister (request,response){
        yield response.sendView('main',
            {
                
            }
        )
    }
}

module.exports = PostController
