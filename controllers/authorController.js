//the model we will use to access and update data
var Author = require('../models/author');

//Express middleware function standard form below: args for request & response

// Display list of all Authors.
exports.author_list = function(req, res, next) {

	Author.find()
		.sort([['family_name', 'ascending']])
		.exec(function (err, list_authors) {
			if (err) { return next(err); }
			//Successful, so render
			res.render('author_list', { title: 'Author List', author_list: list_authors });
		});
};

//display detail page for a specific author
exports.author_detail = function(req, res) {
	res.send('Not implemented: Author detail: ' + req.params.id);
};

//display author create form on GET
exports.author_create_get = function(req, res) {
	res.send('Not implemented: author create GET');
}

//handle author create on POST
exports.author_create_post = function(req, res) {
	res.send('Not implemented: Author create POST')
}

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Author update POST');
};