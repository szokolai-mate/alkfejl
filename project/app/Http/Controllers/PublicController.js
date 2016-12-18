'use strict'

const Database = use('Database')

const Project = use('App/Model/Project')
const Projectcomment = use('App/Model/Projectcomment')
const Projectcommentvote = use('App/Model/Projectcommentvote')
const Problem = use('App/Model/Problem')
const Problemcomment = use('App/Model/Problemcomment')
const Problemcommentvote = use('App/Model/Problemcommentvote')
const Solutioncomment = use('App/Model/Solutioncomment')
const Problemvote = use('App/Model/Problemvote')
const Solution = use('App/Model/Solution')
const User = use('App/Model/User')
const Trusted = use('App/Model/Trusteduser')
const Solutionvote = use('App/Model/Solutionvote')
const Solutioncommentvote = use('App/Model/Solutioncommentvote')



class PublicController {

    * index(request, response) {

        const projects = yield Project.query().where('active', 1).fetch()

        if (!projects.isEmpty()) {
            var c = projects.size()
            for (var i = 0; i < c; i += 1) {
                (projects.value())[i].attributes.description = ((projects.value())[i].attributes.description.split("\n"))
                const owner = yield User.find((projects.value())[i].attributes.ownerID)
                if (owner) {
                    (projects.value())[i].attributes.owner = owner
                }
            }
        }

        yield response.sendView('main',
            {
                projects: projects.toJSON()
            }
        );
    }

    * search(request, response) {
        const searchterm = request.input('searchterm').toLowerCase()

        const projects = yield Project.all();

        var prefiltered = projects.filter(i => i.title.toLowerCase().indexOf(searchterm) > -1);
        var filtered = prefiltered.filter(i => i.active == 1);

        if (!filtered.isEmpty()) {
            var c = filtered.size()
            for (var i = 0; i < c; i += 1) {
                (filtered.value())[i].attributes.description = ((filtered.value())[i].attributes.description.split("\n"))
                const owner = yield User.find((filtered.value())[i].attributes.ownerID)
                if (owner) {
                    (filtered.value())[i].attributes.owner = owner
                }
            }
        }


        yield response.sendView('main',
            {
                projects: filtered.toJSON()
            }
        );
    }

    * redirect(request, response) {
        yield response.redirect('/')
    }

    * showProject(request, response) {

        const id = request.param('projectID')
        if (!id) {
            response.redirect('/')
            return
        }

        const project = yield Project.find(id)

        if (!project || !id) {
            yield request
                .withAll()
                .andWith({ headererrors: [{ message: 'Project not found!' }] })
                .flash()
            response.redirect('back')
            return
        }

        (project).attributes.description = ((project).attributes.description.split("\n"))


        const problems = yield Problem.query().where('projectID', project.id).fetch()

        if (!problems) {
            problems = []
        }
        if (!problems.isEmpty()) {
            var c = problems.size()
            for (var i = 0; i < c; i += 1) {
                (problems.value())[i].attributes.description = ((problems.value())[i].attributes.description.split("\n"))
                const owner = yield User.find((problems.value())[i].attributes.ownerID)
                if (owner) {
                    (problems.value())[i].attributes.owner = owner
                }
                const votes = yield Problemvote.query().where('problemID', (problems.value())[i].attributes.id).fetch()
                if (!votes) {
                    votes = []
                }
                var sum = 0;
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        if (request.currentUser) {
                            if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                                (problems.value())[i].attributes.voted = (votes.value())[j].attributes.value
                            }
                        }
                    }
                }
                (problems.value())[i].attributes.score = sum;


                var acceptedproblemsolutions = yield Solution.query().where('problemID', (problems.value())[i].attributes.id).where('accepted', 1).fetch();
                
                (problems.value())[i].attributes.solved = acceptedproblemsolutions.size()

            }
        }
        /*TODO jól választja ki  az sql csak valami itt nem jó*/

        const comments = yield Projectcomment.query().where('projectID', project.id).fetch()

        if (!comments) {
            comments = []
        }
        if (!comments.isEmpty()) {
            var c = comments.size()
            for (var i = 0; i < c; i += 1) {
                (comments.value())[i].attributes.content = ((comments.value())[i].attributes.content.split("\n"))
                const owner = yield User.find((comments.value())[i].attributes.ownerID)
                if (owner) {
                    (comments.value())[i].attributes.owner = owner
                }


                const votes = yield Projectcommentvote.query().where('commentID', (comments.value())[i].attributes.id).fetch()
                if (!votes) {
                    votes = []
                }
                var sum = 0;
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        if (request.currentUser) {
                            if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                                (comments.value())[i].attributes.voted = (votes.value())[j].attributes.value;
                            }
                        }
                    }
                }
                (comments.value())[i].attributes.score = sum;

            }
        }


        const trustedusers = yield Trusted.query().where('projectID', id).fetch()
        if (!trustedusers) {
            trustedusers = []
        }

        if (!trustedusers.isEmpty()) {
            var c = trustedusers.size()
            for (var i = 0; i < c; i += 1) {
                const user = yield User.find((trustedusers.value())[i].attributes.userID)
                if (user) {
                    (trustedusers.value())[i].attributes.user = user
                }
            }
        }

        yield response.sendView('project',
            {
                project: project.toJSON(),
                problems: problems.toJSON()
                , projectcomments: comments.toJSON()
                , trustedusers: trustedusers.toJSON()
            })
    }

    * profile(request, response) {
        const id = request.param('userID')
        if (!id) {
            response.redirect('/')
            return
        }

        const user = yield User.find(id)

        if (!user) {
            response.redirect('/')
            return
        }

        const projects = yield Project.query().where('ownerID', id).fetch()

        if (!projects) {
            projects = []
        }

        if (!projects.isEmpty()) {
            var c = projects.size()
            for (var i = 0; i < c; i += 1) {
                (projects.value())[i].attributes.description = ((projects.value())[i].attributes.description.split("\n"))
            }
        }

        const problems = yield Problem.query().where('ownerID', id).fetch()

        if (!problems) {
            problems = []
        }

        if (!problems.isEmpty()) {
            var c = problems.size()
            for (var i = 0; i < c; i += 1) {
                (problems.value())[i].attributes.description = ((problems.value())[i].attributes.description.split("\n"))
                const votes = yield Problemvote.query().where('problemID', (problems.value())[i].attributes.id).fetch()
                if (!votes) {
                    votes = []
                }
                var sum = 0;
                if (!votes.isEmpty()) {
                    var cv = votes.size()
                    for (var j = 0; j < cv; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                    }
                }
                (problems.value())[i].attributes.score = sum;
                const acceptedproblemsolutions = yield Solution.query().where('problemID', (problems.value())[i].attributes.id).where('accepted', 1).fetch()
                if (!acceptedproblemsolutions) {
                    acceptedproblemsolutions = []
                }
                (problems.value())[i].attributes.solutions = acceptedproblemsolutions.size()
            }
        }

        const solutions = yield Solution.query().where('ownerID', id).fetch()

        if (!solutions) {
            solutions = []
        }

        if (!solutions.isEmpty()) {
            var c = solutions.size()
            for (var i = 0; i < c; i += 1) {
                (solutions.value())[i].attributes.description = ((solutions.value())[i].attributes.description.split("\n"))
                const problem = yield Problem.find((solutions.value())[i].attributes.problemID)
                if (problem) {
                    (solutions.value())[i].attributes.projectID = problem.attributes.projectID
                }
                else {
                    (solutions.value())[i].attributes.projectID = 0;
                }
                const votes = yield Solutionvote.query().where('solutionID', (solutions.value())[i].attributes.id).fetch()
                var sum = 0;
                if (!votes.isEmpty()) {
                    var cv = votes.size()
                    for (var j = 0; j < cv; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                    }
                }
                (solutions.value())[i].attributes.score = sum;
            }
        }



        yield response.sendView('profile',
            {
                displayName: user.displayName,
                memberSince: user.created_at,
                projects: projects.toJSON()
                , problems: problems.toJSON()
                , solutions: solutions.toJSON()
            })

    }

    * showProblem(request, response) {

        const projectid = request.param('projectID')
        if (!projectid) {
            response.redirect('/')
            return
        }

        const project = yield Project.find(projectid)

        if (!project || !projectid) {
            yield request
                .withAll()
                .andWith({ headererrors: [{ message: 'Project not found!' }] })
                .flash()
            response.redirect('back')
            return
        }
        project.attributes.description = project.attributes.description.split("\n");

        const problemid = request.param('problemID')
        if (!problemid) {
            response.redirect('/')
            return
        }

        const problem = yield Problem.find(problemid)

        if (!problem || !problemid) {
            yield request
                .withAll()
                .andWith({ headererrors: [{ message: 'Problem not found!' }] })
                .flash()
            response.redirect('back')
            return
        }
        problem.attributes.description = problem.attributes.description.split("\n");


        /*TODO jól választja ki  az sql csak valami itt nem jó*/

        const comments = yield Problemcomment.query().where('problemID', problem.id).fetch()

        if (!comments) {
            comments = []
        }
        if (!comments.isEmpty()) {
            var c = comments.size()
            for (var i = 0; i < c; i += 1) {
                (comments.value())[i].attributes.content = ((comments.value())[i].attributes.content.split("\n"))
                const owner = yield User.find((comments.value())[i].attributes.ownerID)
                if (owner) {
                    (comments.value())[i].attributes.owner = owner
                }


                const votes = yield Problemcommentvote.query().where('commentID', (comments.value())[i].attributes.id).fetch()
                if (!votes) {
                    votes = []
                }
                var sum = 0;
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        if (request.currentUser) {
                            if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                                (comments.value())[i].attributes.voted = (votes.value())[j].attributes.value;
                            }
                        }
                    }
                }
                (comments.value())[i].attributes.score = sum;

            }
        }


        const solutions = yield Solution.query().where('problemID', problem.id).fetch()
        if (!solutions) {
            solutions = []
        }

        var c = solutions.size()
        for (var i = 0; i < c; i += 1) {
            (solutions.value())[i].attributes.description = (solutions.value())[i].attributes.description.split("\n")
            const owner = yield User.find((solutions.value())[i].attributes.ownerID)
            if (owner) {
                (solutions.value())[i].attributes.owner = owner
            }
            const solutioncomments = yield Solutioncomment.query().where('solutionID', (solutions.value())[i].attributes.id).fetch()
            if (!solutioncomments) {
                solutioncomments = []
            }

            var csc = solutioncomments.size()
            for (var k = 0; k < csc; k += 1) {
                (solutioncomments.value())[k].attributes.content = (solutioncomments.value())[k].attributes.content.split("\n");
                const owner = yield User.find((solutioncomments.value())[k].attributes.ownerID)
                if (owner) {
                    (solutioncomments.value())[k].attributes.owner = owner

                    const votes = yield Solutioncommentvote.query().where('commentID', (solutioncomments.value())[k].attributes.id).fetch()
                    if (!votes) {
                        votes = []
                    }
                    var sum = 0;
                    if (!votes.isEmpty()) {
                        var vc = votes.size()
                        for (var j = 0; j < vc; j += 1) {
                            sum += (votes.value())[j].attributes.value;
                            if (request.currentUser) {
                                if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                                    (solutioncomments.value())[k].attributes.voted = (votes.value())[j].attributes.value;
                                }
                            }
                        }
                    }
                    (solutioncomments.value())[k].attributes.score = sum;
                }

            }

            (solutions.value())[i].attributes.comments = solutioncomments.toJSON()

            const votes = yield Solutionvote.query().where('solutionID', (solutions.value())[i].attributes.id).fetch()
            if (!votes) {
                votes = []
            }
            var sum = 0;
            if (!votes.isEmpty()) {
                var vc = votes.size()
                for (var j = 0; j < vc; j += 1) {
                    sum += (votes.value())[j].attributes.value;
                    if (request.currentUser) {
                        if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                            (solutions.value())[i].attributes.voted = (votes.value())[j].attributes.value
                        }
                    }
                }
            }
            (solutions.value())[i].attributes.score = sum;

        }

        const votes = yield Problemvote.query().where('problemID', problem.id).fetch()
        if (!votes) {
            votes = []
        }
        var sum = 0;
        if (!votes.isEmpty()) {
            var vc = votes.size()
            for (var j = 0; j < vc; j += 1) {
                sum += (votes.value())[j].attributes.value;
                if (request.currentUser) {
                    if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                        problem.voted = (votes.value())[j].attributes.value
                    }
                }
            }
        }
        problem.score = sum;

        const owner = yield User.find(problem.ownerID)
        if(owner){
            problem.owner=owner
        }


        const trusteds = yield Trusted.query().where('projectID',project.id).fetch()

        if(!trusteds){
            trusteds=[]
        }
        var trustedids = [];
        if (!trusteds.isEmpty()) {
            var c = trusteds.size()
            for (var i = 0; i < c; i += 1) {
                trustedids.push( (trusteds.value())[i].attributes.userID)
            }
        }

        trustedids.push(project.ownerID)



        yield response.sendView('problem',
            {
                project: project.toJSON(),
                problem: problem.toJSON()
                , comments: comments.toJSON()
                , solutions: solutions.toJSON()
                , trustedids : trustedids
            })
    }

    * ajaxSearch(request,response){
        const searchterm = (request.get())['term'].toLowerCase()

        const projects = yield Project.all();

        var prefiltered = projects.filter(i => i.title.toLowerCase().indexOf(searchterm) > -1);
        var filtered = prefiltered.filter(i => i.active == 1);

        if (!filtered.isEmpty()) {
            var c = filtered.size()
            for (var i = 0; i < c; i += 1) {
                (filtered.value())[i].attributes.description = ((filtered.value())[i].attributes.description.split("\n"))
                const owner = yield User.find((filtered.value())[i].attributes.ownerID)
                if (owner) {
                    (filtered.value())[i].attributes.owner = owner
                }
                if(request.currentUser){
                if(request.currentUser.id == (filtered.value())[i].attributes.ownerID)
                {
                    (filtered.value())[i].attributes.ownitem=1;
                }
                }
            }
        }

        response.ok({
            success:true,
            projects: filtered.toJSON()
        }
        )
    }

    *ajaxProjectComments(request,response){
        const projectID=request.param("projectID")

        if(!projectID){
            response.ok({
                success :false
            })
        }

        const comments = yield Projectcomment.query().where('projectID', projectID).fetch()

        if (!comments) {
            comments = []
        }
        if (!comments.isEmpty()) {
            var c = comments.size()
            for (var i = 0; i < c; i += 1) {
                (comments.value())[i].attributes.content = ((comments.value())[i].attributes.content.split("\n"))
                const owner = yield User.find((comments.value())[i].attributes.ownerID)
                if (owner) {
                    (comments.value())[i].attributes.owner = owner
                }
                if(request.currentUser){
                    if(request.currentUser.id==owner.id){
                         (comments.value())[i].attributes.ownitem=1;
                    }
                }


                const votes = yield Projectcommentvote.query().where('commentID', (comments.value())[i].attributes.id).fetch()
                if (!votes) {
                    votes = []
                }
                var sum = 0;
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        if (request.currentUser) {
                            if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                                (comments.value())[i].attributes.voted = (votes.value())[j].attributes.value;
                            }
                        }
                    }
                }
                (comments.value())[i].attributes.score = sum;

            }
        }

        var loggedin = 0
        if(request.currentUser){
            loggedin = 1;
        }

        response.ok({
            success : true,
            loggedin: loggedin,
            projectcomments : comments.toJSON()
        })

    }

    * ajaxGetVotes(request,response){

        const requestdata=request.post()
        const id = requestdata.id

        if(!id || !requestdata || ! requestdata.type){
            response.ok({success:false})
            return;
        }

        var sum = 0
        var comment = 0
        var votes = 0
        switch(requestdata.type){
            case "project" : 
                comment = yield Projectcomment.find(id);
                if(!comment){
                     response.ok({success:false})
                 return;
                }
                votes = yield Projectcommentvote.query().where('commentID', id).fetch()

                if(!votes){votes=[]}
                if (!votes.isEmpty()) {
                    let vc = votes.size()
                    for (let j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        
                    }
                }
                response.ok({
                    success:true,
                    score:sum
                })
                return
                 //case: "project"
            case "problemComment" :
                comment = yield Problemcomment.find(id);
                if(!comment){
                     response.ok({success:false})
                 return;
                }
                votes = yield Problemcommentvote.query().where('commentID', id).fetch()

                if(!votes){votes=[]}
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        
                    }
                }
                 response.ok({
                    success:true,
                    score:sum
                })
                return
                 //case: "problemComment"
            case "solution" :
                const solution = yield Solution.find(id)
                if(!solution){
                     response.ok({success:false})
                 return;
                }

                votes = yield Solutionvote.query().where('solutionID', id).fetch()
                if (!votes) {
                    votes = []
                }
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                    }
                }
                 response.ok({
                    success:true,
                    score:sum
                })
                return
            //case :solution
            case "solutioncommentvote" :
                    const solutioncomment = yield Solutioncomment.find(id)
                    if(!solutioncomment){
                         response.ok({success:false})
                         return;
                     }
                    votes = yield Solutioncommentvote.query().where('commentID', id).fetch()
                    if (!votes) {
                        votes = []
                    }
                    if (!votes.isEmpty()) {
                        var vc = votes.size()
                        for (var j = 0; j < vc; j += 1) {
                            sum += (votes.value())[j].attributes.value;
                        }
                    }
                     response.ok({
                    success:true,
                    score:sum
                })
                return

            //case : solutioncommentvote
            case  "problem" :
                const problem = yield Problem.find(id)
                if(!problem){
                         response.ok({success:false})
                         return;
                }
                votes = yield Problemvote.query().where('problemID', id).fetch()
                if (!votes) {
                    votes = []
                }
                if (!votes.isEmpty()) {
                    var cv = votes.size()
                    for (var j = 0; j < cv; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                    }
                }
                 response.ok({
                    success:true,
                    score:sum
                })
                return

            //case : problem

        }
        response.ok({
            success:false
        })
    }

    * ajaxProblemComments(request,response){
        const problemID=request.param("problemID")

        if(!problemID){
            response.ok({
                success :false
            })
            return
        }

        const comments = yield Problemcomment.query().where('problemID', problemID).fetch()

        if (!comments) {
            comments = []
        }
        if (!comments.isEmpty()) {
            var c = comments.size()
            for (var i = 0; i < c; i += 1) {
                (comments.value())[i].attributes.content = ((comments.value())[i].attributes.content.split("\n"))
                const owner = yield User.find((comments.value())[i].attributes.ownerID)
                if (owner) {
                    (comments.value())[i].attributes.owner = owner
                }
                if(request.currentUser){
                    if(request.currentUser.id==owner.id){
                         (comments.value())[i].attributes.ownitem=1;
                    }
                }


                const votes = yield Problemcommentvote.query().where('commentID', (comments.value())[i].attributes.id).fetch()
                if (!votes) {
                    votes = []
                }
                var sum = 0;
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        if (request.currentUser) {
                            if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                                (comments.value())[i].attributes.voted = (votes.value())[j].attributes.value;
                            }
                        }
                    }
                }
                (comments.value())[i].attributes.score = sum;

            }
        }

        var loggedin = 0
        if(request.currentUser){
            loggedin = 1;
        }

        response.ok({
            success : true,
            loggedin: loggedin,
            problemcomments : comments.toJSON()
        })

    }


    * ajaxSolutionComments(request,response){
        const solutionID=request.param("solutionID")

        if(!solutionID){
            response.ok({
                success :false
            })
            return
        }

        const comments = yield Solutioncomment.query().where('solutionID', solutionID).fetch()

        if (!comments) {
            comments = []
        }
        if (!comments.isEmpty()) {
            var c = comments.size()
            for (var i = 0; i < c; i += 1) {
                (comments.value())[i].attributes.content = ((comments.value())[i].attributes.content.split("\n"))
                const owner = yield User.find((comments.value())[i].attributes.ownerID)
                if (owner) {
                    (comments.value())[i].attributes.owner = owner
                }
                if(request.currentUser){
                    if(request.currentUser.id==owner.id){
                         (comments.value())[i].attributes.ownitem=1;
                    }
                }


                const votes = yield Solutioncommentvote.query().where('commentID', (comments.value())[i].attributes.id).fetch()
                if (!votes) {
                    votes = []
                }
                var sum = 0;
                if (!votes.isEmpty()) {
                    var vc = votes.size()
                    for (var j = 0; j < vc; j += 1) {
                        sum += (votes.value())[j].attributes.value;
                        if (request.currentUser) {
                            if (request.currentUser.id == (votes.value())[j].attributes.ownerID) {
                                (comments.value())[i].attributes.voted = (votes.value())[j].attributes.value;
                            }
                        }
                    }
                }
                (comments.value())[i].attributes.score = sum;

            }
        }

        var loggedin = 0
        if(request.currentUser){
            loggedin = 1;
        }

        response.ok({
            success : true,
            loggedin: loggedin,
            solutioncomments : comments.toJSON()
        })

    }


}

module.exports = PublicController
