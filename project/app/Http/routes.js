'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/', 'PostController.index')

Route.get('/new','PostController.createproject')
Route.post('/new','PostController.doCreateproject')

Route.post('/login','PostController.doLogin')
Route.get('/logout','PostController.logout')


Route.get('/register', 'PostController.register')
Route.post('/register','PostController.doRegister')