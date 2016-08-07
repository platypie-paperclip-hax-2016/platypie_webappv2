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
      universities
    });
  })
};
