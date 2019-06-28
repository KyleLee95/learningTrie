const router = require('express').Router()
const {User, Vote, Resource} = require('../db/models')
module.exports = router

router.get('/:resourceId', async (req, res, next) => {
  try {
    const upvotes = await Vote.findAndCountAll({
      where: {resourceId: req.params.resourceId, voteType: 'upvote'}
    })
    const downvotes = await Vote.findAndCountAll({
      where: {resourceId: req.params.resourceId, voteType: 'downvote'}
    })
    const vote = upvotes.count - downvotes.count

    res.sendStatus(200).send(vote)
  } catch (err) {
    next(err)
  }
})

router.put('/upvote', async (req, res, next) => {
  try {
    if (req.body.voteType === 'none') {
      //sets vote status to 'upvote' && +1 to score
      const user = await User.findByPk(req.user.id)
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id}
      })
      await vote[0].update({
        voteType: 'upvote'
      })
      // console.log(Object.keys(vote[0].__proto__))
      await vote[0].setUser(user)
      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'upvote') {
      //resets +0 to score && vote status to none
      const user = await User.findByPk(req.user.id)
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id}
      })
      // console.log(Object.keys(vote[0].__proto__))
      await vote[0].update({
        voteType: 'none'
      })
      await vote[0].setUser(user)
      res.status(200).send(vote[0])
    }
  } catch (err) {
    next(err)
  }
})

router.put('/downvote', async (req, res, next) => {
  console.log(req.body)
  try {
    if (req.body.voteType === 'none') {
      //sets vote status to 'downvote'
      const user = await User.findByPk(req.user.id)

      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id}
      })
      await vote[0].update({
        voteType: 'downvote'
      })
      // console.log(Object.keys(vote[0].__proto__))
      await vote[0].setUser(user)

      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'downvote') {
      //resets +0 to score && vote status to none
      const user = await User.findByPk(req.user.id)
      const resource = await Resource.findByPk(req.body.resource.id)
      await resource.update({score: resource.score - 0})
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id}
      })
      // console.log(Object.keys(vote[0].__proto__))
      await vote[0].update({
        voteType: 'none'
      })
      await vote[0].setUser(user)

      res.status(200).send(vote[0])
    }
  } catch (err) {
    next(err)
  }
})
