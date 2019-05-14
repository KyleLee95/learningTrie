const router = require('express').Router()
const {Resource, Node, LearningTree} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const resource = await Resource.findAll()
    res.json(resource)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [{model: Node}]
    })
    res.json(resource)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const resource = await Resource.create({
      title: req.body.title,
      link: req.body.link,
      description: req.body.description,
      type: req.body.type
    })
    const node = await Node.findByPk(Number(req.body.nodeId))
    await node.addResource(resource)
    res.status(201).json(resource)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.body.id)

    const updatedResource = await resource.update({
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      type: req.body.type
    })

    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.body.resource.resource.nodeId, {
      include: [{model: LearningTree}]
    })
    await Resource.destroy({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json(node)
  } catch (err) {
    next(err)
  }
})
