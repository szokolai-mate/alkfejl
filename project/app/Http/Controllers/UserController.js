'use strict'

const Database = use('Database')

const Validator = use('Validator')
const User = use('App/Model/User')
const Hash = use('Hash')

class UserController {

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


*doLogin (request,response){
        const email = request.input('email')
        const password = request.input('password')

        try {
        const login = yield request.auth.attempt(email, password) 

        if (login) {
            response.redirect('back')
            return
        }
        } 
        catch (err) {
        yield request
            .withAll()
            .andWith({headererrors: [
            {
                message: 'Invalid e-mail or password!'
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

module.exports = UserController
