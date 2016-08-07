/**
 * GET /
 */
const models = require('../models/')

exports.index = function(req, res) {
  models.University.find({}, null, {limit: 4})
  .populate('majors')
  .exec()
  .then(universities => {
    console.log(universities)
    res.render('home', {
      title: 'Home',
      universities,
      prash: arr
    });
  })
};


var arr = [
  {
    title: "HKUST is outstanding at arts",
    date: "2015-07-12",
    author: "Peter John"
  }, {
    title: "Harvard is awesome",
    date: "2014-03-02",
    author: "Daniel John"
  },
  {
    title: "No school fees?",
    date: "2016-02-07",
    author: "Mary Jane"
  }]
