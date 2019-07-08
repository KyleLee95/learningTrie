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

router.post('/recommendResource', async (req, res, next) => {
  try {
    const sender = await User.findByPk(req.user.id)
    const receiver = await User.findByPk(req.body.ownerId)
    const conversation = await Conversation.create({
      subject: `New Resource Recommended to ${req.body.treeName}`,
      senderRead: true,
      receiverRead: false,
      sender: sender.username,
      receiver: receiver.username
    })
    const createMessage = await Message.create({
      content: `${req.user.username} recommended resource: ${
        req.body.title
      } to node ${req.body.nodeTitle}`
    })

    //ownerId from LearningTreeOwnerId

    await receiver.update({
      newMessage: true
    })
    await sender.addMessage(createMessage)
    await createMessage.setUser(sender)
    await createMessage.setConversation(conversation)
    await conversation.addUser(sender)
    await conversation.addUser(receiver)
    if (req.body.isSender === true) {
      await Conversation.update(
        {
          senderRead: true,
          receiverRead: false
        },
        {where: {id: conversation.id}}
      )
    } else {
      await Conversation.update(
        {
          senderRead: false,
          receiverRead: true
        },
        {where: {id: conversation.id}}
      )
    }
    const message = await Message.findAll({
      where: {conversationId: conversation.id},
      include: [{model: User}, {model: Conversation}]
    })

    res.status(200).json(message)
  } catch (err) {
    next(err)
  }
})
router.post('/addedResource', async (req, res, next) => {})

router.post('/', async (req, res, next) => {
  try {
    const conversation = await Conversation.findOrCreate({
      where: {id: req.body.conversationId}
    })

    const sender = await User.findByPk(req.user.id)
    const checkReceiver = req.body.users.find(user => {
      return user.id !== req.user.id
    })
    const receiver = await User.findByPk(checkReceiver.id)
    const createMessage = await Message.create({
      content: req.body.content
    })
    await receiver.update({
      newMessage: true
    })
    await sender.addMessage(createMessage)
    await createMessage.setUser(sender)
    await createMessage.setConversation(conversation[0])
    if (req.body.isSender === true) {
      await Conversation.update(
        {
          senderRead: true,
          receiverRead: false
        },
        {where: {id: req.body.conversationId}}
      )
    } else {
      await Conversation.update(
        {
          senderRead: false,
          receiverRead: true
        },
        {where: {id: req.body.conversationId}}
      )
    }
    const message = await Message.findAll({
      where: {conversationId: req.body.conversationId},
      include: [{model: User}, {model: Conversation}]
    })

    res.status(200).json(message)
  } catch (err) {
    next(err)
  }
})
