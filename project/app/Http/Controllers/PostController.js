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

const Validator = use('Validator')
const User = use('App/Model/User')
const Hash = use('Hash')


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

        const isLoggedIn = yield request.auth.check()
    if (isLoggedIn) {
      response.redirect('/')
    }

        yield response.sendView('register')
    }

    * doRegister (request,response){
        const registerData = request.except('_csrf');

        const rules = {
        nickname: 'required|max:80',
        email: 'required|unique:users|email',
        repeatemail: 'required|email|same:email',
        password: 'required|min:4',
        repeatpassword: 'required|same:password'
        ,
        terms: 'required'
        };

        const validation = yield Validator.validateAll(registerData, rules)


        if (validation.fails()) {
        console.log(validation.messages());
        yield request
        .withAll()
        .andWith({errors: validation.messages()})
        .flash()
        response.redirect('back')
        return
        }

        const user = new User()

        user.email = registerData.email;
        user.password = yield Hash.make(registerData.password) 
        user.displayName = registerData.nickname;
        yield user.save()
        
        yield request.auth.login(user)

        yield response.redirect('/')
    }

    * createproject (request,response){
        yield response.sendView('createproject',{

        })
    }

    * doCreateproject (request,response){
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
        

        yield response.redirect('/')
    }

    *doLogin (request,response){
        const email = request.input('email')
        const password = request.input('password')

        try {
        const login = yield request.auth.attempt(email, password) 

        if (login) {
            response.redirect('/')
            return
        }
        } 
        catch (err) {
        yield request
            .withAll()
            .andWith({errors: [
            {
                message: 'Invalid credentails'
            }
            ]})
            .flash()
      response.redirect('back')
    }
    }

    * logout (request, response) {
    yield request.auth.logout()
    response.redirect('/')
  }
}

module.exports = PostController
