const router = require('express').Router()
const {User, Vote, Resource} = require('../db/models')
module.exports = router

router.get('/:resourceId', async (req, res, next) => {
  try {
    const vote = await Vote.findByPk(req.params.resourceId)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const vote = await Vote.findOrCreate({
      where: {
        id: req.body.id
      }
    })
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const vote = await Vote.findOrCreate({
      where: {
        id: req.body.id
      }
    })
  } catch (err) {
    next(err)
  }
})
