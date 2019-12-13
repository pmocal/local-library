var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const validator = require('express-validator');

// Display list of all Genre.
exports.genre_list = function(req, res) {
	Genre.find()
		.exec(function (err, list_genres) {
			if (err) { return next(err); }
			res.render('genre_list', { title: 'Genre list', genre_list: list_genres });
		});
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
	async.parallel(
		{
			genre: function(callback) {
				Genre.findById(req.params.id)
					.exec(callback);
			},

			genre_books: function(callback) {
				Book.find({ 'genre': req.params.id })
				  .exec(callback);
			},

		},
		function(err, results) {
			if (err) { return next(err); }
			if (results.genre==null) { // No results.
				var err = new Error('Genre not found');
				err.status = 404;
				return next(err);
			}
			// Successful, so render
			res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
		}
	);
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
	res.render('genre_form', { title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
	//validate that name field not empty
	validator.body('name', 'Genre name required').isLength({ min: 1}).trim(),
	//sanitize name field
	validator.sanitizeBody('name').escape(),
	//process request after validation & sanitization
	(req, res, next) => {
		//Extract the validation errors from a request
		const errors = validator.validationResult(req);
		//create genre object with escaped & trimmed data
		var genre = new Genre(
			{ name: req.body.name }
		);

		if (!errors.isEmpty()) {
			//errors, render the form again
			res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
			return;
		}
		else {
			//data from form is valid
			//check if genre with same name exists
			Genre.findOne({ 'name': req.body.name })
				.exec( function(err, found_genre) {
					if (err) { return next(err); }
					if (found_genre) {
						//genre exists, redirect to its detail page
						res.redirect(found_genre.url);
					}
					else {
						genre.save(function (err) {
							if (err) { return next(err); }
							//genre saved, redirect to genre detail
							res.redirect(genre.url);
						});
					}
				});
		}
	}
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
	async.parallel(
		{
			genre: function(callback){
				Genre.findById(req.params.id)
				.exec(callback)
			},
			genre_books: function(callback) {
				Book.find({ 'genre': req.params.id })
				.exec(callback)
			}
		}, function(err, results) {
			if (err) { return next(err); }
			if (results==null) {
				res.redirect('/catalog/genres');
			}
			res.render('genre_delete', { title: 'Genre delete', genre: results.genre, genre_books: results.genre_books });
		}
	);
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res, next) {
	async.parallel(
		{
			genre: function(callback) {
				Genre.findById(req.params.id)
				.exec(callback)
			},
			genre_books: function(callback) {
				Book.find({'genre': req.params.id})
				.exec(callback)
			}
		},
		function(err, results) {
			if (err) { return next(err); }
			else if (results == null) {
				res.redirect('/catalog/genres');
			}
			else if (results.genre_books.length > 0) {
				res.render('genre_delete', { title: 'Genre delete', genre: results.genre, genre_books: results.genre_books });
			}
			else {
				Genre.findByIdAndRemove(req.params.id, function(err) {
					if (err) { return next(err); }
					res.redirect('/catalog/genres');
				})
			}
		});
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
	Genre.findById(req.params.id)
		.exec( function( err, genre ) {
			res.render('genre_form', { title: 'Genre Update', genre: genre })
		} );
}

// Handle Genre update on POST.
exports.genre_update_post = [
	//validate that name field not empty
	validator.body('name', 'Genre name required').isLength({ min: 1}).trim(),
	//sanitize name field
	validator.sanitizeBody('name').escape(),
	//process request after validation & sanitization
	(req, res, next) => {
		//Extract the validation errors from a request
		const errors = validator.validationResult(req);
		//create genre object with escaped & trimmed data
		var genre = new Genre(
			{
				name: req.body.name,
				_id: req.params.id
			}
		);
		if (!errors.isEmpty()) {
			//errors, render the form again
			res.render('genre_form', { title: 'Genre Update', genre: genre, errors: errors.array()});
			return;
		}
		else {
			//data from form is valid
			//check if genre with same name exists
			Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, thegenre) {
					if (err) { return next(err) ; }; 
						res.redirect(thegenre.url);
			});
		}
	}
];

	