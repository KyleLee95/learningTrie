const router = require('express').Router()
const {Edge, LearningTree, Node} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const edge = await Edge.findAll({
      where: {
        learningTreeId: req.params.id
      }
    })
    res.json(edge)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Edge.destroy({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json(req.params.id)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  console.log(req.body)
  try {
    const edge = await Edge.create({
      source: req.body.source.id,
      target: req.body.targetNode.id,
      type: req.body.type
    })
    const node = await Node.findByPk(req.body.source.uuid)
    await node.addEdge(edge)
    const learningTree = await LearningTree.findByPk(req.body.treeId)
    await learningTree.addEdge(edge)
    res.status(200).json(edge)
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const edge = await Edge.findByPk(req.body.edge.id)
    const updatedEdge = await edge.update({
      target: req.body.edge.target,
      handleText: req.body.edge.handleText
    })
    res.status(200).json(updatedEdge)
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    await Edge.destroy({
      where: {
        source: req.body.edge.id
      }
    })
    await Edge.destroy({
      where: {
        target: req.body.edge.id
      }
    })
    res.status(200).json(req.body.edge.id)
  } catch (err) {
    next(err)
  }
})
