/* eslint-disable complexity*/
const router = require('express').Router()
const {User, Vote, Resource, Recommendation} = require('../db/models')
module.exports = router

router.get('/resource/:resourceId', async (req, res, next) => {
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

router.put('/recommendation/upvote', async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findOne({
      where: {
        link: req.body.recommendation.link
      }
    })

    const resource = await Resource.findOne({
      where: {
        link: req.body.recommendation.link
      }
    })

    const vote = await Vote.findOrCreate({
      where: {resourceId: resource.id, userId: req.user.id}
    })
    const user = await User.findByPk(req.user.id)
    await vote[0].setUser(user)
    if (req.body.voteType === 'none') {
      if (vote[0].voteType === 'downvote') {
        await vote[0].update({
          voteType: 'upvote'
        })

        await resource.update({
          score: resource.score + 2
        })
        await recommendation.update({
          score: recommendation.score + 2
        })
      } else if (vote[0].voteType === 'none') {
        await vote[0].update({
          voteType: 'upvote'
        })

        await resource.update({
          score: resource.score + 1
        })
        await recommendation.update({
          score: recommendation.score + 1
        })
      }
      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'upvote') {
      //flip to none
      await vote[0].update({
        voteType: 'none'
      })
      await vote[0].setUser(user)
      if (vote)
        await resource.update({
          score: resource.score - 1
        })
      await recommendation.update({
        score: recommendation.score - 1
      })
      res.status(200).send(vote[0])
    }
  } catch (err) {
    next(err)
  }
})
router.put('/recommendation/downvote', async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findByPk(
      req.body.recommendation.id
    )
    const resource = await Resource.findOne({
      where: {
        link: req.body.recommendation.link
      }
    })
    await recommendation.update({
      score: resource.score
    })
    const vote = await Vote.findOrCreate({
      where: {resourceId: resource.id, userId: req.user.id}
    })
    const user = await User.findByPk(req.user.id)

    if (req.body.voteType === 'none') {
      //flip to downvote
      if (vote[0].voteType === 'upvote') {
        await vote[0].update({
          voteType: 'downvote'
        })
        await vote[0].setUser(user)
        await resource.update({
          score: resource.score - 2
        })
        await recommendation.update({
          score: recommendation.score - 2
        })
      } else if (vote[0].voteType === 'none') {
        await vote[0].update({
          voteType: 'downvote'
        })
        await vote[0].setUser(user)
        await resource.update({
          score: resource.score - 1
        })
        await recommendation.update({
          score: recommendation.score - 1
        })
      }

      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'downvote') {
      await vote[0].update({
        voteType: 'none'
      })
      await vote[0].setUser(user)
      await resource.update({
        score: resource.score + 1
      })
      await recommendation.update({
        score: recommendation.score + 1
      })
      res.status(200).send(vote[0])
    }
  } catch (err) {
    next(err)
  }
})

router.get('/recommendation/:link', async (req, res, next) => {
  try {
    //Do this for the rendering logic of the buttons on the front end
    console.log(req.params)
    const resource = await Resource.findOne({
      where: {
        link: req.params.link
      }
    })
    let votes = await resource.getVotes()
    let vote = votes.filter(userVote => {
      return userVote.userId === req.user.id
    })

    res.send(vote[0]).status(200)
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
      const recommendation = await Recommendation.findOne({
        where: {
          link: resource.link
        }
      })

      await recommendation.update({
        score: resource.score
      })

      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id, userId: req.user.id}
      })

      //change the score of the vote before updating vote type
      if (vote[0].voteType === 'none') {
        await resource.update({
          score: resource.score + 1
        })
        if (recommendation !== null) {
          await recommendation.update({
            score: recommendation.score + 1
          })
        }
      } else if (vote[0].voteType === 'downvote') {
        await resource.update({
          score: resource.score + 2
        })
        if (recommendation !== null) {
          await recommendation.update({
            score: recommendation.score + 2
          })
        }
      }
      //set vote to be upvote
      await vote[0].update({
        voteType: 'upvote'
      })

      await vote[0].setUser(user)

      res.status(200).send(vote[0])
    } else if (req.body.voteType === 'upvote') {
      //sets vote status to none and subtracts 1
      const resource = await Resource.findByPk(req.body.resource.id)
      const user = await User.findByPk(req.user.id)
      const vote = await Vote.findOrCreate({
        where: {resourceId: req.body.resource.id, userId: req.user.id}
      })
      const recommendation = await Recommendation.findOne({
        where: {
          link: resource.link
        }
      })
      await recommendation.update({
        score: resource.score
      })

      await vote[0].update({
        voteType: 'none'
      })
      await vote[0].setUser(user)
      await resource.update({
        score: resource.score - 1
      })
      if (recommendation !== null) {
        await recommendation.update({
          score: recommendation.score - 1
        })
      }

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
      const resource = await Resource.findByPk(req.body.resource.id)
      const recommendation = await Recommendation.findOne({
        where: {link: resource.link}
      })

      if (recommendation !== null) {
        if (vote[0].voteType === 'upvote') {
          await recommendation.update({
            score: recommendation.score - 2
          })
          await resource.update({
            score: resource.score - 2
          })
        } else if (vote[0].voteType === 'none') {
          await recommendation.update({
            score: recommendation.score - 1
          })
          await resource.update({
            score: resource.score - 1
          })
        }
      }
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
      const resource = await Resource.findByPk(req.body.resource.id)
      const recommendation = await Recommendation.findOne({
        where: {link: resource.link}
      })
      if (recommendation !== null) {
        await recommendation.update({
          score: recommendation.score + 1
        })
      }

      await resource.update({
        score: resource.score + 1
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
