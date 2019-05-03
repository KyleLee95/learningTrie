const router = require('express').Router()
const {Node, LearningTree} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const node = await Node.findAll()
    res.json(node)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const node = await Node.create({
      title: req.body.title,
      type: req.body.type,
      x: req.body.x,
      y: req.body.y,
      nodeType: req.body.nodeType
    })
    const learningTree = await LearningTree.findByPk(req.body.treeId)
    await learningTree.addNode(node)
    res.status(201).json(node)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Node.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(req.params.id)
  } catch (err) {
    next(err)
  }
})
