const router = require('express').Router()
const {Conversation, User, Message} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      include: [
        {
          model: User,
          where: {id: req.user.id}
        }
      ]
    })
    res.status(200).json(conversations)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      where: req.body.conversationId,
      include: [{model: User}]
    })
    res.status(200).json(conversations)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const sender = await User.findByPk(req.user.id)
    const receiver = await User.findOne({
      where: {dbUsername: req.body.receiver.toLowerCase()}
    })
    await receiver.update({
      newMessage: true
    })
    const message = await Message.create({
      content: req.body.content
    })

    let conversation = await Conversation.create({
      subject: req.body.subject,
      sender: sender.username,
      receiver: receiver.username
    })
    await sender.addMessage(message)
    await message.setUser(sender)
    await message.setConversation(conversation)
    await conversation.addUser(sender)
    await conversation.addUser(receiver)

    res.status(200).send(conversation)
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    let conversation = await Conversation.findByPk(req.body.conversationId)
    if (req.body.isSender === false) {
      conversation.update({
        receiverRead: !req.body.isSender
      })
    } else {
      conversation.update({
        senderRead: req.body.isSender
      })
    }

    conversation = await Conversation.findByPk(req.body.conversationId)
    res.status(200).send(conversation)
  } catch (err) {
    next(err)
  }
})
