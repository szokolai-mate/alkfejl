'use strict'

const Database = use('Database')

const Project = use('App/Model/Project')
const Projectcomment = use('App/Model/Projectcomment')
const Projectcommentvote = use('App/Model/Projectcommentvote')
const Problem = use('App/Model/Problem')
const Problemcomment = use('App/Model/Problemcomment')
const Problemcommentvote = use('App/Model/Problemcommentvote')
const Problemvote = use('App/Model/Problemvote')
const Solution = use('App/Model/Solution')
const User = use('App/Model/User')
const Trusted = use('App/Model/Trusteduser')
const Solutionvote = use('App/Model/Solutionvote')



class PublicController {

    * index (request,response) {

        const projects = yield Project.query().where('active',1).fetch()

        if(!projects.isEmpty()){
        var c = projects.size()
        for(var i=0;i<c;i+=1){
            (projects.value())[i].attributes.description=((projects.value())[i].attributes.description.split("\n"))
            const owner = yield User.find((projects.value())[i].attributes.ownerID)
            if(owner){
                (projects.value())[i].attributes.owner=owner
            }
        }
        }

        yield response.sendView('main',
        {
            projects : projects.toJSON()
        }
        );
    }

    * search(request,response){
        const searchterm = request.input('searchterm').toLowerCase()

        console.log(searchterm)


        const projects = yield Project.all();

        var filtered = projects.filter( i => i.title.toLowerCase().indexOf(searchterm) > -1 );

        if(!filtered.isEmpty()){
        var c = filtered.size()
        for(var i=0;i<c;i+=1){
            (filtered.value())[i].attributes.description=((filtered.value())[i].attributes.description.split("\n"))
            const owner = yield User.find((filtered.value())[i].attributes.ownerID)
            if(owner){
                (filtered.value())[i].attributes.owner=owner
            }
        }
        }
        

         yield response.sendView('main',
        {
            projects : filtered.toJSON()
        }
        );
    }

    * redirect (request,response){
        yield response.redirect('/')
    }

    * showProject (request,response) {

        const id = request.param('projectID')
        if(!id){
            response.redirect('/')
            return
        }

        const project = yield Project.find(id)

        if(!project || !id){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        (project).attributes.description=((project).attributes.description.split("\n"))


        const problems = yield Problem.query().where('projectID',project.id).fetch()
        
        if(!problems){
            problems = []
        }
        if(!problems.isEmpty()){
        var c = problems.size()
        for(var i=0;i<c;i+=1){
            (problems.value())[i].attributes.description=((problems.value())[i].attributes.description.split("\n"))
            const owner = yield User.find((problems.value())[i].attributes.ownerID)
            if(owner){
                (problems.value())[i].attributes.owner=owner
            }
            const votes = yield Problemvote.query().where('problemID',(problems.value())[i].attributes.id).fetch()
            if(!votes){
            votes = []
             }
            var sum=0;
            if(!votes.isEmpty()){
                var vc = votes.size()
                for(var j=0;j<vc;j+=1){
                    sum+=(votes.value())[j].attributes.value;
                    if(request.currentUser){
                        if(request.currentUser.id==(votes.value())[j].attributes.ownerID){
                            (problems.value())[i].attributes.voted=1
                        }
                    }
                }
            }
            (problems.value())[i].attributes.score=sum;

            const acceptedproblemsolutions = yield Solution.query().where('problemID',(problems.value())[i].attributes.id).where('accepted',1).fetch()
            if(!acceptedproblemsolutions){
            acceptedproblemsolutions = []
             }
             (problems.value())[i].attributes.solutions=acceptedproblemsolutions.size()

        }
        }
/*TODO jól választja ki  az sql csak valami itt nem jó*/

        const comments = yield Projectcomment.query().where('projectID',project.id).fetch()

         if(!comments){
            comments = []
        }
        if(!comments.isEmpty()){
        var c = comments.size()
        for(var i=0;i<c;i+=1){
            (comments.value())[i].attributes.content=((comments.value())[i].attributes.content.split("\n"))
            const owner = yield User.find((comments.value())[i].attributes.ownerID)
            if(owner){
                (comments.value())[i].attributes.owner=owner
            }

            
            const votes = yield Projectcommentvote.query().where('commentID',(comments.value())[i].attributes.id).fetch()
            if(!votes){
            votes = []
             }
            var sum=0;
            if(!votes.isEmpty()){
                var vc = votes.size()
                for(var j=0;j<vc;j+=1){
                    sum+=(votes.value())[j].attributes.value;
                    if(request.currentUser){
                        if(request.currentUser.id==(votes.value())[j].attributes.ownerID){
                            (comments.value())[i].attributes.voted=(votes.value())[j].attributes.value;
                        }
                    }
                }
            }
            (comments.value())[i].attributes.score=sum;

        }
        }


        const trustedusers = yield Trusted.query().where('projectID',id).fetch()
        if(!trustedusers){
            trustedusers = []
        }

        if(!trustedusers.isEmpty()){
        var c = trustedusers.size()
        for(var i=0;i<c;i+=1){
            const user = yield User.find((trustedusers.value())[i].attributes.userID)
            if(user){
                (trustedusers.value())[i].attributes.user=user
            }
        }
        }

        yield response.sendView('project',
        {
            project : project.toJSON(),
            problems : problems.toJSON()
            ,projectcomments : comments.toJSON()
            ,trustedusers : trustedusers.toJSON()
        })
    }

    * profile(request,response){
        const id = request.param('userID')
        if(!id){
            response.redirect('/')
            return
        }

        const user = yield User.find(id)

        if (!user){
            response.redirect('/')
            return
        }

        const projects = yield Project.query().where('ownerID',id).fetch()

        if(!projects){
            projects = []
        }

        if(!projects.isEmpty()){
        var c = projects.size()
        for(var i=0;i<c;i+=1){
            (projects.value())[i].attributes.description=((projects.value())[i].attributes.description.split("\n"))
        }
        }

        const problems = yield Problem.query().where('ownerID',id).fetch()

        if(!problems){
            problems = []
        }

        if(!problems.isEmpty()){
        var c = problems.size()
        for(var i=0;i<c;i+=1){
            (problems.value())[i].attributes.description=((problems.value())[i].attributes.description.split("\n"))
            const votes = yield Problemvote.query().where('problemID', (problems.value())[i].attributes.id).fetch()
            if(!votes){
                votes=[]
            }
            var sum=0;
            if(!votes.isEmpty()){
            var cv = votes.size()
            for(var j=0;j<cv;j+=1){
                sum+=(votes.value())[i].attributes.value;
            }
            }
            (problems.value())[i].attributes.score=sum;
            const acceptedproblemsolutions = yield Solution.query().where('problemID',(problems.value())[i].attributes.id).where('accepted',1).fetch()
            if(!acceptedproblemsolutions){
            acceptedproblemsolutions = []
             }
             (problems.value())[i].attributes.solutions=acceptedproblemsolutions.size()
        }
        }

        const solutions = yield Solution.query().where('ownerID',id).fetch()

        if(!solutions){
            solutions = []
        }

        if(!solutions.isEmpty()){
        var c = solutions.size()
        for(var i=0;i<c;i+=1){
            (solutions.value())[i].attributes.description=((solutions.value())[i].attributes.description.split("\n"))
            const problem = yield Problem.find( (solutions.value())[i].attributes.problemID )
            if(problem){
                (solutions.value())[i].attributes.projectID=problem.attributes.projectID
            }
            else{
                (solutions.value())[i].attributes.projectID=0;
            }
            const votes = yield Solutionvote.query().where('solutionID', (solutions.value())[i].attributes.id).fetch()
            var sum=0;
            if(!votes.isEmpty()){
            var cv = votes.size()
            for(var j=0;j<cv;j+=1){
                sum+=(votes.value())[i].attributes.value;
            }
            }
            (solutions.value())[i].attributes.score=sum;
        }
        }



        yield response.sendView('profile',
        {
            displayName : user.displayName,
            memberSince : user.created_at,
            projects : projects.toJSON()
            ,problems : problems.toJSON()
            ,solutions : solutions.toJSON()
        })

  }

  * showProblem(request,response){
      
        const projectid = request.param('projectID')
        if(!projectid){
            response.redirect('/')
            return
        }

        const project = yield Project.find(projectid)

        if(!project || !projectid){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }
        project.attributes.description=project.attributes.description.split("\n");

        const problemid = request.param('problemID')
        if(!problemid){
            response.redirect('/')
            return
        }

        const problem = yield Problem.find(problemid)

        if(!problem || !problemid){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }
         problem.attributes.description=problem.attributes.description.split("\n");


/*TODO jól választja ki  az sql csak valami itt nem jó*/

        const comments = yield Problemcomment.query().where('problemID',problem.id).fetch()

         if(!comments){
            comments = []
        }
        var c = comments.size()
        for(var i=0;i<c;i+=1){
            (comments.value())[i].attributes.content=(comments.value())[i].attributes.content.split("\n")
            const owner = yield User.find((comments.value())[i].attributes.ownerID)
            if(owner){
                (comments.value())[i].attributes.owner=owner
            }
        }

        const solutions = yield Solution.query().where('problemID',problem.id).fetch()
        if(!solutions){
            solutions = []
        }

        var c = solutions.size()
        for(var i=0;i<c;i+=1){
            (solutions.value())[i].attributes.description=(solutions.value())[i].attributes.description.split("\n")
            const owner = yield User.find((solutions.value())[i].attributes.ownerID)
            if(owner){
                (solutions.value())[i].attributes.owner=owner
            }
        }


        yield response.sendView('problem',
        {
            project : project.toJSON(),
            problem : problem.toJSON()
            ,problemcomments : comments.toJSON()
            ,solutions : solutions.toJSON()
        })
    }

}

module.exports = PublicController
