const router = require('express').Router()
const {Node, LearningTree, Edge} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const node = await Node.findAll({
      where: {learningTreeId: req.params.id}
    })
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

router.put('/', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.body.id)
    const updatedNode = await node.update({
      title: req.body.title,
      description: req.body.description,
      x: req.body.x,
      y: req.body.y
    })
    res.status(200).json(updatedNode)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Edge.destroy({
      where: {target: req.params.id}
    })
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
