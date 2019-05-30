const router = require('express').Router()
const {Comment, User, Resource, Link} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    //WHEN YOU GET A RESOURCE, GET ALL THE COMMENTS WHERE THE LINK IS THE SAME LIINK
    //findall({where:link: req.body.link, include: [{model: Comment, include:[model: User]}]})

    const comments = await Comment.findAll({
      where: {linkId: req.params.id},
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
    // console.log(req.body)

    let comment = await Comment.create({
      content: req.body.content
    })
    const user = await User.findByPk(req.user.id)
    const link = await Link.findByPk(req.body.linkId)
    //TODO
    //ASSOCIATE THE COMMENT WITH LINK ID
    //NEED TO SEND LINK ID FROM RESOURCE PAGE AND THEN USER ASSOCIATION METHOD from comment (comment.addLink)
    // const resource = await Resource.findByPk(req.body.resourceId)
    await user.addComment(comment)
    // await resource.addComment(comment)
    // console.log('COMMENT', Object.keys(comment.__proto__))

    // console.log('LINK', Object.keys(link.__proto__))

    await comment.setLink(link)
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
