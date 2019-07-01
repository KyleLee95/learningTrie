const router = require('express').Router()
const {
  Resource,
  Recommendation,
  LearningTree,
  User,
  Link
} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  console.log('req.body', req.params)
  try {
    const resource = await Resource.findByPk(req.params.id)
    let link

    if (resource === null) {
      const recommendation = await Recommendation.findByPk(req.params.id)
      link = await recommendation.getLinks()
      res.status(200).json(link)
    } else {
      link = await resource.getLinks()
      console.log(link)
      res.status(200).json(link)
    }
  } catch (err) {
    next(err)
  }
})
