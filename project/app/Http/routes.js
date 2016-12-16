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

Route.get('/:projectID/new','ProjectController.createproblem')
Route.post('/:projectID/new','ProjectController.doCreateproblem')

Route.post('/show/:projectID/comment','ProjectController.addProjectComment')
Route.post('/:projectID/show/:problemID/comment','ProjectController.addProblemComment')
Route.post('/:projectID/:problemID/show/:solutionID/comment','ProjectController.addSolutionComment')

Route.get('/show/:projectID/edit','ProjectController.editProject')
Route.post('/show/:projectID/edit','ProjectController.doEditProject')
Route.get('/:projectID/show/:problemID/edit','ProjectController.editProblem')
Route.post('/:projectID/show/:problemID/edit','ProjectController.doEditProblem')
Route.get('/:projectID/:problemID/show/:solutionID/edit','ProjectController.editSolution')
Route.post('/:projectID/:problemID/show/:solutionID/edit','ProjectController.doEditSolution')

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
Route.post('/:projectID/show/:problemID/vote/:commentID','ProjectController.voteProblemComment')
Route.post('/:projectID/show/:problemID/vote','ProjectController.voteProblem')
Route.post('/:projectID/:problemID/show/:solutionID/vote/:commentID','ProjectController.voteSolutionComment')
Route.post('/:projectID/:problemID/show/:solutionID/vote','ProjectController.voteSolution')

Route.get('/:projectID/:problemID/show/:solutionID/accept','ProjectController.acceptSolution')


Route.group('ajax',function(){
    Route.get('/search','PublicController.ajaxSearch')
}).prefix('/ajax')