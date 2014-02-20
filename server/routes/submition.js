var controller = require('../controllers/submitionController.js');

module.exports = function (server) {
    // ### submition routes
    server.post('/submit/:contrib_id', controller.submit);
    server.post('/submit', controller.submit);
    server.get('/form/:contrib_id', controller.form);
    server.get('/form', controller.form);
    server.get('/list', controller.list);
};
