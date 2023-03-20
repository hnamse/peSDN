const Nations = require('../models/Nations');

class nationController {

    index(req, res, next) {
        Nations.find({})
            .then((nations) => {
                res.render('nations', {
                    title: 'The list of nations',
                    nations: nations,
                    userId : req.user
                });
            }).catch();
    }

    create(req, res, next) {
        const nations = new Nations(req.body);
        nations.save()
            .then(() => res.redirect('/nations'))
            .catch(error => { });
    }

    formEdit(req, res, next) {
        const nationId = req.params.nationId;
        let viewsData = {};
        Nations.findById(nationId)
            .then((nation) => {
                res.render('editNation', {
                    title: 'The detail of Nations',
                    nation: nation,
                    userId : req.user
                });
            })
            .catch(next);

    }

    edit(req, res, next) {
        Nations.updateOne({ _id: req.params.nationId }, req.body)
            .then(() => {
                res.redirect('/nations')
            })
            .catch(next)
    }

    delete(req, res, next) {
        Nations.findByIdAndDelete({ _id: req.params.nationId })
            .then(() => res.redirect('/nations'))
            .catch(next);
    }
};
module.exports = new nationController;