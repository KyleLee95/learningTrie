const router = require('express').Router()
const {Message, User, Conversation} = require('../db/models')
module.exports = router

router.post('/', async (req, res, next) => {
  try {
    res.status(200).send('A')
  } catch (err) {
    next(err)
  }
})
