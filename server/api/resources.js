const router = require('express').Router()
const {Resource, Node} = require('../db/models')
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
    const resource = await Resource.findByPk(req.params.id)
    res.json(resource)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const resource = await Resource.create({
      title: req.body.title,
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

// router.put('/', async (req, res, next) => {
//   try {
//     const node = await Node.findByPk(req.body.id)
//     if (req.body.resource !== undefined) {
//       // Add Resource
//       const resource = await Resource.create({
//         title: req.body.resource,
//         description: ''
//       })
//       await node.addResource(resource)
//     }
//     const updatedNode = await node.update({
//       title: req.body.title,
//       x: req.body.x,
//       y: req.body.y
//     })

//     res.status(200).json(updatedNode)
//   } catch (err) {
//     next(err)
//   }
// })

router.delete('/:id', async (req, res, next) => {
  try {
    await Resource.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(req.params.id)
  } catch (err) {
    next(err)
  }
})
