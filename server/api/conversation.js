const router = require('express').Router()
const {Conversation, User, Message} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      where: {userId: req.user.id}
    })
    res.status(200).json(conversations)
  } catch (err) {
    console.error(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      where: req.body.conversationId,
      include: [{model: Message, include: [{model: User}]}]
    })
    res.status(200).json(conversations)
  } catch (err) {
    console.error(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const conversation = await Conversation.create({})
    res.status(200).send(conversation)
  } catch (err) {
    console.error(err)
  }
})
