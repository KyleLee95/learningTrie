const router = require('express').Router()
const {LearningTree} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const trees = await LearningTree.findAll()
    res.json(trees)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const tree = await LearningTree.findByPk(req.params.id)
    res.json(tree)
  } catch (err) {
    next(err)
  }
})
