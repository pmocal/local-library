var mongoose = require('mongoose');
const moment = require('moment-timezone');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

//virtual for author's birth date
AuthorSchema
.virtual('birthdate')
.get(function () {
	return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '';
});

//virtual for author's birth date
AuthorSchema
.virtual('birthdate_form')
.get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
});

//virtual for author's death date
AuthorSchema
.virtual('deathdate')
.get(function () {
	return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
});

//virtual for author's death date
AuthorSchema
.virtual('deathdate_form')
.get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  return (this.date_of_birth && this.date_of_death) ? 
    'Lived ' + (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString() + ' years' : '';
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});



//Export model
module.exports = mongoose.model('Author', AuthorSchema);