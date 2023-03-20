const Players = require('../models/Players');
const Nations = require('../models/Nations');

let clubData = [
    { "id": "1", "name": "Arsenal" },
    { "id": "2", "name": "Manchester United" },
    { "id": "3", "name": "Chelsea" },
    { "id": "4", "name": "Manchester City" },
    { "id": "5", "name": "PSG" },
    { "id": "6", "name": "Inter Milan" },
    { "id": "7", "name": "Real Madrid" },
    { "id": "8", "name": "Barcelona" }
]

let positionData = [
    { "id": "1", "name": "Defenders" },
    { "id": "2", "name": "Midfielders" },
    { "id": "3", "name": "Forwards" },
]

class playerController {

    index(req, res, next) {

        let nationList = [];

        Nations.find({}, function (err, nations) {
            if (err) {
              console.error(err);
              return;
            }
            nations.forEach(function (nation) {
              nationList.push(nation);
            });
          });

        Players.find({}).populate('nation')
            .then((players) => {
                res.render('players', {
                    title: 'The list of Players',
                    nationList: nationList,
                    players: players,
                    clubList: clubData,
                    positionList: positionData,
                    userId : req.user
                });
            }).catch(next)
    }

    create = async (req, res, next) => {
        try {
          // Tìm nation tương ứng với nationName
          const nation = await Nations.findOne({ name: req.body.nation });
          const name = req.body.name;
          const image = req.body.image;
          const club = req.body.club;
          const position = req.body.position;
          const goals = req.body.goals;
          const isCaptain = req.body.isCaptain;
      
          // Tạo đối tượng player mới
          const player = new Players({
            name,
            image,
            club,
            position,
            goals,
            isCaptain,
            nation: nation.image // Sử dụng ID của nation tìm được ở trên
          });
          await player.save()
            .then(() => res.redirect('/players'))
            .catch(error => {
                console.log(error)
            });
        } catch (error) {
          console.log(error);
        }
      };

    formEdit(req, res, next) {
        
        let nationList = [];

        Nations.find({}, function (err, nations) {
            if (err) {
              console.error(err);
              return;
            }
            nations.forEach(function (nation) {
              nationList.push(nation);
            });
          });

        const playerId = req.params.playerId;
        let viewsData = {};
        Players.findById(playerId)
            .then((player) => {
                res.render('editPlayer', {
                    title: 'The detail of Player',
                    player: player,
                    clubList: clubData,
                    positionList: positionData,
                    userId : req.user,
                    nationList: nationList
                });
            })
            .catch(next);
    }

    edit = async (req, res, next) => {
        // Tìm nation tương ứng với nationName
        const nation = await Nations.findOne({ name: req.body.nation });
        const name = req.body.name;
        const image = req.body.image;
        const club = req.body.club;
        const position = req.body.position;
        const goals = req.body.goals;
        const isCaptain = req.body.isCaptain;
    
        // Tạo đối tượng player mới
        const player = ({
          name,
          image,
          club,
          position,
          goals,
          isCaptain,
          nation: nation.image // Sử dụng ID của nation tìm được ở trên
        });

        Players.updateOne({ _id: req.params.playerId }, player)
            .then(() => {
                res.redirect('/players')
            })
            .catch(next)
    }

    delete(req, res, next) {
        Players.findByIdAndDelete({ _id: req.params.playerId })
            .then(() => res.redirect('/players'))
            .catch(next);
    }

    async search (req, res, next){
        // let payload= req.body.payload.trim();
        // console.log(payload);
        // let search = Players.find({name: {}})
        let q = req.query.q;
        const mongoQuery = {
        $or: [
        { name: { $regex: q || '', $options: 'i' } },
      ],
    };

        try {
            const data = await Players.find({name: { $regex: q || '', $options: 'i' }});
            let view = {
                players: data
            }
            
            // res.send(data);
            res.render('page', view)
        } catch (error) {
            console.log(error);
        }
        
        

        // Players.find({name: {'$regex': new RegExp('^'+ 'a'+ '.*','i')}})

        
    }



};
module.exports = new playerController;