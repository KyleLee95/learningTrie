const router = require('express').Router()
const {Node, LearningTree, Resource, Recommendation} = require('../db/models')
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
  console.log(req.body)
  try {
    const node = await Node.create({
      title: req.body.title,
      description: req.body.description,
      question: req.body.question,
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
  }
})

router.put('/', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.body.id)
    const updatedNode = await node.update({
      type: req.body.type,
      title: req.body.title,
      question: req.body.question,
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
