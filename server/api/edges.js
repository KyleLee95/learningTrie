const router = require('express').Router()
const {Edge} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const edge = await Edge.findAll()
    res.json(edge)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const edge = await Edge.create(req.body)
    // res.send('HIT IT')
    res.json(edge)
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  console.log(req.body)
  try {
    const edge = await Edge.findByPk(req.body.edge.source)
    console.log(edge)
    const updatedEdge = await edge.update({
      target: req.body.edge.target
    })
    res.status(200).json(updatedEdge)
  } catch (err) {
    next(err)
  }
})
