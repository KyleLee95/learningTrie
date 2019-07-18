const router = require('express').Router()
const {Message, User, Conversation, Recommendation} = require('../db/models')
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
  console.log('body', req.body)
  //If the resource already exists, we're going to just send the ID back along to the front end
  //If the resource does not already exist, we're going to have to get that resource ID
  //If my assumptions are correct, I believe that the order of operations should work as long as I post the recommendation first and then send the message.

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
    let recommendation = {}
    let createMessage = {}
    //If the recommendation does not already exist and you have to create it
    if (req.body.id === undefined) {
      recommendation = await Recommendation.findOne({
        where: {
          title: req.body.title
        }
      })
      createMessage = await Message.create({
        messageType: 'recommendation',
        content: `${req.body.nodeTitle}`,
        tree: req.body.tree,
        treeId: req.body.treeId,
        recommendation: recommendation.title,
        recommendationId: recommendation.id
      })
    } else {
      recommendation = await Recommendation.findOne({
        where: {
          title: req.body.title
        }
      })
      createMessage = await Message.create({
        messageType: 'recommendation',
        content: `recommended the resource ${req.body.title} to node ${
          req.body.nodeTitle
        }`,
        tree: req.body.tree,
        treeId: req.body.treeId,
        recommendation: req.body.title,
        recommendationId: req.body.id
      })
    }

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
    let message = await Message.findAll({
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
    let users
    if (req.body.users === undefined) {
      users = conversation[0].getUsers()
    } else {
      users = req.body.users
    }
    const checkReceiver = users.find(user => {
      return user.id !== req.user.id
    })
    const receiver = await User.findByPk(checkReceiver.id)
    const createMessage = await Message.create({
      content: req.body.content,
      messageType: 'message'
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
