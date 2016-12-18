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
    Route.get('/problem/:problemID/comments','PublicController.ajaxProblemComments')
    Route.get('/solution/:solutionID/comments','PublicController.ajaxSolutionComments')
    Route.get('/project/:projectID/comments','PublicController.ajaxProjectComments')
    Route.post('/project/:projectID/comment','ProjectController.ajaxAddProjectComment')
    Route.post('/solution/:solutionID/comment','ProjectController.ajaxAddSolutionComment')
    Route.post('/problem/:problemID/comment','ProjectController.ajaxAddProblemComment')
    Route.post('/votes','PublicController.ajaxGetVotes')
    Route.get('/show/:projectID/vote/:commentID','ProjectController.ajaxVoteProjectComment')
    Route.get('/show/:projectID/:problemID/vote/:commentID','ProjectController.ajaxVoteProblemComment')
    Route.get('/show/:projectID/:problemID/vote/solution/:solutionID','ProjectController.ajaxVoteSolution')
    Route.get('/show/:projectID/:problemID/:solutionID/vote/:commentID','ProjectController.ajaxVoteSolutionComment')
    Route.get('/show/:projectID/vote/problem/:problemID','ProjectController.ajaxVoteProblem')
}).prefix('/ajax')