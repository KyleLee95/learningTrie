const router = require('express').Router()
const {User, LearningTree} = require('../db/models')
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

router.post('/', async (req, res, next) => {
  console.log(req.body)
  try {
    const learningTree = await LearningTree.create({
      title: req.body.title,
      description: req.body.description
    })
    const user = await User.findByPk(req.user.id)
    learningTree.setUser(user)
    res.status(200).send({id: learningTree.id})
  } catch (err) {
    next(err)
  }
})
