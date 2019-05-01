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
