const router = require('express').Router()
const {Comment, User, Resource} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: {resourceId: req.params.id},
      include: [
        {
          model: User
        }
      ]
    })
    res.status(200).json(comments)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      where: {resourceId: req.params.id},
      include: [
        {
          model: User
        }
      ]
    })
    const updatedComment = await comment.update({
      content: req.body.content
    })
    res.status(200).json(updatedComment)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Comment.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).send(req.params.id)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    let comment = await Comment.create({
      content: req.body.content
    })
    const user = await User.findByPk(req.user.id)
    const resource = await Resource.findByPk(req.body.resourceId)
    await user.addComment(comment)
    await resource.addComment(comment)
    await comment.addResource(resource)
    comment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User
        }
      ]
    })
    res.status(201).send(comment)
  } catch (err) {
    next(err)
  }
})
