const router = require('express').Router()
const {LearningTree, ResourceTag, Resource} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const tags = await ResourceTag.findAll()
    res.json(tags)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const tag = await ResourceTag.findByPk(req.params.id, {
      include: [
        {
          model: Resource,
          include: [{model: ResourceTag}]
        }
      ]
    })
    // const learningTrees = await LearningTree.findAll({
    //   include: [{model: Tag}, {model: Review}, {model: User}]
    // })
    res.status(200).json(
      tag
      // learningTrees: learningTrees
    )
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const tag = await ResourceTag.findByPk(req.params.id)
    const updatedTag = await tag.update({
      title: req.body.title
    })
    res.status(200).json(updatedTag)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await ResourceTag.destroy({
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
    const tag = await ResourceTag.create({
      title: req.body.title
    })
    const learningTree = await LearningTree.findByPk(req.body.resourceId)
    // console.log(Object.keys(learningTree.__proto__))
    // learningTree.setT(user)
    res.status(201).send(tag)
  } catch (err) {
    next(err)
  }
})
