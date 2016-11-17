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

Route.get('/', 'PublicController.index')
Route.post('/search','PublicController.search')

Route.get('/new','ProjectController.createproject')
Route.post('/new','ProjectController.doCreateproject')

Route.get('/show/:projectID/new','ProjectController.createproblem')
Route.post('/show/:projectID/new','ProjectController.doCreateproblem')

Route.post('/show/:projectID/comment','ProjectController.addProjectComment')

Route.get('/show/:projectID/edit','ProjectController.editProject')
Route.post('/show/:projectID/edit','ProjectController.doEditProject')

Route.get('/show/:projectID','PublicController.showProject')
Route.get('/show/','PublicController.redirect')
Route.get('/show/:projectID/deactivate','ProjectController.deactivate')
Route.get('/show/:projectID/activate','ProjectController.activate')
Route.post('/show/:projectID/trusted/add','ProjectController.addUser')
Route.get('/show/:projectID/trusted/:userID/remove','ProjectController.deleteUser')

Route.get('/:projectID/show/:problemID','PublicController.showProblem')

Route.get('/:projectID/:problemID/new','ProjectController.createSolution')
Route.post('/:projectID/:problemID/new','ProjectController.doCreateSolution')

Route.post('/login','UserController.doLogin')
Route.get('/logout','UserController.logout')
Route.get('/register', 'UserController.register')
Route.post('/register','UserController.doRegister')

Route.get('/profile/:userID','PublicController.profile')
Route.get('/profile/','PublicController.redirect')

Route.post('/show/:projectID/vote/:commentID','ProjectController.voteProjectComment')
Route.post('/:projectID/show/:problemID/vote','ProjectController.')
Route.post('/:projectID/show/:problemID/vote/:commentID','ProjectController.')