const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UniversitySchema = new Schema({
	 name: String,
	 majors: [{type: Schema.Types.ObjectId, ref: 'Major'}],
	 websiteUrl: String,
	 imageUrl: String,
	 establishedDate: Date,
	 summary: String,
	 applicationDeadline: Date,
	 city: {type: Schema.Types.ObjectId, ref: 'City'},
	 rating: Number
})

const MajorSchema = new Schema({
	 name: String,
	 websiteUrl: String,
	 courses: [String]
})

const IndustrySchema = new Schema({
	 name: String,
	 websiteUrl: String,
	 summary: String,
	 majors: [{type: Schema.Types.ObjectId, ref: 'Major'}],
	 jobs: [String]
})

const CitySchema = new Schema({
	 name: String,
	 websiteUrl: String,
	 industries: [{type: Schema.Types.ObjectId, ref: 'Industry'}],
	 latlng: String,
	 country: String
})

exports.University = mongoose.model('University', UniversitySchema)
exports.Major = mongoose.model('Major', MajorSchema)
exports.Industry = mongoose.model('Industry', IndustrySchema)
exports.City = mongoose.model('City', CitySchema)
