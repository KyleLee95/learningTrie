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
    //do a type check to see if it's upvote/downvote.
    //I can change it on the frontend such that if you're untoggling your vote type
    //to none, there's a none update for both

    if (req.body.voteType === 'none') {
      //sets vote status to 'upvote' && +1 to score
      const user = await User.findByPk(req.user.id)
      const resource = await Resource.findByPk(req.body.resource.id)
      await resource.update({score: resource.score + 1})
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id}
      })
      await vote[0].update({
        voteType: 'upvote'
      })
      await vote[0].addUser(user)

      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'upvote') {
      //resets +0 to score && vote status to none
      const user = await User.findByPk(req.user.id)
      const resource = await Resource.findByPk(req.body.resource.id)
      await resource.update({score: resource.score - 0})
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id}
      })
      await vote[0].update({
        voteType: 'upvote'
      })
      await vote[0].addUser(user)

      res.status(200).send(vote[0])
    }
  } catch (err) {
    next(err)
  }
})

router.put('/downvote', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const resource = await Resource.findByPk(req.body.id)
    await resource.update({score: resource.score - 1})
    const vote = await Vote.findOrCreate({
      where: {resourceId: resource.id}
    })
    await vote[0].update({
      voteType: 'downvote'
    })
    await vote[0].addUser(user)

    res.status(200).send(vote[0])
  } catch (err) {
    next(err)
  }
})
