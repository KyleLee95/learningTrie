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
    // need to do a check for if it was a down vote. because then it's +2 or +1
    if (req.body.voteType === 'none') {
      //sets vote status to 'upvote' && +1 to score
      const user = await User.findByPk(req.user.id)
      const resource = await Resource.findByPk(req.body.resource.id)

      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id, userId: req.user.id}
      })
      await vote[0].update({
        voteType: 'upvote'
      })
      await vote[0].setUser(user)
      await resource.update({
        score: resource.score + 1
      })
      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'upvote') {
      //resets +0 to score && vote status to none
      const resource = await Resource.findByPk(req.body.resource.id)
      const user = await User.findByPk(req.user.id)
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id, userId: req.user.id}
      })
      await vote[0].update({
        voteType: 'none'
      })
      await vote[0].setUser(user)
      await resource.update({
        score: resource.score - 1
      })
      res.status(200).send(vote[0])
    }
  } catch (err) {
    next(err)
  }
})

router.put('/downvote', async (req, res, next) => {
  try {
    if (req.body.voteType === 'none') {
      //sets vote status to 'downvote'
      const user = await User.findByPk(req.user.id)
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id, userId: req.user.id}
      })
      await vote[0].update({
        voteType: 'downvote'
      })
      await vote[0].setUser(user)

      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'downvote') {
      //resets +0 to score && vote status to none
      const user = await User.findByPk(req.user.id)
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id, userId: req.user.id}
      })
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
