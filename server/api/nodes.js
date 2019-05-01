const router = require('express').Router()
const {Node} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const node = await Node.findAll()
    console.log(node)
    res.json(node)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const node = await Node.create(req.body)
    res.send('HIT IT')
  } catch (err) {
    next(err)
    console.error(err)
  }
})
