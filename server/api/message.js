const router = require('express').Router()
const {Message, User, Conversation} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const message = await Message.findAll({
      where: {
        conversationId: req.params.id
      },
      include: [{model: User}, {model: Conversation}]
    })
    res.status(200).json(message)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const conversation = await Conversation.findOrCreate({
      where: {id: req.body.conversationId}
    })
    const user = await User.findByPk(req.user.id)
    const createMessage = await Message.create({
      content: req.body.content
    })

    await user.addMessage(createMessage)
    await createMessage.setUser(user)
    await createMessage.setConversation(conversation[0])

    const message = await Message.findAll({
      where: {conversationId: req.body.conversationId},
      include: [{model: User}, {model: Conversation}]
    })
    // console.log(conversation)
    // console.log(user)
    // console.log(message.data)
    // console.log('conversation', Object.keys(conversation.__proto__))

    // console.log('user', Object.keys(user.__proto__))

    // console.log('message', Object.keys(message.__proto__))

    res.status(200).json(message)
  } catch (err) {
    next(err)
  }
})
