var models = require('../models')

exports.universityPage = function(req, res, next) {
    var universityId = req.params.id

    models.University.findOne({
        _id: universityId
    })
        .populate("majors city")
        .exec(function(err, uni) {
            if (err) next(err)
            else if (!uni) {
                next()
            } else {
                res.render("university.html", {
                    uni: uni
                })
            }
    })
}