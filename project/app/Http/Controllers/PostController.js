'use strict'

class PostController {
    * index (request,response) {
        yield response.sendView('main',
        {
            name : request.name
        }
        );
    }
}

module.exports = PostController
