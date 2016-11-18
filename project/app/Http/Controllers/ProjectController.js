'use strict'

const Database = use('Database')

const Project = use('App/Model/Project')
const Problem = use('App/Model/Problem')
const Projectcomment = use('App/Model/Projectcomment')
const Projectcommentvote = use('App/Model/Projectcommentvote')
const Problemcomment = use('App/Model/Problemcomment')
const Problemcommentvote = use('App/Model/Problemcommentvote')
const Solution = use('App/Model/Solution')
const Trusteduser = use('App/Model/Trusteduser')
const User = use('App/Model/User')
const Solutioncomment = use('App/Model/Solutioncomment')
const Solutioncommentvote = use('App/Model/Solutioncommentvote')
const Problemvote=use('App/Model/Problemvote')
const Solutionvote = use('App/Model/Solutionvote')

const Validator = use('Validator')

class ProjectController {
        * createproject (request,response){
        yield response.sendView('createproject',{

        })
    }

    * doCreateproject (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const projectdata = request.except('_csrf');

        const rules = {
        projectname: 'required|max:255',
        description: 'required',
        };

        const validation = yield Validator.validateAll(projectdata, rules)


        if (validation.fails()) {
        console.log(validation.messages());
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const project = new Project()

        project.title = projectdata.projectname;
        project.description= projectdata.description; 
        project.ownerID = request.currentUser.id;
        project.active=true;
        yield project.save()
        

        yield response.redirect('/show/' + project.id)
    }

    * deactivate (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        if(request.currentUser.id!=project.ownerID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not your project!'}]})
            .flash()
            response.redirect('back')
            return
        }

        project.active=0;
        yield project.save()

        response.redirect('/show/' + project.id)
    }

    * activate (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        if(request.currentUser.id!=project.ownerID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not your project!'}]})
            .flash()
            response.redirect('back')
            return
        }

        project.active=1;
        yield project.save()

        response.redirect('/show/' + project.id)
    }

    * createproblem (request,response){
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

        project.attributes.description = project.attributes.description.split("\n")

        yield response.sendView('createproblem',{
            project : project.toJSON()
        })
    }

    * doCreateproblem (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const problemdata = request.except('_csrf');

        const rules = {
        problemtitle: 'required|max:255',
        description: 'required',
        };

        const validation = yield Validator.validateAll(problemdata, rules)


        if (validation.fails()) {
        console.log(validation.messages());
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const problem = new Problem()

        problem.title = problemdata.problemtitle;
        problem.description= problemdata.description; 
        problem.ownerID = request.currentUser.id;
        problem.active=true;
        problem.projectID = request.param('projectID')
        yield problem.save()
        

        yield response.redirect('/show/' + request.param('projectID'))
    }

    * addProjectComment(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const commentdata = request.except('_csrf');

        const rules = {
        content: 'required|max:500',
        };

        const validation = yield Validator.validateAll(commentdata, rules)


        if (validation.fails()) {
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const project = yield Project.find(request.param('projectID'))

        if(!project){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'Project not found!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const owner = yield User.find(request.currentUser.id)
         if(!owner){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'User not found!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const comment = new Projectcomment()

        comment.content = commentdata.content;
        comment.ownerID = request.currentUser.id;
        comment.projectID = request.param('projectID')
        yield comment.save()
        
        response.redirect('/show/' + request.param('projectID'))
    }


    * createSolution (request,response){
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

        project.attributes.description=project.attributes.description.split("\n")

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

        problem.attributes.description=problem.attributes.description.split("\n")

        yield response.sendView('createsolution',{
            project : project.toJSON(),
            problem : problem.toJSON()
        })
    }

    * doCreateSolution (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const solutiondata = request.except('_csrf');

        const rules = {
        description: 'required',
        };

        const validation = yield Validator.validateAll(solutiondata, rules)


        if (validation.fails()) {
        console.log(validation.messages());
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const solution = new Solution()

        solution.description= solutiondata.description; 
        solution.ownerID = request.currentUser.id;
        solution.active=true;
        solution.accepted=false;
        solution.problemID = request.param('problemID')
        yield solution.save()
        

        yield response.redirect("/" + request.param('projectID') + '/show/' + request.param('problemID'))
    }


    * addUser(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        if(request.currentUser.id!=project.ownerID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not your project!'}]})
            .flash()
            response.redirect('/show/' + id)
            return
        }

        const userID = request.input('userID')

        if(userID==project.ownerID){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'You are the owner, what more do you want?'}]})
            .flash()
            response.redirect('/show/' + id)
            return
        }

        const user = yield User.find(userID)
        if(!user){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'User not found!'}]})
            .flash()
            response.redirect('/show/' + id)
            return
        }

        var trusted = yield Trusteduser.query().where('projectID',id).where('userID',userID).first()
        if(trusted){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'User already trusted!'}]})
            .flash()
            response.redirect('/show/' + id)
            return
        }

        trusted = new Trusteduser();

        trusted.projectID=id;
        trusted.userID=userID;
        yield trusted.save()

        response.redirect('/show/' + id)   
    }

    * deleteUser(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        if(request.currentUser.id!=project.ownerID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not your project!'}]})
            .flash()
            response.redirect('/show/' + id)
            return
        }

        const userID = request.param('userID')

        const user = yield User.find(userID)
        if(!user){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'User not found!'}]})
            .flash()
            response.redirect('/show/' + id)
            return
        }

        const trusted = yield Trusteduser.query().where('projectID',id).where('userID',userID).first()

        if(!trusted){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Trusted user not found!'}]})
            .flash()
            response.redirect('/show/' + id)
            return
        }
        yield trusted.delete();

        response.redirect('/show/' + id)   

    }

    * voteProjectComment(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        const commentID = request.param('commentID')

        const comment = yield Projectcomment.find(commentID)

        if(!comment || !commentID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Comment not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const positive = request.input('positive')

        var vote = yield Projectcommentvote.query().where('commentID',commentID).where('ownerID',request.currentUser.id).first()

        if(vote){
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }
        else{
            vote = new Projectcommentvote()
            vote.ownerID=request.currentUser.id
            vote.commentID=commentID
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }

        yield vote.save()

        response.redirect('back')
    }

       * voteProblem(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        const problemID = request.param('problemID')

        const problem = yield Problem.find(problemID)

        if(!problem || !problemID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const positive = request.input('positive')

        var vote = yield Problemvote.query().where('problemID',problemID).where('ownerID',request.currentUser.id).first()

        if(vote){
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }
        else{
            vote = new Problemvote()
            vote.ownerID=request.currentUser.id
            vote.problemID=problemID
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }

        yield vote.save()

        response.redirect('back')
    }

    * voteSolution(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        const solutionID = request.param('solutionID')

        const solution = yield Solution.find(solutionID)

        if(!solution || !solutionID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Solution not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const problemID = request.param('problemID')

        const problem = yield Problem.find(problemID)

        if(!problem || !problemID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const positive = request.input('positive')

        var vote = yield Solutionvote.query().where('solutionID',solutionID).where('ownerID',request.currentUser.id).first()

        if(vote){
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }
        else{
            vote = new Solutionvote()
            vote.ownerID=request.currentUser.id
            vote.solutionID=solutionID
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }

        yield vote.save()

        response.redirect('back')
    }

    * voteProblemComment(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        const problemID = request.param('problemID')
         if(!problemID){
            response.redirect('/')
            return
        }

        const problem = yield Problem.find(problemID)

        if(!problem || !id){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const commentID = request.param('commentID')

        const comment = yield Problemcomment.find(commentID)

        if(!comment || !commentID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Comment not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const positive = request.input('positive')

        var vote = yield Problemcommentvote.query().where('commentID',commentID).where('ownerID',request.currentUser.id).first()

        if(vote){
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }
        else{
            vote = new Problemcommentvote()
            vote.ownerID=request.currentUser.id
            vote.commentID=commentID
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }

        yield vote.save()

        response.redirect('back')
    }

    * voteSolutionComment(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

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

        const problemID = request.param('problemID')
         if(!problemID){
            response.redirect('/')
            return
        }

        const problem = yield Problem.find(problemID)

        if(!problem || !id){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const solutionID = request.param('solutionID')
         if(!solutionID){
            response.redirect('/')
            return
        }

        const solution = yield Solution.find(solutionID)

        if(!solution || !id){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Solution not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const commentID = request.param('commentID')

        const comment = yield Solutioncomment.find(commentID)

        if(!comment || !commentID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Comment not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const positive = request.input('positive')

        var vote = yield Solutioncommentvote.query().where('commentID',commentID).where('ownerID',request.currentUser.id).first()

        if(vote){
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }
        else{
            vote = new Solutioncommentvote()
            vote.ownerID=request.currentUser.id
            vote.commentID=commentID
            if(positive){
                vote.value=1
            }
            else{vote.value=-1}
        }

        yield vote.save()

        response.redirect('back')
    }

    * editProject(request,response){
        const id = request.param('projectID')
        if(!id){
            response.redirect('back')
        }
        const project = yield Project.find(id);
        if(!project){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        yield response.sendView('editproject',{
            project : project.toJSON()
        })
    }

    * editProblem(request,response){
        const id = request.param('projectID')
        if(!id){
            response.redirect('back')
        }
        const project = yield Project.find(id);
        if(!project){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }
        project.description=project.description.split("\n")

        const problemID = request.param('problemID')
        if(!problemID){
            response.redirect('back')
        }
        const problem = yield Problem.find(problemID);
        if(!problem){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        yield response.sendView('editproblem',{
            project : project.toJSON()
            ,problem : problem.toJSON()
        })
    }

    * editSolution(request,response){
        const id = request.param('projectID')
        if(!id){
            response.redirect('back')
        }
        const project = yield Project.find(id);
        if(!project){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }
        project.description=project.description.split("\n")

        const problemID = request.param('problemID')
        if(!problemID){
            response.redirect('back')
        }
        const problem = yield Problem.find(problemID);
        if(!problem){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }
        const solutionID = request.param('solutionID')
        if(!solutionID){
            response.redirect('back')
        }
        problem.description=problem.description.split("\n")

        const solution = yield Solution.find(solutionID);
        if(!solution){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Solution not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        yield response.sendView('editsolution',{
            project : project.toJSON()
            ,problem : problem.toJSON()
            ,solution : solution.toJSON()
        })
    }

    * doEditProject (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const projectdata = request.except('_csrf');

        const rules = {
        projectname: 'required|max:255',
        description: 'required',
        };

        const validation = yield Validator.validateAll(projectdata, rules)


        if (validation.fails()) {
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const id = request.param('projectID')

        if(!id){
            response.redirect('back')
        }

        const project= yield Project.find(id)

        if(!project){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        if(project.ownerID!=request.currentUser.id){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not your project!'}]})
            .flash()
            response.redirect('back')
            return
        }

        project.title = projectdata.projectname;
        project.description= projectdata.description; 
        yield project.save()
        

        yield response.redirect('/show/' + project.id)
    }
    

    * doEditProblem (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const projectdata = request.except('_csrf');

        const rules = {
        problemtitle: 'required|max:255',
        description: 'required',
        };

        const validation = yield Validator.validateAll(projectdata, rules)


        if (validation.fails()) {
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const id = request.param('projectID')

        if(!id){
            response.redirect('back')
        }

        const project= yield Project.find(id)

        if(!project){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

         const problemID = request.param('problemID')

        if(!problemID){
            response.redirect('back')
        }

        const problem= yield Problem.find(problemID)

        if(!problem){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        var authorized=false;
        if(request.currentUser.id==problem.ownerID){
            authorized = true;
        }
        if(request.currentUser.id==project.ownerID){
            authorized = true;
        }

        const trusteds = yield Trusteduser.query().where('projectID',project.id).fetch()
        if(!trusteds){
            trusteds=[]
        }
        var trustedids = [];
        if (!trusteds.isEmpty()) {
            var c = trusteds.size()
            for (var i = 0; i < c; i += 1) {
                if(request.currentUser.id==(trusteds.value())[i].attributes.userID){
                    authorized = true
                }
            }
        }

        if(! authorized){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'You are not trusted!'}]})
            .flash()
            response.redirect('back')
            return
        }

        problem.title = projectdata.problemtitle;
        problem.description= projectdata.description; 
        yield problem.save()
        

        yield response.redirect('/' + project.id + '/show/' + problem.id)
    }

    * doEditSolution (request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const projectdata = request.except('_csrf');

        const rules = {
        description: 'required',
        };

        const validation = yield Validator.validateAll(projectdata, rules)


        if (validation.fails()) {
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const id = request.param('projectID')

        if(!id){
            response.redirect('back')
        }

        const project= yield Project.find(id)

        if(!project){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

         const problemID = request.param('problemID')

        if(!problemID){
            response.redirect('back')
        }

        const problem= yield Problem.find(problemID)

        if(!problem){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const solutionID = request.param('solutionID')

        if(!solutionID){
            response.redirect('back')
        }

        const solution= yield Solution.find(solutionID)

        if(!solution){
             yield request
            .withAll()
            .andWith({headererrors: [{message: 'Solution not found!'}]})
            .flash()
            response.redirect('back')
            return
        }
        var authorized=false;
        if(request.currentUser.id==solution.ownerID){
            authorized = true;
        }
        if(request.currentUser.id==project.ownerID){
            authorized = true;
        }

        const trusteds = yield Trusteduser.query().where('projectID',project.id).fetch()
        if(!trusteds){
            trusteds=[]
        }
        var trustedids = [];
        if (!trusteds.isEmpty()) {
            var c = trusteds.size()
            for (var i = 0; i < c; i += 1) {
                if(request.currentUser.id==(trusteds.value())[i].attributes.userID){
                    authorized = true
                }
            }
        }

        if(! authorized){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'You are not trusted!'}]})
            .flash()
            response.redirect('back')
            return
        }

        solution.description= projectdata.description; 
        yield solution.save()
        

        yield response.redirect('/' + project.id + '/show/' + problem.id)
    }

    * addProblemComment(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const commentdata = request.except('_csrf');

        const rules = {
        content: 'required|max:500',
        };

        const validation = yield Validator.validateAll(commentdata, rules)


        if (validation.fails()) {
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const project = yield Project.find(request.param('projectID'))

        if(!project){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'Project not found!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const problem = yield Problem.find(request.param('problemID'))

        if(!problem){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'Problem not found!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const owner = yield User.find(request.currentUser.id)
         if(!owner){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'User not found!'}]})
        .flash()
        response.redirect('back')
        return
        }
    

        const comment = new Problemcomment()

        comment.content = commentdata.content;
        comment.ownerID = request.currentUser.id;
        comment.problemID = request.param('problemID')
        yield comment.save()
        
        response.redirect('/' + request.param('projectID') + '/show/' + request.param('problemID'))
    }

    * addSolutionComment(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const commentdata = request.except('_csrf');

        const rules = {
        solutioncommentcontent: 'required|max:500',
        };

        const validation = yield Validator.validateAll(commentdata, rules)

        if(validation.fails()){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'Empty or too long comment!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const project = yield Project.find(request.param('projectID'))

        if(!project){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'Project not found!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const problem = yield Problem.find(request.param('problemID'))

        if(!problem){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'Problem not found!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const solution = yield Solution.find(request.param('solutionID'))

        if(!solution){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'Solution not found!'}]})
        .flash()
        response.redirect('back')
        return
        }

        const owner = yield User.find(request.currentUser.id)
         if(!owner){
        yield request
        .withAll()
        .andWith({headererrors: [{message: 'User not found!'}]})
        .flash()
        response.redirect('back')
        return
        }
    

        const comment = new Solutioncomment()

        comment.content = commentdata.solutioncommentcontent;
        comment.ownerID = request.currentUser.id;
        comment.solutionID = request.param('solutionID')
        yield comment.save()

        
        response.redirect('/' + request.param('projectID') + '/show/' + request.param('problemID'))
    }

    * acceptSolution(request,response){
        const isLoggedIn = yield request.auth.check()
        if(!isLoggedIn){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Not logged in!'}]})
            .flash()
            response.redirect('back')
            return
        }

         const projectID = request.param('projectID')
         if(!projectID){
            response.redirect('/')
            return
        }

        const project = yield Project.find(projectID)

        if(!project || !projectID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Project not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const problemID = request.param('problemID')
         if(!problemID){
            response.redirect('/')
            return
        }

        const problem = yield Problem.find(problemID)

        if(!problem || !problemID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Problem not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        const solutionID = request.param('solutionID')
         if(!solutionID){
            response.redirect('/')
            return
        }

        const solution = yield Solution.find(solutionID)

        if(!solution || !solutionID){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'Solution not found!'}]})
            .flash()
            response.redirect('back')
            return
        }

        var authorized = false;

        if(request.currentUser.id==project.ownerID){
            authorized = true;
        }

        const trusteds = yield Trusteduser.query().where('projectID',project.id).fetch()
        if(!trusteds){
            trusteds=[]
        }
        var trustedids = [];
        if (!trusteds.isEmpty()) {
            var c = trusteds.size()
            for (var i = 0; i < c; i += 1) {
                if(request.currentUser.id==(trusteds.value())[i].attributes.userID){
                    authorized = true
                }
            }
        }

        if(! authorized){
            yield request
            .withAll()
            .andWith({headererrors: [{message: 'You are not trusted!'}]})
            .flash()
            response.redirect('back')
            return
        }

        if(solution.accepted==0){
            solution.accepted=1;
        }
        else{solution.accepted=0}

        yield solution.save();



        response.redirect('back')
    }
}

module.exports = ProjectController