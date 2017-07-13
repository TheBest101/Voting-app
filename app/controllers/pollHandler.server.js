
var Polls = require('../models/polls.js')
function PollHandler () {
  this.getPolls = (req, res) => {
    Polls
      .find({}, (err, docs) => {
        if(err) {throw err;}
        res.json(docs)
      })
  }
  this.addPolls = (req, res) => {
    Polls
      .findOne({name: req.query.name},{'_id':false})
      .exec((err, result) => {
        if(result){
          res.json({"Success": false, "Message": "Name"})
        }else if(req.query.options.split(',').length === 1){
          res.json({"Success": false, "Message": "Options"})
        }else{
          let options = req.query.options.split(',')
          let obj = new Polls({
            owner: req.user.twitter.id,
            name: req.query.name,
            data: [],
            options: options
          })
          obj.save((err, doc) => {
            if (err) {throw error;}
            res.json({"Success": true})
          })
        }
      })
  }
  this.getOnePoll = (req, res) => {
    Polls
      .findOne({name: req.query.name},{'_id':false})
      .exec((err, result) => {
        res.json(result)
      })
  }
  this.vote = (req, res) => {
    Polls
      .findOne({name: req.query.name},{'_id':false})
      .exec((err, docs) => {
        console.log(docs.data.map(v => v.ip))
        console.log(docs.data.map(v => v.ip).indexOf(req.query.choice))
        console.log(docs.data.map(v => v.ip).indexOf(req.query.choice)===-1)
        if(docs.data.map(v => v.ip).indexOf(req.ip)!==-1){
          res.json({"Success": false})
        }else{
          var obj = {
            ip: req.ip,
            choice: req.query.choice
          }
          Polls
            .findOneAndUpdate({name: req.query.name},{$push:{'data':obj}})
            .exec((err, result) => {
              res.json({"Success": true})
            })
        }
      })
  }
  this.getYours = (req, res) => {
    Polls
      .find({owner: req.user.twitter.id}, (err, docs) => {
        if(err) {throw err;}
        res.json(docs)
      })
  }
  this.deleteCollection = (req, res) => {
    Polls
      .deleteOne({$and: [{name: req.query.name}, {owner: req.user.twitter.id}]})
      .exec((err, result)=>{
        res.redirect('/')
      })
  }
  this.isOwner = (req, res) => {
    Polls
      .findOne({name: req.query.name})
      .exec((err, result) => {
        if(req.user){
          if(result.owner === req.user.twitter.id) {
            console.log(1)
            res.json({"Success":true})
          }else{
            console.log(2)
            res.json({"Success":false})
          }
        }else{
          res.json({"Success":false})
        }
      })
  }
  this.addOption = (req, res) => {
        Polls
          .findOneAndUpdate({name: req.query.name},{$push:{'options':req.query.option}})
          .exec((err, result) => {
            res.json({"Success": true})
          })

  }
}

module.exports = PollHandler;
